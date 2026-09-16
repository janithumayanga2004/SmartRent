from src.preprocessing import extract_floor_features, create_features


def test_ground_floor():
    current, total = extract_floor_features("Ground out of 2")
    assert current == 0
    assert total == 2


def test_normal_floor():
    current, total = extract_floor_features("3 out of 5")
    assert current == 3
    assert total == 5


def test_create_features():
    raw_data = {
        "BHK": 2,
        "Size": 1100,
        "Floor": "1 out of 4",
        "Area Type": "Super Area",
        "Area Locality": "Salt Lake City Sector 2",
        "City": "Kolkata",
        "Furnishing Status": "Semi-Furnished",
        "Tenant Preferred": "Bachelors/Family",
        "Bathroom": 2
    }
    processed_df = create_features(raw_data)
    assert processed_df.shape == (1, 31)
    assert processed_df.loc[0, "Current_Floor"] == 1
    assert processed_df.loc[0, "Total_Floors"] == 4
    assert processed_df.loc[0, "Floor_Ratio"] == 0.25
    assert processed_df.loc[0, "Bathroom_BHK_Ratio"] == 1.0
    assert processed_df.loc[0, "Size_Per_BHK"] == 550.0
    assert round(float(processed_df.loc[0, "BHK_To_Size"]), 4) == round(2 / 1100, 4)
    assert processed_df.loc[0, "Total_Rooms"] == 4
    assert processed_df.loc[0, "Size_Per_Room"] == 275.0
    assert processed_df.loc[0, "City_Locality"] == "Kolkata_Salt Lake City Sector 2"
    assert processed_df.loc[0, "City_BHK"] == "Kolkata_2BHK"
    assert processed_df.loc[0, "City_Furnishing"] == "Kolkata_Semi-Furnished"
    assert processed_df.loc[0, "Is_Top_Floor"] == 0
    assert processed_df.loc[0, "Is_Ground_Floor"] == 0
    assert processed_df.loc[0, "Size_Category"] == "Medium"


