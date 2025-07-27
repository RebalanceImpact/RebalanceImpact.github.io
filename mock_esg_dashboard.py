import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

# Generate mock data
np.random.seed(42)
months = pd.date_range(start="2024-01-01", periods=12, freq="M")

data = pd.DataFrame({
    "Date": months,
    "Carbon Emissions": np.random.uniform(1500, 2500, 12),
    "Water Usage": np.random.uniform(6000, 10000, 12),
    "Employee Satisfaction": np.random.uniform(70, 95, 12),
    "Waste Recycled %": np.random.uniform(35, 90, 12),
    "Energy Consumption": np.random.uniform(2000, 3500, 12)
})

# Dashboard layout similar to your image: 2 rows × 3 charts
fig = make_subplots(
    rows=2, cols=3,
    specs=[[{}, {}, {}], [{"type": "domain"}, {}, {}]],
    subplot_titles=(
        'Carbon Emissions Over Time',
        'Water Usage Over Time',
        'Waste Recycled (%) Over Time',
        'Employee Satisfaction Distribution',
        'Energy Consumption',
        'KPI Trends Overview'
    )
)

# Top Row
fig.add_trace(go.Scatter(
    x=data["Date"], y=data["Carbon Emissions"],
    mode="lines+markers", name="CO2 Emissions", line=dict(color="seagreen")), 1, 1)
fig.add_trace(go.Scatter(
    x=data["Date"], y=data["Water Usage"],
    mode="lines+markers", name="Water Usage", line=dict(color="dodgerblue")), 1, 2)
fig.add_trace(go.Scatter(
    x=data["Date"], y=data["Waste Recycled %"],
    mode="lines+markers", name="Waste Recycled %", line=dict(color="orange")), 1, 3)

# Bottom Row Left - Employee Satisfaction Pie Chart
bins = [70, 75, 80, 85, 90, 95, 100]
labels = [f"{int(b)}–{int(b+5)}" for b in bins[:-1]]
employee_bins = pd.cut(data["Employee Satisfaction"], bins=bins, labels=labels, right=False)
counts = employee_bins.value_counts(sort=False)
fig.add_trace(go.Pie(labels=labels, values=counts, name="Emp. Sat", hole=0.5), 2, 1)

# Bottom Row Middle - Energy Consumption Bar
fig.add_trace(go.Bar(
    x=data["Date"], y=data["Energy Consumption"], 
    marker_color='mediumpurple', name="Energy Used"), 2, 2)

# Bottom Row Right - Stacked Trends
fig.add_trace(go.Scatter(
    x=data["Date"], y=data["Carbon Emissions"], mode="lines", name="CO2", line=dict(dash="dot")), 2, 3)
fig.add_trace(go.Scatter(
    x=data["Date"], y=data["Water Usage"], mode="lines", name="Water", line=dict(dash="dot")), 2, 3)
fig.add_trace(go.Scatter(
    x=data["Date"], y=data["Energy Consumption"], mode="lines", name="Energy", line=dict(dash="dot")), 2, 3)

# Finishing Touches
fig.update_layout(
    title="Mock Company ESG Dashboard",
    height=800, width=1200,
    template="plotly_white",
    legend=dict(orientation="h", yanchor="bottom", y=-0.25, xanchor="center", x=0.5)
)
fig.write_html("esg_dashboard.html")
print("Dashboard saved as esg_dashboard.html")
