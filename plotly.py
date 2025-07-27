import pandas as pd
import dash
from dash import dcc, html, Input, Output
import plotly.express as px

# Load the Excel file and transform (mimicking Power Query steps)
df = pd.read_excel("Will - Finance .xlsx", sheet_name="Sheet1", skiprows=5)
df = df.drop(columns=[col for col in df.columns if "Column" in col])
df = df.melt(id_vars=["Client"], var_name="Attribute", value_name="Amount")

# Extract category (Invoice, Cost, Hrs) and month from Attribute
df["Category"] = df["Attribute"].str.extract(r'([A-Za-z]+)$')
df["Date"] = df["Attribute"].str.extract(r'([A-Za-z]+)(\d{4})')[0] + df["Attribute"].str.extract(r'([A-Za-z]+)(\d{4})')[1]
df["Date"] = pd.to_datetime(df["Date"], format="%B%Y")

# Calculate Profit
profit_df = df.pivot_table(index=["Client", "Date"], columns="Category", values="Amount", aggfunc="sum").reset_index()
profit_df["Profit"] = profit_df["Invoice"] - profit_df["Cost"]

# Summary metrics
total_profit = profit_df["Profit"].sum()
total_hours = df[df["Category"] == "Hrs"]["Amount"].sum()
category_breakdown = df[df["Category"].isin(["Cost", "Invoice"])].groupby("Category")["Amount"].sum().reset_index()

# Dash App Setup
app = dash.Dash(_name_)
app.layout = html.Div([
    html.H1("📊 Business Performance Dashboard", style={'textAlign': 'center'}),

    html.Div([
        html.Div([
            html.H3("Total Profit"),
            html.Div(f"{total_profit/1000:.2f}K", style={"fontSize": "32px", "color": "red"})
        ], style={"width": "48%", "display": "inline-block"}),

        html.Div([
            html.H3("Total Hours"),
            html.Div(f"{total_hours/1000:.2f}K", style={"fontSize": "32px", "color": "red"})
        ], style={"width": "48%", "display": "inline-block"})
    ]),

    html.Div([
        dcc.Dropdown(
            id="client-filter",
            options=[{"label": c, "value": c} for c in profit_df["Client"].unique()],
            multi=True,
            placeholder="Select clients to filter..."
        )
    ], style={"marginBottom": "20px"}),

    html.Div([
        dcc.Graph(id="profit-by-quarter"),
        dcc.Graph(id="profit-by-client"),
        dcc.Graph(id="income-expenses"),
        dcc.Graph(
            figure=px.pie(category_breakdown, names="Category", values="Amount", title="Category Breakdown")
        )
    ]),

    html.Div([
        html.H4("Date Range"),
        html.Div(f"{profit_df['Date'].min().date()} — {profit_df['Date'].max().date()}")
    ], style={"textAlign": "center", "marginTop": "20px"})
])

@app.callback(
    Output("profit-by-quarter", "figure"),
    Output("profit-by-client", "figure"),
    Output("income-expenses", "figure"),
    Input("client-filter", "value")
)
def update_graphs(selected_clients):
    filtered = profit_df if not selected_clients else profit_df[profit_df["Client"].isin(selected_clients)]

    fig1 = px.bar(
        filtered.groupby("Date")["Profit"].sum().reset_index(),
        x="Date", y="Profit", title="Profit by Year and Quarter"
    )

    fig2 = px.bar(
        filtered.groupby("Client")["Profit"].sum().sort_values(ascending=False).reset_index(),
        x="Profit", y="Client", orientation="h", title="Profit by Client"
    )

    income_expenses_df = df[df["Category"].isin(["Invoice", "Cost"])]
    if selected_clients:
        income_expenses_df = income_expenses_df[income_expenses_df["Client"].isin(selected_clients)]
    income_expenses = income_expenses_df.groupby(["Date", "Category"])["Amount"].sum().reset_index()
    fig3 = px.line(
        income_expenses, x="Date", y="Amount", color="Category", title="Income vs Expenses"
    )

    return fig1, fig2, fig3

if _name_ == '_main_':
    app.run_server(debug=True)