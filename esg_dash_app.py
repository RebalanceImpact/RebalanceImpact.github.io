import pandas as pd
import dash
import dash_bootstrap_components as dbc
from dash import dcc, html, Input, Output
import plotly.express as px
import plotly.graph_objects as go
import calendar

# --- THEME COLORS (from Power BI image) ---
PRIMARY_RED = "#B11226"
ACCENT_SAND = "#D4B29C"
FOREST_GREEN = "#147a5c"
DARK_STONE = "#36454F"
LIGHT_STONE = "#f4f5f6"
STONE = "#7D7D7D"
WHITE = "#fff"

# --- LOAD DATA ---
df = pd.read_excel("data.xlsx")

# --- METRIC CARD NUMBERS ---
total_profit = df["Profit"].sum()
total_hours = df[df["Category"] == "Hrs"]["Sum of Amount"].sum() if "Hrs" in df["Category"].unique() else 0

category_breakdown = df[df["Category"].isin(["Cost", "Invoice"])] \
    .groupby("Category")["Sum of Amount"].sum().reset_index()

# --- STYLE SETTINGS ---
CARD_GRAD = "linear-gradient(90deg, #F9E5D6 0%, #E3CABE 100%)"
HEADER_FONT = {"fontFamily": "Segoe UI", "fontWeight": "bold", "color": FOREST_GREEN}
VALUE_FONT = {"fontFamily": "Segoe UI", "fontWeight": "bold", "fontSize": "45px", "letterSpacing": "0.03em"}
SMALL_LABEL = {"fontSize": "17px", "color": "#888", "fontFamily": "Segoe UI"}

# --- HELPERS ---
def make_profit_by_quarter(data):
    temp = data.copy()
    if temp["Quarter"].dtype != "O":
        temp["Quarter"] = temp["Quarter"].astype(str)
    gb = temp.groupby(['Year', 'Quarter'])["Profit"].sum().reset_index()
    gb["YearQuarter"] = gb["Year"].astype(str) + " Q" + gb["Quarter"]
    fig = px.bar(
        gb, x="YearQuarter", y="Profit", text_auto=".1s",
        color_discrete_sequence=[PRIMARY_RED], template="simple_white"
    )
    fig.update_traces(marker_radius=5, marker_line_width=0)
    fig.update_layout(
        title="", yaxis_title="", xaxis_title="",
        plot_bgcolor=WHITE, paper_bgcolor=WHITE, font_color=DARK_STONE,
        font_family="Segoe UI", margin=dict(l=15, r=15, t=18, b=5), height=240,
        showlegend=False,
    )
    fig.update_yaxes(showticklabels=True, showgrid=True, gridwidth=0.5, gridcolor=ACCENT_SAND)
    fig.update_xaxes(tickfont=dict(size=14))
    return fig

def make_profit_by_client(data):
    gb = data.groupby("Client")["Profit"].sum().reset_index().sort_values("Profit", ascending=False).head(12)
    fig = px.bar(
        gb, x="Profit", y="Client", orientation="h",
        color_discrete_sequence=[FOREST_GREEN], template="simple_white"
    )
    fig.update_traces(marker_radius=7, marker_line_width=0)
    fig.update_layout(
        title="", yaxis_title="", xaxis_title="",
        height=325, plot_bgcolor=WHITE, paper_bgcolor=WHITE,
        font_family="Segoe UI", font_color=DARK_STONE,
        margin=dict(l=64, r=36, t=15, b=5), showlegend=False
    )
    fig.update_yaxes(showticklabels=True, automargin=True, tickfont=dict(size=14))
    fig.update_xaxes(showticklabels=True, showgrid=True, gridwidth=0.5, gridcolor=ACCENT_SAND)
    return fig

def make_income_expense_line(data):
    sub = data[data["Category"].isin(["Invoice", "Cost"])].copy()
    # --- Convert string months (e.g., "April") to int ---
    if sub["Month"].dtype == object:
        sub["Month"] = sub["Month"].apply(
            lambda m: list(calendar.month_name).index(m) if m in calendar.month_name else int(m)
        )
    agg = sub.groupby(['Year', 'Month', 'Category'])["Sum of Amount"].sum().reset_index()
    agg["Date"] = pd.to_datetime(dict(year=agg["Year"], month=agg["Month"], day=1))
    fig = px.line(
        agg, x="Date", y="Sum of Amount", color="Category",
        line_shape="spline", markers=True,
        color_discrete_sequence=[ACCENT_SAND, PRIMARY_RED], template="simple_white"
    )
    fig.update_traces(line=dict(width=4), marker=dict(size=10, symbol="circle"))
    fig.update_layout(
        title="", xaxis_title="", yaxis_title="",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1, font=dict(size=13)),
        plot_bgcolor=WHITE, paper_bgcolor=WHITE, font_family="Segoe UI", font_color=DARK_STONE,
        margin=dict(l=40, r=24, t=22, b=8), height=240
    )
    fig.update_yaxes(showticklabels=True, showgrid=True, gridwidth=0.5, gridcolor=LIGHT_STONE)
    return fig

