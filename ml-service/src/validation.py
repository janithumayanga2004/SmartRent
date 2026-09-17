REQUIRED_RAW_FIELDS = [
    "BHK",
    "Size",
    "Area Type",
    "Area Locality",
    "City",
    "Furnishing Status",
    "Tenant Preferred",
    "Bathroom"
]


def validate_input(data):
    if not isinstance(data, dict):
        return False, ["Input must be a JSON object"]

    missing = [field for field in REQUIRED_RAW_FIELDS if field not in data]
    if "Floor" not in data and "Current_Floor" not in data:
        missing.append("Floor (or Current_Floor)")

    if missing:
        return False, [f"Missing required fields: {', '.join(missing)}"]

    try:
        bhk = float(data.get("BHK", 0))
        if bhk <= 0:
            return False, ["BHK must be greater than 0"]
    except (ValueError, TypeError):
        return False, ["BHK must be a valid number"]

    try:
        size = float(data.get("Size", 0))
        if size <= 0:
            return False, ["Size must be greater than 0"]
    except (ValueError, TypeError):
        return False, ["Size must be a valid number"]

    try:
        bathroom = float(data.get("Bathroom", 0))
        if bathroom <= 0:
            return False, ["Bathroom must be greater than 0"]
    except (ValueError, TypeError):
        return False, ["Bathroom must be a valid number"]

    return True, []
