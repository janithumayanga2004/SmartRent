
import os
import joblib
import pandas as pd


class RentPredictor:
    def __init__(self, model_path=None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, "model", "best_model.pkl")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")

        self.model = joblib.load(model_path)
        self.feature_names = self._extract_feature_names(self.model, model_path)

    def _extract_feature_names(self, model, model_path):
        if hasattr(model, "feature_names_in_"):
            return list(model.feature_names_in_)
        if hasattr(model, "regressor_") and hasattr(model.regressor_, "feature_names_in_"):
            return list(model.regressor_.feature_names_in_)
        # Check metadata file alongside model
        meta_path = os.path.join(os.path.dirname(model_path), "model_metadata.pkl")
        if os.path.exists(meta_path):
            try:
                meta = joblib.load(meta_path)
                if isinstance(meta, dict) and "features" in meta:
                    return list(meta["features"])
            except Exception:
                pass
        return None

    def predict(self, input_df):
        df = input_df.copy()

        # If model expects specific features, ensure every column is present & aligned
        if self.feature_names:
            # Auto-synthesize composite columns if missing
            if "City_Locality" in self.feature_names and "City_Locality" not in df.columns:
                city = df["City"].astype(str) if "City" in df.columns else "Unknown"
                loc = df["Area Locality"].astype(str) if "Area Locality" in df.columns else "Unknown"
                df["City_Locality"] = city + "_" + loc

            if "City_BHK" in self.feature_names and "City_BHK" not in df.columns:
                city = df["City"].astype(str) if "City" in df.columns else "Unknown"
                bhk = df["BHK"].astype(str) if "BHK" in df.columns else "2"
                df["City_BHK"] = city + "_" + bhk + "BHK"

            if "City_Furnishing" in self.feature_names and "City_Furnishing" not in df.columns:
                city = df["City"].astype(str) if "City" in df.columns else "Unknown"
                furn = df["Furnishing Status"].astype(str) if "Furnishing Status" in df.columns else "Unknown"
                df["City_Furnishing"] = city + "_" + furn

            # Fill any remaining missing features with safe defaults
            for col in self.feature_names:
                if col not in df.columns:
                    df[col] = "Unknown" if "City" in col or "Area" in col else 0

            # Select and order exactly as the model was trained
            df = df[self.feature_names]

        prediction = self.model.predict(df)[0]
        return float(prediction)