def make_category_pie():
    fig = px.pie(
        category_breakdown, names="Category", values="Sum of Amount", hole=0.6,
        color_discrete_sequence=[FOREST_GREEN, PRIMARY_RED]
    )
    fig.update_traces(textinfo='percent+label', pull=[0.02, 0.02], marker=dict(line=dict(color="white", width=3)))
    fig.update_layout(
        showlegend=False, title="", plot_bgcolor=WHITE, paper_bgcolor=WHITE,
        font_family="Segoe UI", font_color=DARK_STONE,
        margin=dict(l=2, r=2, t=8, b=2), height=210
    )
    return fig

# --- LAYOUT, closely matches Power BI style ---
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.FLATLY])

app.layout = dbc.Container([
    html.Div([
        html.H2("Business Performance Dashboard", style={
            **HEADER_FONT, "textAlign":"left", "fontSize":38, "marginTop":18, "marginBottom":4, "letterSpacing": "0.01em"}),
    ], style={"background": WHITE, "borderRadius": "12px", "padding":"20px 18px", "boxShadow": "0 4px 16px #eee"}),
    
    dbc.Row([
        # SCORECARD TILES (3 cards, spaced & stylized)
        dbc.Col([
            html.Div([
                html.Div("TOTAL PROFIT", style={"fontSize":"15px", "fontWeight":"bold", "color": PRIMARY_RED}),
                html.Div(f"{total_profit / 1000:.2f}K", style={**VALUE_FONT, "color": PRIMARY_RED}),
            ], style={"background":CARD_GRAD, "borderRadius":14, "boxShadow": "2px 6px 14px #ede0d8", "padding":"32px", "margin":"4px"}),
        ], width=3),
        dbc.Col([
            html.Div([
                html.Div("TOTAL HOURS", style={"fontSize":"15px", "fontWeight":"bold", "color": PRIMARY_RED}),
                html.Div(f"{total_hours / 1000:.2f}K", style={**VALUE_FONT, "color": FOREST_GREEN}),
            ], style={"background":CARD_GRAD, "borderRadius":14, "boxShadow": "2px 6px 14px #ede0d8", "padding":"32px", "margin":"4px"}),
        ], width=3),
        dbc.Col([
            html.Div([
                html.Div("DATE RANGE", style={"fontSize":"15px", "fontWeight":"bold", "color": FOREST_GREEN}),
                html.Div(f"{df['Year'].min()} — {df['Year'].max()}", style={**VALUE_FONT, "color": STONE, "fontSize": "34px"}),
            ], style={"background":CARD_GRAD, "borderRadius":14, "boxShadow": "2px 6px 14px #ede0d8", "padding":"32px", "margin":"4px"})
        ], width=2),
        dbc.Col([
            dcc.Dropdown(
                id="client-filter",
                options=[{"label": c, "value": c} for c in df["Client"].unique()],
                multi=True,
                placeholder="Filter clients...",
                style={"background": WHITE, "color": DARK_STONE, "border":"1px solid #e9dddd", "borderRadius":"10px"}
            ),
        ], width=4, style={"display":"flex", "alignItems":"center", "justifyContent": "center", "paddingTop":"18px"})
    ], class_name="g-3", style={"marginBottom":12}),

    # --- GRAPH GRID: mimic Power BI tile arrangement
    dbc.Row([
        dbc.Col([
            html.Div([
                dcc.Graph(id="profit-by-quarter", config={"displayModeBar": False})
            ], style={"background":WHITE, "borderRadius":"18px", "boxShadow": "0 2px 12px #f7f3f2", "padding":"10px 15px"})
        ], width=7),
        dbc.Col([
            html.Div([
                dcc.Graph(figure=make_category_pie(), config={"displayModeBar": False})
            ], style={"background":WHITE, "borderRadius":"18px", "boxShadow": "0 2px 12px #f7f3f2", "padding": "12px 14px"})
        ], width=5),
    ], class_name="g-3", style={"marginBottom":9}),
    dbc.Row([
        dbc.Col([
            html.Div([
                dcc.Graph(id="profit-by-client", config={"displayModeBar": False}),
            ], style={"background":WHITE, "borderRadius":"18px", "boxShadow": "0 2px 12px #f7f3f2", "padding": "12px"})
        ], width=5),
        dbc.Col([
            html.Div([
                dcc.Graph(id="income-expenses", config={"displayModeBar": False}),
            ], style={"background":WHITE, "borderRadius":"18px", "boxShadow": "0 2px 12px #f7f3f2", "padding": "12px"})
        ], width=7),
    ], class_name="g-3")
], fluid=True, style={"background": LIGHT_STONE, "padding":"18px 12px", "minHeight": "110vh"})

# --- DYNAMIC CALLBACK (filter graphs) ---
@app.callback(
    Output("profit-by-quarter", "figure"),
    Output("profit-by-client", "figure"),
    Output("income-expenses", "figure"),
    Input("client-filter", "value")
)
def update_graphs(selected_clients):
    filtered = df if not selected_clients else df[df["Client"].isin(selected_clients)]
    return (
        make_profit_by_quarter(filtered),
        make_profit_by_client(filtered),
        make_income_expense_line(filtered)
    )

if __name__ == "__main__":
    app.run(debug=True)
