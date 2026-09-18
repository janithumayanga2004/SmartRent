<div align="center">

# 🏠 SmartRent

### **AI-Powered House Rental Price Prediction & Property Recommendation System**

<p>
  <strong>Machine Learning • Data Analytics • Full-Stack Development • Property Intelligence</strong>
</p>

<p>
  SmartRent is a full-stack machine learning application that predicts
  monthly house rental prices, provides rental market analytics,
  and supports property recommendations using real-world rental listing data.
</p>

<br>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask_3.x-000000?style=for-the-badge\&logo=flask\&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite_3-003B57?style=for-the-badge\&logo=sqlite\&logoColor=white)
![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge\&logo=scikit-learn\&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-189FDD?style=for-the-badge)

<br><br>

### **Predict • Analyze • Recommend**

</div>

---

# 📌 Overview

**SmartRent** is an end-to-end machine learning application developed to address a real-world house rental price prediction problem.

The system combines **machine learning, data processing, rental market analytics, property recommendations, authentication, database management, and a modern web interface** into one platform.

SmartRent uses a real-world **House Rent Dataset containing 4,746 rental listings** from major Indian Tier-1 cities.

The platform allows users to:

* 🏠 Predict monthly rental prices
* 🤖 Use machine learning-based rental valuation
* 🔎 Discover suitable rental properties
* 📊 Explore rental market analytics
* 📈 View interactive data visualizations
* 👤 Register and authenticate
* 🔐 Access protected user functionality
* 🏘️ Manage rental property information
* 📋 Manage prediction and rental data

---

# ✨ Features

## 🏠 Rental Price Prediction

SmartRent uses a trained machine learning pipeline to estimate the monthly rental price of a property based on its characteristics.

Key inputs include:

* BHK
* Property size
* Bathroom count
* Floor information
* City
* Area
* Furnishing status
* Tenant preference
* Property-related engineered features

---

## 🤖 Machine Learning

The machine learning system includes:

* Data preprocessing
* Feature engineering
* Numerical feature scaling
* Categorical encoding
* Log-target transformation
* Regression model training
* Ensemble learning
* Model evaluation
* Trained model persistence

---

## 📊 Rental Market Analytics

The application provides interactive rental market insights including:

* City-wise rental prices
* Average rent
* Rental price distribution
* BHK-based rental trends
* Property-size analysis
* Furnishing-status analysis
* Rental market statistics
* Property information

Charts and visualizations are implemented using **Recharts**.

---

## 🔎 Property Recommendation

SmartRent supports data-driven property discovery and recommendation based on available rental property information.

---

## 🔐 Authentication

The application includes:

* User registration
* User login
* JWT authentication
* Access tokens
* Refresh tokens
* Google Sign-In
* Password hashing

---

## 📱 Responsive Interface

The frontend is designed as a modern responsive web application using:

* React
* Vite
* Modern CSS
* Recharts
* Lucide React

---

# 🎯 Project Objectives

SmartRent aims to:

* Predict monthly rental prices using machine learning.
* Analyze rental market trends.
* Support data-driven property discovery.
* Provide property recommendations.
* Visualize rental market information.
* Demonstrate an end-to-end machine learning workflow.
* Integrate machine learning with a full-stack web application.
* Apply data processing and feature engineering to real-world rental data.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────────┐
                         │      React Frontend      │
                         │         React 19         │
                         │          Vite 8          │
                         │   Recharts + Lucide UI   │
                         └────────────┬─────────────┘
                                      │
                                      │ HTTP / API
                                      ▼
                         ┌──────────────────────────┐
                         │      Flask Backend       │
                         │         Flask 3.x        │
                         │       REST API Layer     │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         ▼                         ▼
              ┌────────────────────┐    ┌────────────────────┐
              │      SQLite 3      │    │  ML Prediction     │
              │     smartrent.db   │    │     Pipeline       │
              │                    │    │                    │
              │    SQLAlchemy      │    │ Feature Engineering│
              └────────────────────┘    │  Preprocessing     │
                                        └──────────┬─────────┘
                                                   │
                                                   ▼
                                      ┌────────────────────────┐
                                      │    Voting Ensemble     │
                                      │                        │
                                      │  XGBoost   × Weight 2  │
                                      │  Random Forest × W1    │
                                      └────────────┬───────────┘
                                                   │
                                                   ▼
                                      ┌────────────────────────┐
                                      │   Predicted Rent       │
                                      │      ₹ / Month         │
                                      └────────────────────────┘
