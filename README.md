# 🏠 SmartRent

### Machine Learning Based House Rental Price Prediction & Property Recommendation System

SmartRent is a full-stack machine learning application that predicts **monthly house rental prices**, provides **rental market analytics**, and supports **property recommendations** using real-world rental listing data.

---

## ✨ Features

* 🏠 House rental price prediction
* 🤖 Machine learning powered predictions
* 🔎 Property recommendation
* 📊 Rental market analytics
* 📈 Interactive data visualization
* 👤 User registration and authentication
* 🔐 JWT-based authentication
* 🔑 Google Sign-In
* 🏘️ Rental property management
* 📱 Responsive modern interface
* 📋 Prediction and rental data management

---

# 🛠️ Tech Stack

### 🎨 Frontend

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts_3-22B5BF?style=for-the-badge)
![Lucide React](https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge)
![CSS](https://img.shields.io/badge/Modern_CSS-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![Oxlint](https://img.shields.io/badge/Oxlint-111111?style=for-the-badge)

### ⚙️ Backend

![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask_3.x-000000?style=for-the-badge\&logo=flask\&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite_3-003B57?style=for-the-badge\&logo=sqlite\&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge\&logo=sqlalchemy\&logoColor=white)
![PyJWT](https://img.shields.io/badge/PyJWT-000000?style=for-the-badge)

### 🤖 Machine Learning & Data

![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge\&logo=scikit-learn\&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge\&logo=pandas\&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge\&logo=numpy\&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-189FDD?style=for-the-badge)
![Joblib](https://img.shields.io/badge/Joblib-4B8BBE?style=for-the-badge)

---

# 🎯 Project Objectives

SmartRent aims to:

* Predict monthly rental prices using machine learning.
* Analyze rental market trends.
* Help users find suitable rental properties.
* Provide data-driven property recommendations.
* Visualize rental market information.
* Demonstrate an end-to-end machine learning application.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │     React 19         │
                         │       Vite 8         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Flask Backend     │
                         │      Flask 3.x       │
                         └───────┬────────┬─────┘
                                 │        │
                    ┌────────────┘        └────────────┐
                    ▼                                  ▼
          ┌──────────────────┐              ┌──────────────────┐
          │    SQLite 3      │              │  ML Prediction   │
          │   smartrent.db   │              │     Pipeline     │
          └──────────────────┘              └────────┬─────────┘
                                                     │
                                                     ▼
                                           ┌──────────────────┐
                                           │ Voting Ensemble  │
                                           │ XGBoost + RF     │
                                           └──────────────────┘
```

---

# 📊 Dataset

SmartRent uses the **House Rent Dataset** containing **4,746 rental listings** from major Indian Tier-1 cities.

### Cities Covered

* Mumbai
* Delhi
* Bangalore
* Chennai
* Hyderabad
* Kolkata

### Main Dataset Features

```text
Posted On
BHK
Rent
Size
Floor
Area Type
Area Locality
City
Furnishing Status
Tenant Preferred
Bathroom
Point of Contact
```

The target variable for rental price prediction is:

```text
Rent
```

---

# 🧹 Data Preprocessing

The machine learning pipeline performs preprocessing before model training and prediction.

### Numerical Features

The pipeline processes:

```text
BHK
Size
Bathroom
Current_Floor
Total_Floors
Floor_Ratio
Bathroom_BHK_Ratio
Size_Per_BHK
Size_Per_Bathroom
Is_Top_Floor
Is_Ground_Floor
Posted_Year
Posted_Month
Posted_DayOfWeek
Log_Size
```

Numerical preprocessing includes:

* Median imputation
* StandardScaler

### Categorical Features

```text
Area Type
Area Locality
City
Furnishing Status
Tenant Preferred
Size_Category
City_Locality
City_BHK
City_Furnishing
```

Categorical preprocessing uses:

```text
TargetEncoder
```

with cross-validation to encode categorical information effectively.

---

# ⚙️ Feature Engineering

SmartRent creates additional features from the original dataset to improve prediction performance.

### Date Features

```text
Posted_Year
Posted_Month
Posted_DayOfWeek
```

### Floor Features

```text
Current_Floor
Total_Floors
Floor_Ratio
Is_Top_Floor
Is_Ground_Floor
```

### Property Features

```text
Bathroom_BHK_Ratio
Size_Per_BHK
Size_Per_Bathroom
Size_Category
Log_Size
```

These engineered features provide additional information about property characteristics and help the models learn rental-price patterns.

---

# 🧠 Machine Learning

Several machine learning models were evaluated using the same preprocessing and log-target pipeline.

### Models Evaluated

* Linear Regression
* Random Forest
* XGBoost
* Voting Ensemble

The rental price target is transformed using:

```text
np.log1p
```

and converted back to the original scale using:

```text
np.expm1
```

This helps the models handle the skewed distribution of rental prices.

---

# 🏆 Final Model

The **Voting Ensemble (LogTarget)** was selected as the final SmartRent prediction model.

The ensemble combines:

```text
                Voting Ensemble
                       │
              ┌────────┴────────┐
              │                 │
          XGBoost          Random Forest
           Weight 2            Weight 1
              │                 │
              └────────┬────────┘
                       │
                       ▼
                Final Prediction
```

### Model Configuration

**Random Forest**

```text
n_estimators = 800
max_depth = 18
min_samples_split = 2
min_samples_leaf = 1
max_features = 0.7
```

**XGBoost**

```text
n_estimators = 1500
learning_rate = 0.012
max_depth = 6
subsample = 0.75
colsample_bytree = 0.7
min_child_weight = 3
gamma = 0.05
reg_alpha = 0.1
reg_lambda = 1.0
```

The Voting Regressor uses:

```text
XGBoost       → Weight 2
Random Forest → Weight 1
```

---

# 📈 Final Model Performance

The selected **Voting Ensemble (LogTarget)** achieved:

```text
MAE  : ₹4,657.56
RMSE : ₹8,479.29
R²   : 0.8529
```

### Performance Summary

* **MAE:** The average absolute prediction error is approximately ₹4,658.
* **RMSE:** Larger prediction errors receive greater penalty, resulting in approximately ₹8,479.
* **R²:** The model explains approximately **85.29% of the variance** in rental prices.

The Voting Ensemble was selected because it provided the best overall performance among the evaluated models.

---

# 📊 Rental Market Analytics

SmartRent provides interactive analytics using **Recharts**.

The system can visualize:

* City-wise rental prices
* Average rent
* Rental price distribution
* BHK-based rental trends
* Property-size analysis
* Furnishing-status analysis
* Rental market statistics
* Property information

---

# 🔐 Authentication & Security

SmartRent provides secure authentication using:

* **JWT**
* **Google Identity Services**
* **Bcrypt / Werkzeug**
* **Flask-CORS**

### Token Configuration

```text
Access Token  → 15 minutes
Refresh Token → 7 days
```

JWT authentication protects user-specific application functionality.

---

# 🗄️ Database

SmartRent uses:

```text
SQLite 3
```

Database:

```text
smartrent.db
```

Database operations are handled using:

```text
SQLAlchemy
```

---

# 📁 Project Structure

```text
SmartRent/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── backend/
│   ├── app/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   └── app.py
│
├── ml-service/
│   └── model/
│       ├── best_model.pkl
│       └── model_metadata.pkl
│
├── dataset/
│   └── raw/
│       └── House_Rent_Dataset.csv
│
├── notebooks/
│   ├── 01_data_understanding.ipynb
│   ├── 02_data_cleaning.ipynb
│   ├── 03_feature_engineering.ipynb
│   ├── 04_model_training.ipynb
│   └── 05_model_evaluation.ipynb
│
├── docs/
│
└── README.md
```

---

# 📓 Machine Learning Notebooks

The ML development process is organized into five notebooks:

### 01 — Data Understanding

Explores the dataset, columns, data types, distributions, and initial data quality.

### 02 — Data Cleaning

Handles missing values, data formatting, and dataset preparation.

### 03 — Feature Engineering

Creates additional numerical, categorical, date, floor, and property features.

### 04 — Model Training

Builds and trains the machine learning models.

### 05 — Model Evaluation

Compares model performance and selects the final prediction model.

---

# 💾 Trained Model

The final trained model and metadata are stored in:

```text
ml-service/model/
```

### Model Files

```text
best_model.pkl
model_metadata.pkl
```

`best_model.pkl` contains the trained prediction pipeline, while `model_metadata.pkl` stores the required model metadata.

---

# 🔄 Prediction Workflow

```text
User
  │
  ▼
React Frontend
  │
  ▼
Rental Property Inputs
  │
  ▼
Flask Backend
  │
  ▼
Feature Engineering
  │
  ▼
Preprocessing Pipeline
  │
  ├── Numerical Imputation
  ├── Standard Scaling
  └── Target Encoding
  │
  ▼
Voting Ensemble
  │
  ├── XGBoost
  └── Random Forest
  │
  ▼
Predicted Rental Price
  │
  ▼
React Frontend
```

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/janithumayanga2004/SmartRent.git

cd SmartRent
```

## 2. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 3. Backend Setup

Create a Python virtual environment:

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Start the Flask backend:

```bash
python app.py
```

---

# 🧪 Machine Learning Environment

The machine learning components use Python and the following major libraries:

```text
Python 3.11
Pandas
NumPy
Scikit-Learn
XGBoost
Joblib
Matplotlib
Seaborn
```

The trained pipeline can be regenerated using the notebooks inside:

```text
notebooks/
```

---

# 🌟 Key Highlights

### 🤖 Machine Learning

End-to-end rental price prediction using a log-target ensemble model.

### 📊 Data Analytics

Interactive rental market visualization and analysis.

### 🔐 Secure Authentication

JWT and Google-based authentication with access and refresh token management.

### 🏠 Property Recommendations

Supports data-driven property discovery and recommendation.

### 🎨 Modern UI

Responsive frontend built with React, Vite, custom CSS, Recharts, and Lucide React.

### 🗃️ Structured Data Management

SQLite database integrated through SQLAlchemy.

---

# 🔮 Future Improvements

* 🇱🇰 Integration of Sri Lankan rental datasets
* 🗺️ Location-based recommendations
* 📍 Map integration
* 📱 Mobile application
* ☁️ Cloud deployment
* 🔄 Automated model retraining
* 📈 Advanced rental market forecasting
* 🤖 Improved recommendation algorithms

---

# 👥 Team Project

SmartRent was developed as a group academic project combining:

* Machine Learning
* Data Science
* Frontend Development
* Backend Development
* Database Management
* Data Visualization
* Software Engineering

---

# 🎓 Academic Purpose

SmartRent demonstrates the practical implementation of:

```text
Machine Learning
       +
Data Processing
       +
Full-Stack Development
       +
Database Management
       +
Data Visualization
```

The project focuses on applying machine learning to a real-world rental-price prediction problem while providing a complete user-facing application.

---

# 📄 License

This project was developed for **academic and educational purposes**.

---

<div align="center">

## 🏠 SmartRent

### Predict • Analyze • Recommend

**Machine Learning Based House Rental Price Prediction & Property Recommendation System**

Built with ❤️ using **React • Flask • SQLite • Machine Learning**

</div>
