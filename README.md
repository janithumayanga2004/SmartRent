# 🏠 SmartRent

### Machine Learning Based House Rental Price Prediction & Property Recommendation System

SmartRent is a full-stack machine learning application designed to **predict house rental prices** and provide **rental market analytics and property recommendations**.

The system combines a React-based frontend, Flask backend, SQLite database, and a machine learning prediction engine trained on real rental listing data.

---

## ✨ Features

* 🏠 House rental price prediction
* 🤖 Machine learning based predictions
* 📊 Rental market analytics
* 🔎 Property recommendation
* 👤 User registration and authentication
* 🔐 JWT-based authentication
* 🔑 Google Sign-In
* 📈 Interactive charts and visualizations
* 🗃️ Rental listing management
* 📱 Responsive modern interface
* 📋 Prediction history and user data management

---

## 🧩 System Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │     React 19        │
                    │      Vite 8         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Flask Backend    │
                    │      Flask 3.x      │
                    │    REST Services    │
                    └───────┬───────┬─────┘
                            │       │
                  ┌─────────┘       └──────────┐
                  ▼                            ▼
        ┌─────────────────┐          ┌──────────────────┐
        │   SQLite 3      │          │   ML Prediction  │
        │  smartrent.db   │          │     Engine       │
        └─────────────────┘          └────────┬─────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ ExtraTrees Model │
                                    │ + Log Transform  │
                                    └──────────────────┘
```

---

# 🛠️ Tech Stack

## 🎨 Frontend

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts_3-22B5BF?style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge)
![CSS](https://img.shields.io/badge/Modern_CSS-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![Oxlint](https://img.shields.io/badge/Oxlint-111111?style=for-the-badge)

## ⚙️ Backend

![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask_3.x-000000?style=for-the-badge\&logo=flask\&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite_3-003B57?style=for-the-badge\&logo=sqlite\&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge\&logo=sqlalchemy\&logoColor=white)
![JWT](https://img.shields.io/badge/PyJWT-000000?style=for-the-badge)

## 🤖 Machine Learning & Data

![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge\&logo=scikit-learn\&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge\&logo=pandas\&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge\&logo=numpy\&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-189FDD?style=for-the-badge)
![LightGBM](https://img.shields.io/badge/LightGBM-9ACD32?style=for-the-badge)
![CatBoost](https://img.shields.io/badge/CatBoost-FFCC00?style=for-the-badge\&logoColor=black)
![Joblib](https://img.shields.io/badge/Joblib-4B8BBE?style=for-the-badge)

---

# 🎯 Objectives

SmartRent aims to:

* Predict monthly house rental prices using machine learning.
* Analyze rental market trends.
* Help users identify suitable rental properties.
* Provide data-driven rental recommendations.
* Demonstrate an end-to-end machine learning application.
* Provide a secure platform for managing users and rental information.

---

# 📊 Dataset

SmartRent uses the **House Rent Dataset** containing **4,746 verified rental listings**.

The dataset covers major Indian Tier-1 cities:

* Mumbai
* Delhi
* Bangalore
* Chennai
* Hyderabad
* Kolkata

### Main Features

| Feature             | Description                   |
| ------------------- | ----------------------------- |
| `Posted On`         | Listing publication date      |
| `BHK`               | Number of bedrooms            |
| `Rent`              | Monthly rental price — target |
| `Size`              | Property size in sq. ft.      |
| `Floor`             | Floor information             |
| `Area Type`         | Type of property area         |
| `Area Locality`     | Locality name                 |
| `City`              | City                          |
| `Furnishing Status` | Furnishing condition          |
| `Tenant Preferred`  | Preferred tenant type         |
| `Bathroom`          | Number of bathrooms           |
| `Point of Contact`  | Contact type                  |

---

# 🤖 Machine Learning

The ML pipeline includes:

```text
Raw Dataset
     │
     ▼
Data Understanding
     │
     ▼
Data Cleaning
     │
     ▼
Feature Engineering
     │
     ▼
Preprocessing
     │
     ▼
Model Training
     │
     ▼
Model Evaluation
     │
     ▼
Best Model
     │
     ▼