```

---

# 🔄 Prediction Workflow

```text
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   React Frontend    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Rental Property     │
│      Inputs         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Flask Backend     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Feature Engineering │
└─────────┬───────────┘
          │
          ▼
┌────────────────────────────┐
│   Preprocessing Pipeline   │
│                            │
│ • Numerical Imputation     │
│ • Standard Scaling         │
│ • Target Encoding          │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│     Voting Ensemble        │
│                            │
│    XGBoost + Random Forest │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│   Predicted Rental Price   │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│      React Frontend        │
└────────────────────────────┘
```

---

# 🛠️ Technology Stack

## 🎨 Frontend

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts_3-22B5BF?style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge)
![CSS](https://img.shields.io/badge/Modern_CSS-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![Oxlint](https://img.shields.io/badge/Oxlint-111111?style=for-the-badge)

### Technologies

```text
React 19
Vite 8
Recharts
Lucide React
Axios
Modern CSS
Oxlint
```

---

# ⚙️ Backend

![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask_3.x-000000?style=for-the-badge\&logo=flask\&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite_3-003B57?style=for-the-badge\&logo=sqlite\&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge\&logo=sqlalchemy\&logoColor=white)
![PyJWT](https://img.shields.io/badge/PyJWT-000000?style=for-the-badge)

### Technologies

```text
Python 3.11
Flask 3.x
SQLite 3
SQLAlchemy
PyJWT
Bcrypt / Werkzeug
Flask-CORS
REST API
```

---

# 🤖 Machine Learning & Data Science

![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge\&logo=scikit-learn\&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge\&logo=pandas\&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge\&logo=numpy\&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-189FDD?style=for-the-badge)
![Joblib](https://img.shields.io/badge/Joblib-4B8BBE?style=for-the-badge)
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=for-the-badge)
![Seaborn](https://img.shields.io/badge/Seaborn-4C72B0?style=for-the-badge)

### Technologies

```text
Python
Pandas
NumPy
Scikit-Learn
XGBoost
Joblib
Matplotlib
Seaborn
```

---

# 📊 Dataset

SmartRent uses the **House Rent Dataset** containing:

```text
4,746 rental listings
```

The dataset contains rental listings from major Indian Tier-1 cities.

## 🌆 Cities Covered

* Mumbai
* Delhi
* Bangalore
* Chennai
* Hyderabad
* Kolkata

## 📋 Main Dataset Features

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

### 🎯 Target Variable

```text
Rent
```

The target variable represents the monthly rental price.

---

# 🧹 Data Preprocessing

The machine learning pipeline applies preprocessing before model training and prediction.

## 🔢 Numerical Features

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

### Numerical Processing

```text
Raw Numerical Features
        │
        ▼
Median Imputation
        │
        ▼
StandardScaler
        │
        ▼
Processed Numerical Features
```

---

## 🔤 Categorical Features

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

with cross-validation.

---

# ⚙️ Feature Engineering

SmartRent creates additional features from the original rental dataset.

## 📅 Date Features

```text
Posted_Year
Posted_Month
Posted_DayOfWeek
```

---

## 🏢 Floor Features

```text
Current_Floor
Total_Floors
Floor_Ratio
Is_Top_Floor
Is_Ground_Floor
```

---

## 🏠 Property Features

```text
Bathroom_BHK_Ratio
Size_Per_BHK
Size_Per_Bathroom
Size_Category
Log_Size
```

These engineered features provide additional information about property characteristics and help the machine learning models identify rental-price patterns.

---

# 🧠 Machine Learning

SmartRent evaluates multiple regression models using a consistent preprocessing and log-target workflow.

## 🔬 Models Evaluated

```text
Linear Regression
Random Forest
XGBoost
Voting Ensemble
```

---

# 📉 Log-Target Transformation

Rental prices can have a skewed distribution.

SmartRent transforms the rental price target using:

```python
np.log1p()
```

The predicted value is converted back to the original rental-price scale using:

```python
np.expm1()
```

### Workflow

```text
Original Rent
     │
     ▼
  np.log1p()
     │
     ▼
Log Rental Price
     │
     ▼
Machine Learning Model
     │
     ▼
Predicted Log Rent
     │
     ▼
  np.expm1()
     │
     ▼
Predicted Rent
```

---

# 🏆 Final Model

## Voting Ensemble — LogTarget

The final selected model is:

```text
Voting Ensemble (LogTarget)
```

The ensemble combines:

```text
XGBoost
+
Random Forest
```

with the following configuration:

```text
XGBoost       → Weight 2
Random Forest → Weight 1
```

### Ensemble Architecture

```text
                  ┌───────────────────┐
                  │  Property Inputs  │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Feature Pipeline  │
                  └─────────┬─────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │    XGBoost      │   │  Random Forest  │
        │    Weight: 2    │   │    Weight: 1    │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                  ┌───────────────────┐
                  │ Voting Ensemble   │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Predicted Monthly │
                  │       Rent        │
                  └───────────────────┘
