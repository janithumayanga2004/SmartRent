import numpy as np
import pandas as pd


def extract_floor_features(floor):
    floor = str(floor).strip()

    if floor.lower().startswith("ground"):
        current_floor = 0
    elif floor.lower().startswith("upper basement"):
        current_floor = -2
    elif floor.lower().startswith("lower basement"):
        current_floor = -1
    else:
        try:
            current_floor = int(floor.split()[0])
        except Exception:
            current_floor = 0

    try:
        total_floors = int(floor.split("out of")[1].strip())
    except Exception:
        total_floors = 0

    return current_floor, total_floors


def size_category(size):
    if size < 800:
        return "Small"
    elif size < 1500:
        return "Medium"
    elif size < 2500:
        return "Large"
    else:
        return "Very Large"


def create_features(data):
    """
    Accepts a dictionary or DataFrame representing property features.
    Extracts and computes all engineered features expected by the trained model.
    """
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    else:
        df = data.copy()

    # Extract Floor features if raw Floor string is provided
    if "Floor" in df.columns and "Current_Floor" not in df.columns:
        floors = df["Floor"].apply(lambda x: pd.Series(extract_floor_features(x)))
        df["Current_Floor"] = floors[0]
        df["Total_Floors"] = floors[1]

    if "Current_Floor" not in df.columns:
        df["Current_Floor"] = 0
    if "Total_Floors" not in df.columns:
        df["Total_Floors"] = 0

    # Ratios
    df["Floor_Ratio"] = (df["Current_Floor"] / df["Total_Floors"].replace(0, np.nan)).fillna(0)

    if "Bathroom" in df.columns and "BHK" in df.columns:
        df["Bathroom_BHK_Ratio"] = (df["Bathroom"] / df["BHK"].replace(0, np.nan)).fillna(0)
    else:
        df["Bathroom_BHK_Ratio"] = 0.0

    if "Size" in df.columns and "BHK" in df.columns:
        df["Size_Per_BHK"] = (df["Size"] / df["BHK"].replace(0, np.nan)).fillna(0)
        df["BHK_To_Size"] = (df["BHK"] / df["Size"].replace(0, np.nan)).fillna(0)
    else:
        df["Size_Per_BHK"] = 0.0
        df["BHK_To_Size"] = 0.0

    if "Size" in df.columns and "Bathroom" in df.columns:
        df["Size_Per_Bathroom"] = (df["Size"] / df["Bathroom"].replace(0, np.nan)).fillna(0)
        df["Bathroom_To_Size"] = (df["Bathroom"] / df["Size"].replace(0, np.nan)).fillna(0)
    else:
        df["Size_Per_Bathroom"] = 0.0
        df["Bathroom_To_Size"] = 0.0

    if "BHK" in df.columns and "Bathroom" in df.columns:
        df["Total_Rooms"] = df["BHK"] + df["Bathroom"]
    else:
        df["Total_Rooms"] = 1.0

    if "Size" in df.columns:
        df["Size_Per_Room"] = (df["Size"] / df["Total_Rooms"].replace(0, np.nan)).fillna(0)
        df["Log_Size_Per_Room"] = np.log1p(df["Size_Per_Room"])
    else:
        df["Size_Per_Room"] = 0.0
        df["Log_Size_Per_Room"] = 0.0

    df["Is_Top_Floor"] = ((df["Current_Floor"] == df["Total_Floors"]) & (df["Total_Floors"] > 0)).astype(int)
    df["Is_Ground_Floor"] = (df["Current_Floor"] == 0).astype(int)

    # Dates
    if "Posted_Year" not in df.columns:
        df["Posted_Year"] = 2022
    if "Posted_Month" not in df.columns:
        df["Posted_Month"] = 5
    if "Posted_DayOfWeek" not in df.columns:
        df["Posted_DayOfWeek"] = 2

    # Size Transformations
    if "Size" in df.columns:
        if "Size_Category" not in df.columns:
            df["Size_Category"] = df["Size"].apply(size_category)
        if "Log_Size" not in df.columns:
            df["Log_Size"] = np.log1p(df["Size"])
    else:
        df["Size_Category"] = "Medium"
        df["Log_Size"] = 7.0

    # Composite Categorical Features
    city_series = df["City"].astype(str) if "City" in df.columns else pd.Series(["Unknown"] * len(df))
    locality_series = df["Area Locality"].astype(str) if "Area Locality" in df.columns else pd.Series(["Unknown"] * len(df))
    bhk_series = df["BHK"].astype(str) if "BHK" in df.columns else pd.Series(["2"] * len(df))
    furnishing_series = df["Furnishing Status"].astype(str) if "Furnishing Status" in df.columns else pd.Series(["Unknown"] * len(df))
    area_type_series = df["Area Type"].astype(str) if "Area Type" in df.columns else pd.Series(["Unknown"] * len(df))
    tenant_series = df["Tenant Preferred"].astype(str) if "Tenant Preferred" in df.columns else pd.Series(["Unknown"] * len(df))

    df["City_Locality"] = city_series + "_" + locality_series
    df["City_BHK"] = city_series + "_" + bhk_series + "BHK"
    df["City_Furnishing"] = city_series + "_" + furnishing_series
    df["City_AreaType"] = city_series + "_" + area_type_series
    df["City_Tenant"] = city_series + "_" + tenant_series

    # Standard feature list including all model expectations and interaction signals
    feature_order = [
        "BHK", "Size", "Area Type", "Area Locality", "City", "Furnishing Status", "Tenant Preferred",
        "Bathroom", "Posted_Year", "Posted_Month", "Posted_DayOfWeek", "Current_Floor", "Total_Floors",
        "Floor_Ratio", "Bathroom_BHK_Ratio", "Size_Per_BHK", "Size_Per_Bathroom", "Is_Top_Floor",
        "Is_Ground_Floor", "Size_Category", "Log_Size", "City_Locality", "City_BHK", "City_Furnishing",
        "BHK_To_Size", "Bathroom_To_Size", "Total_Rooms", "Size_Per_Room", "Log_Size_Per_Room",
        "City_AreaType", "City_Tenant"
    ]

    for feat in feature_order:
        if feat not in df.columns:
            df[feat] = 0 if feat not in [
                "Area Type", "Area Locality", "City", "Furnishing Status",
                "Tenant Preferred", "Size_Category", "City_Locality", "City_BHK",
                "City_Furnishing", "City_AreaType", "City_Tenant"
            ] else "Unknown"

    return df[feature_order]