Rental Price Prediction
```

### Feature Engineering

Important engineered features include:

* `Posted_Year`
* `Posted_Month`
* `Posted_DayOfWeek`
* `Current_Floor`
* `Total_Floors`
* `Floor_Ratio`
* `Bathroom_BHK_Ratio`
* `Size_Category`
* `Log_Size`
* `Log_Rent`

> `Price_Per_Sqft` is used for analytics where appropriate but is excluded from prediction features to avoid target leakage.

---

# 🧠 Model Development

Several machine learning approaches were evaluated, including:

* Linear Regression
* Ridge Regression
* Random Forest
* Extra Trees
* Gradient Boosting
* XGBoost
* LightGBM
* CatBoost

### Final Model

**ExtraTreesRegressor** was selected as the final prediction model and wrapped using:

```text
TransformedTargetRegressor
        │
        └── np.log1p transformation
              │
              ▼
        ExtraTreesRegressor
```

This approach helps the model handle the skewed rental-price distribution more effectively.

---

# 📈 Analytics

SmartRent provides rental-market insights through interactive visualizations using **Recharts**.

Analytics can include:

* Average rent by city
* Rent distribution
* Property size analysis
* BHK-based rental trends
* Furnishing status analysis
* City-wise rental comparison
* Rental price trends
* Property statistics

---

# 🔐 Security & Authentication

SmartRent implements secure user authentication using:

* **JWT authentication**
* **15-minute access tokens**
* **7-day refresh tokens**
* **Google Identity Services**
* **Bcrypt / Werkzeug password hashing**
* **Flask-CORS**

Authentication helps protect user-specific features and application data.

---

# 📁 Project Structure

```text
SmartRent/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
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
│   ├── model/
│   │   ├── best_model.pkl
│   │   └── model_metadata.pkl
│   └── ...
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

# 🚀 Getting Started

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

The Vite development server will start the frontend application.

---

## 3. Backend Setup

Create and activate a Python virtual environment:

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run Flask:

```bash
python app.py
```

---

## 4. Database

SmartRent uses:

```text
SQLite 3
```

Database file:

```text
smartrent.db
```

The database is managed using **SQLAlchemy**.

---

# 🧪 ML Training

The machine learning workflow is organized into five notebooks:

| Notebook                 | Purpose                         |
| ------------------------ | ------------------------------- |
| `01_data_understanding`  | Dataset exploration             |
| `02_data_cleaning`       | Cleaning and preprocessing      |
| `03_feature_engineering` | Feature creation                |
| `04_model_training`      | Model training                  |
| `05_model_evaluation`    | Model comparison and evaluation |

The trained model is stored as:

```text
ml-service/model/best_model.pkl
```

Model metadata is stored as:

```text
ml-service/model/model_metadata.pkl
```

---

# 🔄 Prediction Workflow

```text
User
 │
 ▼
React Frontend
 │
 ▼
Flask Backend
 │
 ▼
Input Validation & Preprocessing
 │
 ▼
Trained ML Model
 │
 ▼
Predicted Monthly Rent
 │
 ▼
Frontend Result
```

---

# 📌 Key Benefits

### For Users

* Quickly estimate rental prices.
* Compare rental markets.
* Explore property information.
* Get data-driven recommendations.

### For the System

* Machine learning powered predictions.
* Structured rental data management.
* Secure authentication.
* Interactive analytics.
* Modern responsive interface.

---

# 🔮 Future Improvements

* 🇱🇰 Sri Lankan rental dataset integration
* 🗺️ Location-based property recommendations
* 📍 Map integration
* 📱 Mobile application
* ☁️ Cloud deployment
* 🔄 Automated model retraining
* 📊 Advanced rental market forecasting

---

# 👥 Team Project

SmartRent was developed as a **group machine learning project**, combining:

* Frontend development
* Backend development
* Database management
* Machine learning
* Data preprocessing
* Data visualization
* System integration

---

# 🎓 Academic Project

SmartRent was developed as an academic project to demonstrate the practical application of:

* Machine Learning
* Data Science
* Full-Stack Development
* Database Management
* Software Engineering
* Data Visualization

---

## 📄 License

This project is developed for **academic and educational purposes**.

---

<div align="center">

### 🏠 SmartRent

**Predict • Analyze • Recommend**

Built with ❤️ using React, Flask, SQLite & Machine Learning.

</div>