```

# 📈 Final Evaluation Results

The evaluated models produced the following results:

| Model                           |      MAE (₹) |     RMSE (₹) |         R² |
| ------------------------------- | -----------: | -----------: | ---------: |
| Linear Regression (LogTarget)   |     5,371.85 |    10,559.62 |     0.7718 |
| Random Forest (LogTarget)       |     4,723.85 |     8,567.34 |     0.8498 |
| XGBoost (LogTarget)             |     4,678.98 |     8,582.00 |     0.8493 |
| **Voting Ensemble (LogTarget)** | **4,657.56** | **8,479.29** | **0.8529** |

---

## 🏆 Selected Model

```text
Best Selected Model:
Voting Ensemble (LogTarget)
```

### Final Metrics

```text
MAE  : ₹4,657.56
RMSE : ₹8,479.29
R²   : 0.8529
```

The selected model and supporting metadata were successfully saved to:

```text
ml-service/model/
```

### Model Artifacts

```text
best_model.pkl
model_metadata.pkl
```

---

# 📊 Rental Market Analytics

SmartRent provides interactive rental analytics through **Recharts**.

The system supports visualization of:

* 🏙️ City-wise rental prices
* 💰 Average rental prices
* 📊 Rental price distribution
* 🛏️ BHK-based rental trends
* 📐 Property-size analysis
* 🛋️ Furnishing-status analysis
* 📈 Rental market statistics
* 🏠 Property information

---

# 🔐 Authentication & Security

SmartRent provides application authentication using:

```text
JWT
Google Identity Services
Bcrypt / Werkzeug
Flask-CORS
```

## 🔑 Token Configuration

```text
Access Token  → 15 Minutes
Refresh Token → 7 Days
```

JWT authentication is used to protect user-specific functionality.

---

# 🗄️ Database

SmartRent uses **SQLite 3** for application data management.

### Database

```text
smartrent.db
```

### ORM

```text
SQLAlchemy
```

SQLAlchemy provides structured database interaction between the Flask application and SQLite.

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
│   ├── requirements.txt
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

The machine learning development process is organized into five notebooks.

### 01 — Data Understanding

Explores:

* Dataset structure
* Columns
* Data types
* Data distributions
* Initial data quality

---

### 02 — Data Cleaning

Handles:

* Missing values
* Data formatting
* Data consistency
* Dataset preparation

---

### 03 — Feature Engineering

Creates:

* Date features
* Floor features
* Property features
* Ratio features
* Log-transformed features
* Categorical interaction features

---

### 04 — Model Training

Performs:

* Data preparation
* Pipeline construction
* Model training
* Model configuration
* Ensemble construction
* Model persistence

---

### 05 — Model Evaluation

Performs:

* Model prediction
* MAE calculation
* RMSE calculation
* R² calculation
* Model comparison
* Final model selection

---

# 💾 Trained Model

The final trained machine learning artifacts are stored in:

```text
ml-service/model/
```

### Files

```text
best_model.pkl
model_metadata.pkl
```

`best_model.pkl` contains the trained prediction model/pipeline.

`model_metadata.pkl` contains supporting metadata required by the prediction system.

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/janithumayanga2004/SmartRent.git
```

```bash
cd SmartRent
```

---

# 🎨 2️⃣ Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# ⚙️ 3️⃣ Backend Setup

Open another terminal and navigate to:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask backend:

```bash
python app.py
```

---

# 🧪 Machine Learning Environment

The machine learning workflow uses:

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

The ML workflow can be reproduced using the notebooks inside:

```text
notebooks/
```

---

# 🔄 Complete System Flow

```text
                  ┌──────────────┐
                  │     User     │
                  └──────┬───────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   React Frontend    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    Flask REST API   │
              └──────────┬──────────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
       ┌────────────────┐  ┌─────────────────┐
       │ SQLite Database│  │ ML Prediction   │
       │                │  │    Pipeline     │
       └────────────────┘  └────────┬────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ Feature Pipeline │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ Voting Ensemble  │
                           │                  │
                           │ XGBoost + RF     │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ Predicted Rent   │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ React Dashboard  │
                           └──────────────────┘
```

---

# 🌟 Key Highlights

<div align="center">

