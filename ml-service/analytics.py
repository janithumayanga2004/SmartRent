# SmartRent Analytics and Helper Services

import os
import pandas as pd
import numpy as np
from database import get_all_db_predictions

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(os.path.dirname(BASE_DIR), "dataset", "raw", "House_Rent_Dataset.csv")

# Baseline capital rate benchmarks per sqft for Indian metros to calculate realistic dynamic yields
METRO_CAPITAL_RATES = {
    "Mumbai": 21000,
    "Delhi": 11500,
    "Bangalore": 7800,
    "Chennai": 7200,
    "Hyderabad": 6400,
    "Kolkata": 4900
}
DEFAULT_CAPITAL_RATE = 8000


def load_dataset():
    """Loads baseline dataset and merges with real-time predictions from smartrent.db."""
    records = []
    
    # 1. Load baseline CSV if present
    if os.path.exists(CSV_PATH):
        try:
            df_csv = pd.read_csv(CSV_PATH)
            # Standardize columns
            if "Rent" in df_csv.columns:
                df_csv = df_csv[df_csv["Rent"] > 0]
            if "Size" in df_csv.columns:
                df_csv = df_csv[df_csv["Size"] > 0]
            if "BHK" in df_csv.columns:
                df_csv = df_csv[df_csv["BHK"] > 0]
            records.append(df_csv)
        except Exception as e:
            print(f"Warning loading CSV dataset: {e}")

    # 2. Load real-time records directly from smartrent.db
    try:
        db_preds = get_all_db_predictions()
        if db_preds:
            db_rows = []
            for p in db_preds:
                db_rows.append({
                    "BHK": float(p.get("bhk", 1)),
                    "Rent": float(p.get("rent", 0)),
                    "Size": float(p.get("size", 500)),
                    "City": str(p.get("city", "Mumbai")),
                    "Furnishing Status": str(p.get("furnishing") or p.get("furnishing_status") or "Semi-Furnished"),
                    "Area Type": str(p.get("area_type", "Super Area")),
                    "Area Locality": str(p.get("area_locality", "")),
                    "Tenant Preferred": str(p.get("tenant_preferred", "Bachelors/Family")),
                    "Bathroom": float(p.get("bathroom", 1)),
                    "Floor": str(p.get("floor", "1 out of 2")),
                    "is_live_db": True
                })
            if db_rows:
                df_db = pd.DataFrame(db_rows)
                records.append(df_db)
    except Exception as e:
        print(f"Warning loading smartrent.db records: {e}")

    if not records:
        return None

    df = pd.concat(records, ignore_index=True)
    df = df[df["Rent"] > 0]
    df = df[df["Size"] > 0]
    df = df[df["BHK"] > 0]
    df["Price_Per_Sqft"] = df["Rent"] / df["Size"]
    return df


