import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, RobustScaler, TargetEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import ExtraTreesRegressor, RandomForestRegressor, VotingRegressor, StackingRegressor
from sklearn.linear_model import Ridge, Lasso
import xgboost as xgb
import lightgbm as lgb
import catboost as cb

from src.preprocessing import create_features


# ──────────────────────────────────────────────────────────
# 1. OUTLIER FILTERING
# ──────────────────────────────────────────────────────────
def apply_outlier_filtering(df, rent_multiplier=2.5):
    """
    Cleans extreme noise and data entry errors using IQR on Rent.
    Filters extreme listings (e.g. 35 Lakh Marathahalli typo, Rent > 90.5k).
    """
    initial_len = len(df)
    
    # Rent IQR
    q1_r = df["Rent"].quantile(0.25)
    q3_r = df["Rent"].quantile(0.75)
    iqr_r = q3_r - q1_r
    lower_rent = max(1000.0, q1_r - rent_multiplier * iqr_r)
    upper_rent = q3_r + rent_multiplier * iqr_r
    
    mask = (df["Rent"] >= lower_rent) & (df["Rent"] <= upper_rent) & (df["Size"] > 0)
    df_clean = df[mask].copy()
    
    print(f"Rent IQR ({rent_multiplier}x): bounds [{lower_rent:.0f}, {upper_rent:.0f}]")
    print(f"Retained {len(df_clean)} / {initial_len} rows (removed {initial_len - len(df_clean)} outliers).")
    return df_clean


# ──────────────────────────────────────────────────────────
# 2. PREPROCESSOR DEFINITION
# ──────────────────────────────────────────────────────────
NUMERIC_FEATURES = [
    "BHK", "Size", "Bathroom", "Current_Floor", "Total_Floors",
    "Floor_Ratio", "Bathroom_BHK_Ratio", "Size_Per_BHK", "Size_Per_Bathroom",
    "BHK_To_Size", "Bathroom_To_Size", "Total_Rooms", "Size_Per_Room", "Log_Size_Per_Room",
    "Is_Top_Floor", "Is_Ground_Floor", "Posted_Year", "Posted_Month", "Posted_DayOfWeek", "Log_Size"
]
CATEGORICAL_TARGET_ENCODE = [
    "Area Locality", "City_Furnishing", "City_AreaType", "City_Tenant"
]
CATEGORICAL_ONEHOT = [
    "Area Type", "City", "Furnishing Status", "Tenant Preferred", "Size_Category"
]


def build_preprocessor():
    return ColumnTransformer(transformers=[
        ("num", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", RobustScaler())
        ]), NUMERIC_FEATURES),
        ("target_enc", TargetEncoder(smooth="auto", cv=5), CATEGORICAL_TARGET_ENCODE),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_ONEHOT)
    ])


# ──────────────────────────────────────────────────────────
# 3. OPTUNA-TUNED CANDIDATE MODELS & ENSEMBLES
# ──────────────────────────────────────────────────────────
def get_candidate_models():
    """
    Returns high-capacity tuned estimators including CatBoost, LightGBM, XGBoost,
    Random Forest, StackingRegressor with Ridge meta-estimator, and Weighted Voting.
    """
    cb_m = cb.CatBoostRegressor(
        iterations=900,
        learning_rate=0.03,
        depth=6,
        l2_leaf_reg=4,
        verbose=0,
        random_seed=42
    )
    
    lgb_m = lgb.LGBMRegressor(
        n_estimators=600,
        learning_rate=0.025,
        max_depth=6,
        num_leaves=31,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbose=-1
    )
    
    xgb_m = xgb.XGBRegressor(
        n_estimators=600,
        learning_rate=0.025,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=1
    )
    
    rf_m = RandomForestRegressor(
        n_estimators=350,
        max_depth=18,
        min_samples_split=3,
        random_state=42,
        n_jobs=1
    )
    
    et_m = ExtraTreesRegressor(
        n_estimators=350,
        max_depth=22,
        min_samples_split=3,
        random_state=42,
        n_jobs=1
    )

    # StackingRegressor: CatBoost, LightGBM, XGBoost, RF as base estimators, Ridge as meta-estimator
    stacking_m = StackingRegressor(
        estimators=[
            ("cb", cb.CatBoostRegressor(iterations=900, learning_rate=0.03, depth=6, l2_leaf_reg=4, verbose=0, random_seed=42)),
            ("lgb", lgb.LGBMRegressor(n_estimators=600, learning_rate=0.025, max_depth=6, num_leaves=31, subsample=0.8, colsample_bytree=0.8, random_state=42, verbose=-1)),
            ("xgb", xgb.XGBRegressor(n_estimators=600, learning_rate=0.025, max_depth=5, subsample=0.8, colsample_bytree=0.8, random_state=42, n_jobs=1)),
            ("rf", RandomForestRegressor(n_estimators=350, max_depth=18, min_samples_split=3, random_state=42, n_jobs=1))
        ],
        final_estimator=Ridge(alpha=1.0),
        cv=5,
        n_jobs=1,
        passthrough=True
    )

    # Tuned Weighted Ensemble
    voting_m = VotingRegressor(
        estimators=[
            ("cb", cb_m),
            ("lgb", lgb_m),
            ("xgb", xgb_m),
            ("rf", rf_m)
        ],
        weights=[0.35, 0.25, 0.25, 0.15]
    )

    return {
        "CatBoost Regressor": cb_m,
        "LightGBM Regressor": lgb_m,
        "XGBoost Regressor": xgb_m,
        "Random Forest Regressor": rf_m,
        "Extra Trees Regressor": et_m,
        "Stacking Regressor (CB+LGB+XGB+RF -> Ridge)": stacking_m,
        "Weighted Ensemble (CatBoost+XGB+LGBM+RF)": voting_m
    }