| 🤖 Machine Learning |    📊 Analytics    |     🏠 Property     |
| :-----------------: | :----------------: | :-----------------: |
|  Rental prediction  |   Market insights  |   Recommendations   |
|    Ensemble model   | Interactive charts | Property management |
| Feature engineering |    City analysis   |  Property discovery |

|    🔐 Security   | 🎨 Frontend | 🗄️ Backend |
| :--------------: | :---------: | :---------: |
|        JWT       |   React 19  |    Flask    |
|  Google Sign-In  |    Vite 8   |    SQLite   |
| Password hashing |   Recharts  |  SQLAlchemy |

</div>

---

# 🔮 Future Improvements

* 🇱🇰 Integration of Sri Lankan rental datasets
* 🗺️ Location-based recommendations
* 📍 Interactive map integration
* 📱 Dedicated mobile application
* ☁️ Cloud deployment
* 🔄 Automated model retraining
* 📈 Advanced rental market forecasting
* 🤖 Improved recommendation algorithms
* 🌐 Wider geographic coverage
* 📊 Real-time rental market monitoring

---

# 👥 Team Project

<div align="center">

## **DATA FLUX**

### *SmartRent Development Team*

</div>

SmartRent was developed as a group academic project combining:

* 🤖 Machine Learning
* 📊 Data Science
* 🎨 Frontend Development
* ⚙️ Backend Development
* 🗄️ Database Management
* 📈 Data Visualization
* 💻 Software Engineering

---

# 👨‍💻 Contributors

|   No.  | Name                     |  Student ID |
| :----: | :----------------------- | :---------: |
| **01** | **Janith Umayanga**      | `241722026` |
| **02** | **Matheesha Abiman**     | `241722050` |
| **03** | **Vihanga Sathsara**     | `241722033` |
| **04** | **Madushka Sri Sandesh** | `241722051` |

<br>

<div align="center">

**TEAM DATA FLUX**

`Janith Umayanga` • `Matheesha Abiman` • `Vihanga Sathsara` • `Madushka Sri Sandesh`

</div>

---

# 🎓 Academic Purpose

SmartRent demonstrates the practical integration of:

```text
Machine Learning
       +
Data Processing
       +
Feature Engineering
       +
Model Development
       +
Backend Development
       +
Database Management
       +
Frontend Development
       +
Data Visualization
```

The project focuses on applying machine learning to a real-world rental-price prediction problem while developing a complete user-facing software application.

---

# 📚 Learning Outcomes

Through this project, the team gained practical experience in:

* Machine learning model development
* Regression algorithms
* Ensemble learning
* Feature engineering
* Data preprocessing
* Categorical encoding
* Model evaluation
* REST API development
* Full-stack application development
* Database integration
* Authentication systems
* Data visualization
* Collaborative software development
* Git-based project management

---

# 📌 Project Information

| Category         | Details                                 |
| :--------------- | :-------------------------------------- |
| **Project**      | SmartRent                               |
| **Project Type** | Full-Stack Machine Learning Application |
| **Domain**       | Real Estate / Rental Analytics          |
| **Primary Task** | House Rental Price Prediction           |
| **Dataset**      | House Rent Dataset                      |
| **Listings**     | 4,746                                   |
| **Cities**       | 6 Indian Tier-1 Cities                  |
| **Final Model**  | Voting Ensemble (LogTarget)             |
| **MAE**          | ₹4,657.56                               |
| **RMSE**         | ₹8,479.29                               |
| **R²**           | 0.8529                                  |
| **Frontend**     | React 19 + Vite 8                       |
| **Backend**      | Python + Flask                          |
| **Database**     | SQLite + SQLAlchemy                     |
| **ML**           | Scikit-Learn + XGBoost                  |
| **Team**         | Data Flux                               |
| **Members**      | 4                                       |

---

# 📄 License

This project was developed for **academic and educational purposes**.

The dataset, third-party libraries, frameworks, and technologies used in this project remain subject to their respective licenses and terms.

---

<div align="center">

# 🏠 SmartRent

### **Predict • Analyze • Recommend**

<br>

**AI-Powered House Rental Price Prediction & Property Recommendation System**

<br>

### 👥 Team **Data Flux**

**Janith Umayanga** • **Matheesha Abiman** • **Vihanga Sathsara** • **Madushka Sri Sandesh**

<br>

[![GitHub](https://img.shields.io/badge/GitHub-SmartRent-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/janithumayanga2004/SmartRent)

<br>

**Built with ❤️ using React • Flask • SQLite • Scikit-Learn • XGBoost**

<br>

---

### 🏠 SmartRent — Turning Rental Data into Intelligent Insights

</div>