def get_analytics(city=None, bhk=None):
    df = load_dataset()
    if df is None:
        return {}

    all_cities = sorted(df["City"].dropna().unique().tolist())
    all_bhks = sorted([int(b) for b in df["BHK"].dropna().unique() if b <= 5])

    # Count database predictions
    db_predictions_count = 0
    try:
        db_records = get_all_db_predictions()
        db_predictions_count = len(db_records)
    except Exception:
        pass

    # Apply filters
    filtered_df = df.copy()
    if city and city != "All":
        filtered_df = filtered_df[filtered_df["City"] == city]
    if bhk and bhk != "All":
        try:
            filtered_df = filtered_df[filtered_df["BHK"] == int(bhk)]
        except ValueError:
            pass

    if len(filtered_df) == 0:
        filtered_df = df.copy()

    total_count = len(filtered_df)
    avg_rent = float(filtered_df["Rent"].mean())
    median_rent = float(filtered_df["Rent"].median())
    avg_size = float(filtered_df["Size"].mean())
    avg_sqft = float(filtered_df["Price_Per_Sqft"].mean())

    # 1. Summary Metrics
    summary = {
        "total_listings": int(total_count),
        "total_dataset_records": int(len(df)),
        "db_realtime_records": db_predictions_count,
        "avg_rent": round(avg_rent, 0),
        "median_rent": round(median_rent, 0),
        "min_rent": round(float(filtered_df["Rent"].min()), 0),
        "max_rent": round(float(filtered_df["Rent"].max()), 0),
        "avg_size": round(avg_size, 0),
        "avg_price_per_sqft": round(avg_sqft, 1)
    }

    # 2. Bar Chart: Metro City Comparison
    city_base_df = df.copy()
    if bhk and bhk != "All":
        city_base_df = city_base_df[city_base_df["BHK"] == int(bhk)]

    by_city = []
    for c, group in city_base_df.groupby("City"):
        c_avg_rent = float(group["Rent"].mean())
        c_med_rent = float(group["Rent"].median())
        c_sqft = float(group["Price_Per_Sqft"].mean())
        c_cap_rate = METRO_CAPITAL_RATES.get(c, DEFAULT_CAPITAL_RATE)
        # Yield = (Monthly Rent * 12) / (Size * Capital Rate per sqft) * 100
        c_yield = round(((c_sqft * 12) / c_cap_rate) * 100, 2)

        by_city.append({
            "city": c,
            "avg_rent": round(c_avg_rent, 0),
            "median_rent": round(c_med_rent, 0),
            "price_per_sqft": round(c_sqft, 1),
            "count": int(len(group)),
            "avg_size": round(float(group["Size"].mean()), 0),
            "estimated_yield": c_yield,
            "isSelected": (city == c)
        })
    by_city = sorted(by_city, key=lambda x: x["avg_rent"], reverse=True)

    # 3. Pie/Donut Chart: Furnishing Status Breakdown
    by_furnishing = []
    furnishing_colors = {
        "Semi-Furnished": "#38bdf8",  # Cyan
        "Unfurnished": "#94a3b8",     # Slate
        "Furnished": "#34d399"        # Emerald
    }
    for status, group in filtered_df.groupby("Furnishing Status"):
        pct = round(float(len(group) / total_count * 100), 1)
        by_furnishing.append({
            "name": status,
            "value": int(len(group)),
            "percentage": pct,
            "avg_rent": round(float(group["Rent"].mean()), 0),
            "price_per_sqft": round(float(group["Price_Per_Sqft"].mean()), 1),
            "color": furnishing_colors.get(status, "#a78bfa")
        })
    by_furnishing = sorted(by_furnishing, key=lambda x: x["value"], reverse=True)

    # 4. Line Chart: BHK Price Scaling Curve
    bhk_base_df = df.copy()
    if city and city != "All":
        bhk_base_df = bhk_base_df[bhk_base_df["City"] == city]

    by_bhk = []
    for b_num, group in bhk_base_df[bhk_base_df["BHK"] <= 5].groupby("BHK"):
        b_avg = float(group["Rent"].mean())
        b_med = float(group["Rent"].median())
        b_sqft = float(group["Price_Per_Sqft"].mean())
        by_bhk.append({
            "bhk": f"{int(b_num)} BHK",
            "bhk_num": int(b_num),
            "avg_rent": round(b_avg, 0),
            "median_rent": round(b_med, 0),
            "price_per_sqft": round(b_sqft, 1),
            "avg_size": round(float(group["Size"].mean()), 0),
            "count": int(len(group))
        })
    by_bhk = sorted(by_bhk, key=lambda x: x["bhk_num"])

    # 5. Smart Investment Insights
    highest_metro = max(by_city, key=lambda x: x["avg_rent"]) if by_city else None
    lowest_metro = min(by_city, key=lambda x: x["avg_rent"]) if by_city else None
    yield_metro = max(by_city, key=lambda x: x["estimated_yield"]) if by_city else None

    active_cap_rate = METRO_CAPITAL_RATES.get(city, DEFAULT_CAPITAL_RATE) if city and city != "All" else DEFAULT_CAPITAL_RATE
    curr_yield = round(((avg_sqft * 12) / active_cap_rate) * 100, 2)
    annual_cashflow = round(avg_rent * 12, 0)

    bhk_counts = df["BHK"].value_counts()
    top_bhk_num = int(bhk_counts.index[0]) if len(bhk_counts) > 0 else 2
    top_bhk_share = round(float(bhk_counts.iloc[0] / len(df) * 100), 1) if len(bhk_counts) > 0 else 47.7

    insights = {
        "roi_yield": {
            "estimated_yield_pct": curr_yield,
            "annual_rental_cashflow": annual_cashflow,
            "yield_benchmark": "Strong Yield (3.8% - 5.5% Tier-1 Avg)",
            "context": f"Calculated for {city or 'Pan-India'} with {bhk or 'all'} BHK configs"
        },
        "budget_metro": {
            "city": lowest_metro["city"] if lowest_metro else "Kolkata",
            "avg_rent": lowest_metro["avg_rent"] if lowest_metro else 11645,
            "price_per_sqft": lowest_metro["price_per_sqft"] if lowest_metro else 16.5,
            "highlight": "Lowest Entry Barrier",
            "description": f"{lowest_metro['city'] if lowest_metro else 'Kolkata'} offers optimal affordability with the lowest capital outlay per square foot."
        },
        "highest_yield_metro": {
            "city": yield_metro["city"] if yield_metro else "Hyderabad",
            "estimated_yield": yield_metro["estimated_yield"] if yield_metro else 4.43,
            "avg_rent": yield_metro["avg_rent"] if yield_metro else 20555,
            "price_per_sqft": yield_metro["price_per_sqft"] if yield_metro else 23.6,
            "highlight": "Optimal Capital-to-Rent Ratio",
            "description": f"{yield_metro['city'] if yield_metro else 'Hyderabad'} demonstrates superior rental velocity relative to property acquisition costs."
        },
        "top_demand_config": {
            "config": f"{top_bhk_num} BHK",
            "market_share_pct": top_bhk_share,
            "description": f"{top_bhk_num} BHK residences command {top_bhk_share}% of tenant inquiries and provide the shortest vacancy durations."
        }
    }

    return {
        "summary": summary,
        "by_city": by_city,
        "by_furnishing": by_furnishing,
        "by_bhk": by_bhk,
        "insights": insights,
        "filters": {
            "available_cities": ["All"] + all_cities,
            "available_bhks": ["All"] + [f"{b} BHK" for b in all_bhks],
            "active_city": city or "All",
            "active_bhk": f"{bhk} BHK" if bhk and str(bhk) != "All" else "All"
        }
    }


def get_city_localities():
    df = load_dataset()
    if df is None:
        return {}

    localities = {}
    for city, group in df.groupby("City"):
        if "Area Locality" in group.columns:
            top_locs = group["Area Locality"].value_counts().head(10).index.tolist()
            localities[city] = [l for l in top_locs if l]
        else:
            localities[city] = []

    return localities