# ──────────────────────────────────────────────────────────
# 4. MAIN PIPELINE
# ──────────────────────────────────────────────────────────
def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(base_dir)

    cleaned_csv = os.path.join(root_dir, "dataset", "processed", "cleaned_house_rent_dataset.csv")
    engineered_csv = os.path.join(root_dir, "dataset", "processed", "engineered_house_rent_dataset.csv")
    model_dir = os.path.join(base_dir, "model")
    os.makedirs(model_dir, exist_ok=True)

    print("=" * 60)
    print("STEP 1: Load cleaned data and apply outlier filtering")
    print("=" * 60)
    df_raw = pd.read_csv(cleaned_csv)
    print(f"Loaded {len(df_raw)} rows from {cleaned_csv}")

    df_clean = apply_outlier_filtering(df_raw, rent_multiplier=2.5)

    print("\n" + "=" * 60)
    print("STEP 2: Compute engineered features")
    print("=" * 60)
    rent_target = df_clean["Rent"].copy()
    features_df = create_features(df_clean)
    features_df["Rent"] = rent_target.values
    print(f"Engineered dataset shape: {features_df.shape}")

    # Export clean engineered CSV
    features_df.to_csv(engineered_csv, index=False)
    print(f"Saved clean engineered dataset to {engineered_csv}")

    # Train / test split
    X = features_df.drop(columns=["Rent"])
    y = features_df["Rent"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    print(f"X_train shape: {X_train.shape}, X_test shape: {X_test.shape}")

    print("\n" + "=" * 60)
    print("STEP 3: Train and evaluate candidate models & ensembles")
    print("=" * 60)

    preprocessor = build_preprocessor()
    candidate_models = get_candidate_models()

    results = []
    trained_pipelines = {}

    for name, base_model in candidate_models.items():
        print(f"Training {name}...")
        pipeline = TransformedTargetRegressor(
            regressor=Pipeline([
                ("preprocessor", preprocessor),
                ("model", base_model)
            ]),
            func=np.log1p,
            inverse_func=np.expm1
        )
        pipeline.fit(X_train, y_train)
        preds = pipeline.predict(X_test)

        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)

        results.append({
            "Model": name,
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 4)
        })
        trained_pipelines[name] = pipeline
        print(f"[{name:45s}] R2: {r2:.4f} | MAE: {mae:7.2f} | RMSE: {rmse:7.2f}")

    results_df = pd.DataFrame(results)
    print("\n" + "=" * 60)
    print("FINAL MODEL COMPARISON:")
    print("=" * 60)
    print(results_df.sort_values("R2", ascending=False).to_string(index=False))

    # Select best model based on R2
    best_idx = results_df["R2"].idxmax()
    best_name = results_df.loc[best_idx, "Model"]
    best_pipeline = trained_pipelines[best_name]
    best_r2 = results_df.loc[best_idx, "R2"]
    best_mae = results_df.loc[best_idx, "MAE"]
    best_rmse = results_df.loc[best_idx, "RMSE"]

    print("\n" + "=" * 60)
    print(f">>> BEST MODEL: {best_name} (R2 = {best_r2:.4f}, MAE = {best_mae:.2f}, RMSE = {best_rmse:.2f}) <<<")
    print("=" * 60)

    # Save best model pipeline and metadata
    model_path = os.path.join(model_dir, "best_model.pkl")
    meta_path = os.path.join(model_dir, "model_metadata.pkl")

    joblib.dump(best_pipeline, model_path)
    metadata = {
        "model_name": best_name,
        "target": "Rent",
        "r2_score": float(best_r2),
        "mae": float(best_mae),
        "rmse": float(best_rmse),
        "metrics": results_df.to_dict(orient="records"),
        "features": list(X.columns)
    }
    joblib.dump(metadata, meta_path)

    print(f"Saved best model pipeline to {model_path}")
    print(f"Saved metadata to {meta_path}")


if __name__ == "__main__":
    main()
