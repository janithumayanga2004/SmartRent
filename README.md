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
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge\&logo=railway\&logoColor=white)

<br><br>

### **Predict • Analyze • Recommend**

<br>

[🌐 Live Application](https://smartrent-b07b5.web.app) •
[⚙️ Backend API](https://satisfied-enchantment-production.up.railway.app)

</div>

---

# 📌 Overview

**SmartRent** is an end-to-end machine learning application developed to address a real-world **house rental price prediction** problem.

The platform combines:

> 🤖 Machine Learning
> 📊 Data Analytics
> 🏠 Property Intelligence
> 🔐 Authentication
> 🗄️ Database Management
> 🎨 Full-Stack Web Development

SmartRent uses a **House Rent Dataset containing 4,746 rental listings** from six major Indian cities and transforms raw rental data into a complete, user-facing prediction and analytics platform.

### What SmartRent Provides

| Capability                     | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| 🏠 **Rental Prediction**       | Estimates monthly rental prices using machine learning |
| 🔎 **Property Recommendation** | Supports data-driven property discovery                |
| 📊 **Market Analytics**        | Provides rental trends and statistical insights        |
| 📈 **Data Visualization**      | Interactive charts using Recharts                      |
| 👤 **Authentication**          | Registration, login and Google Sign-In                 |
| 🔐 **Security**                | JWT authentication and password hashing                |
| 🏘️ **Property Management**    | Manage rental property information                     |
| 🗄️ **Database**               | SQLite database with SQLAlchemy ORM                    |

---

# ✨ Core Features

## 🏠 Rental Price Prediction

SmartRent uses a trained machine learning pipeline to estimate the **monthly rental price** of a property based on its characteristics.

### Key Prediction Inputs

```text
BHK
Property Size
Bathroom Count
Floor Information
City
Area / Locality
Furnishing Status
Tenant Preference
Engineered Property Features
```

The prediction workflow transforms these inputs through the same preprocessing and feature-engineering pipeline used during model training.

---

## 🤖 Machine Learning

The machine learning workflow includes:

* Data understanding
* Data cleaning
* Feature engineering
* Missing-value handling
* Numerical feature scaling
* Categorical target encoding
* Log transformation
* Regression model training
* Ensemble learning
* Model evaluation
* Trained model persistence

### Models Evaluated

```text
Linear Regression
Random Forest
XGBoost
Voting Ensemble
```

---

## 📊 Rental Market Analytics

SmartRent provides interactive rental-market insights through **Recharts**.

### Analytics Include

* 🏙️ City-wise rental prices
* 💰 Average rental prices
* 📊 Rental price distribution
* 🛏️ BHK-based rental trends
* 📐 Property-size analysis
* 🛋️ Furnishing-status analysis
* 📈 Rental market statistics
* 🏠 Property information

---

## 🔎 Property Recommendation

SmartRent supports **data-driven property discovery and recommendation** based on available rental property information.

The recommendation functionality uses property characteristics and rental information to help users identify properties that match relevant requirements.

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
* Protected user functionality

### Token Configuration

```text
Access Token  → 15 Minutes
Refresh Token → 7 Days
```

---

## 📱 Responsive Interface

The frontend is built as a modern responsive web application using:

```text
React 19
Vite 8
Modern CSS
Recharts
Lucide React
Axios
```

---

# 🌐 Live Application

SmartRent is deployed and available online.

## 🎨 Frontend

### **SmartRent Web Application**

🔗 **Live Frontend**

https://smartrent-b07b5.web.app

[![Open SmartRent](https://img.shields.io/badge/OPEN%20LIVE%20APPLICATION-SmartRent-4285F4?style=for-the-badge\&logo=firebase\&logoColor=white)](https://smartrent-b07b5.web.app)

---

## ⚙️ Backend API

### **SmartRent Backend — Railway**

🔗 **Live Backend**

https://satisfied-enchantment-production.up.railway.app

[![Open Backend](https://img.shields.io/badge/BACKEND%20API-Railway-0B0D0E?style=for-the-badge\&logo=railway\&logoColor=white)](https://satisfied-enchantment-production.up.railway.app)

---

## 🚀 Deployment Architecture

```text
                    ┌─────────────────────────┐
                    │     SmartRent User      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   React Frontend        │
                    │      Firebase           │
                    │                         │
                    │ smartrent-b07b5.web.app │
                    └────────────┬────────────┘
                                 │
                              API Requests
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Flask Backend       │
                    │        Railway          │
                    │                         │
                    │ satisfied-enchantment   │
                    │ -production.up.railway  │
                    │         .app            │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
             ┌──────────────┐        ┌─────────────────┐
             │    SQLite    │        │ ML Prediction   │
             │   Database   │        │    Pipeline     │
             └──────────────┘        └─────────────────┘
```

> 💡 **Try the live application:** Open the frontend link above to access the deployed SmartRent application.

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
                                      │ HTTP / REST API
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
                                        │    Predicted Rent      │
                                        │       ₹ / Month        │
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
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)
![Oxlint](https://img.shields.io/badge/Oxlint-111111?style=for-the-badge)

### Technologies

```text
React 19
Vite 8
Recharts 3
Lucide React
Axios
Modern CSS
Oxlint
```

---

## ⚙️ Backend

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

## 🤖 Machine Learning & Data Science

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

## ☁️ Deployment

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge\&logo=railway\&logoColor=white)

```text
Frontend → Firebase Hosting
Backend  → Railway
```

---

# 📊 Dataset

SmartRent uses the **House Rent Dataset** containing:

```text
4,746 rental listings
```

The dataset contains rental listings from six major Indian Tier-1 cities.

## 🌆 Cities Covered

|  # | City      |
| -: | --------- |
| 01 | Mumbai    |
| 02 | Delhi     |
| 03 | Bangalore |
| 04 | Chennai   |
| 05 | Hyderabad |
| 06 | Kolkata   |

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

The target variable represents the **monthly rental price**.

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

Categorical preprocessing uses **TargetEncoder with cross-validation** to transform categorical variables into numerical representations while handling high-cardinality features.

---

# ⚙️ Feature Engineering

SmartRent applies a structured feature-engineering process to transform raw rental-listing information into meaningful machine-learning features.

The feature-engineering workflow is implemented mainly across:

```text
notebooks/02_data_cleaning.ipynb
notebooks/03_feature_engineering.ipynb
notebooks/04_model_training.ipynb
```

The project applies **11 important data-processing and feature-engineering techniques**.

---

## 1️⃣ Creating New Features — Domain Ratios & Flags

SmartRent derives additional property-level features from existing attributes.

### Ratio Features

* **Floor Ratio** — represents the property's current floor position relative to the total number of floors.
* **Bathroom/BHK Ratio** — captures the number of bathrooms relative to the number of bedrooms.
* **Size per BHK** — represents the available property size per bedroom.
* **Size per Bathroom** — represents the available property size per bathroom.

### Property Position Flags

* **Is Top Floor** — identifies properties located on the highest floor.
* **Is Ground Floor** — identifies ground-floor properties.

These features provide additional information about **property layout, space efficiency, and floor position**.

---

## 2️⃣ Removing Irrelevant Features

The preprocessing workflow removes attributes that are no longer required after useful information has been extracted.

### Removed Features

* **Posted On** — removed after extracting year, month, and day-of-week information.
* **Point of Contact** — removed because it represents administrative metadata rather than a core property characteristic.
* **Floor** — removed after extracting structured numerical floor information.

This keeps the final training dataset focused on features relevant to rental-price prediction.

---

## 3️⃣ Handling Missing Values

SmartRent handles missing values at multiple stages.

For floor-related features, missing values are safely handled before calculating derived floor features and ratios.

The machine-learning preprocessing pipeline additionally uses **median imputation** for numerical variables.

This provides a consistent input structure for both training and prediction.

---

## 4️⃣ Encoding Categorical Variables — Target Encoding

The dataset contains categorical variables with potentially high-cardinality values, particularly:

```text
Area Locality
City
City_Locality
City_BHK
City_Furnishing
Furnishing Status
Tenant Preferred
Size Category
```

SmartRent uses **Target Encoding with cross-validation** to convert categorical information into numerical representations informed by the target variable.

This allows the model to use location and property-category information while avoiding the dimensionality that traditional one-hot encoding can create for high-cardinality features.

---

## 5️⃣ Feature Scaling / Standardization

Numerical features are standardized using **StandardScaler** within the machine-learning preprocessing pipeline.

Standardization creates a consistent numerical representation for the machine-learning workflow.

---

## 6️⃣ Log Transformation

SmartRent applies logarithmic transformation to handle highly skewed numerical distributions.

The system creates:

* **Log_Size** for property size.
* A log-transformed **Rent target** during model training.

The target transformation is reversed after prediction so the final output is returned on the original rental-price scale.

---

## 7️⃣ Date/Time Feature Extraction

The original **Posted On** field contains listing-date information.

SmartRent extracts:

* **Posted Year**
* **Posted Month**
* **Posted Day of Week**

The original raw date field is then removed from the training features.

---

## 8️⃣ Binning / Discretization

SmartRent converts continuous property-size values into four meaningful categories.

| Category       |   Property Size |
| -------------- | --------------: |
| **Small**      |         `< 800` |
| **Medium**     |   `800 – 1,499` |
| **Large**      | `1,500 – 2,499` |
| **Very Large** |       `≥ 2,500` |

This provides an additional categorical representation of property scale.

---

## 9️⃣ Feature Interaction

SmartRent creates combined features to represent relationships between important property attributes.

### Interaction Features

```text
City + Area Locality
City + BHK
City + Furnishing Status
```

These combinations allow the model to capture more detailed contextual relationships within the rental data.

---

## 🔟 Outlier Treatment

SmartRent performs validation and outlier filtering before model training.

### Basic Validation

The workflow validates:

```text
Rent
Size
BHK
Bathroom
```

These variables are checked for valid positive values.

### City-Wise IQR Filtering

For each city, the workflow calculates:

```text
Q1
Q3
IQR
```

Rental listings outside the defined city-level IQR bounds are filtered.

City-wise filtering accounts for differences between rental-price distributions across locations.

---

## 1️⃣1️⃣ Text Feature Extraction

The original **Floor** attribute contains text such as:

```text
1 out of 3
Ground out of 2
```

SmartRent parses this information into:

```text
Current_Floor
Total_Floors
```

The original text-based `Floor` feature is then removed.

---

# 🧩 Feature Engineering Summary

```text
Raw Rental Data
       │
       ▼
Data Validation
       │
       ▼
Date Feature Extraction
       │
       ▼
Text Feature Extraction
       │
       ▼
Floor Features
       │
       ▼
Domain Ratios & Property Flags
       │
       ▼
Size Binning
       │
       ▼
Feature Interactions
       │
       ▼
Log Transformation
       │
       ▼
Outlier Treatment
       │
       ▼
Feature Selection
       │
       ▼
Machine Learning Pipeline
```

---

# 🧠 Machine Learning

SmartRent evaluates multiple regression models using a consistent preprocessing and **log-target workflow**.

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

SmartRent transforms the rental-price target into a logarithmic representation during model training.

```text
Original Rent
     │
     ▼
Log Transformation
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
Inverse Transformation
     │
     ▼
Predicted Rent
```

The final prediction is converted back to the original rental-price scale so users receive a monthly rental-price estimate in **Indian Rupees**.

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

### Ensemble Configuration

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
                   ┌────────┴────────┐
                   │                 │
                   ▼                 ▼
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

---

# 📈 Final Evaluation Results

| Model                           |      MAE (₹) |     RMSE (₹) |         R² |
| :------------------------------ | -----------: | -----------: | ---------: |
| Linear Regression (LogTarget)   |     5,371.85 |    10,559.62 |     0.7718 |
| Random Forest (LogTarget)       |     4,723.85 |     8,567.34 |     0.8498 |
| XGBoost (LogTarget)             |     4,678.98 |     8,582.00 |     0.8493 |
| **Voting Ensemble (LogTarget)** | **4,657.56** | **8,479.29** | **0.8529** |

### Final Model Metrics

```text
MAE  : ₹4,657.56
RMSE : ₹8,479.29
R²   : 0.8529
```

### Model Artifacts

```text
ml-service/model/
├── best_model.pkl
└── model_metadata.pkl
```

`best_model.pkl` contains the trained prediction model and preprocessing pipeline.

`model_metadata.pkl` contains supporting metadata required by the prediction system.

---

# 📊 Rental Market Analytics

SmartRent provides interactive rental analytics through **Recharts**.

### Supported Analytics

```text
City-wise Rental Prices
Average Rental Prices
Rental Price Distribution
BHK-based Rental Trends
Property-size Analysis
Furnishing-status Analysis
Rental Market Statistics
Property Information
```

---

# 🔐 Authentication & Security

SmartRent provides application authentication using:

```text
JWT
Google Identity Services
Bcrypt / Werkzeug
Flask-CORS
```

### 🔑 Token Configuration

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

The machine-learning development process is organized into five notebooks.

| Notebook                       | Purpose                                       |
| :----------------------------- | :-------------------------------------------- |
| `01_data_understanding.ipynb`  | Dataset exploration, structure and analysis   |
| `02_data_cleaning.ipynb`       | Cleaning, validation and outlier treatment    |
| `03_feature_engineering.ipynb` | Feature creation and transformation           |
| `04_model_training.ipynb`      | Preprocessing, training and ensemble creation |
| `05_model_evaluation.ipynb`    | Model evaluation and comparison               |

---

## 01 — Data Understanding

Explores:

* Dataset structure
* Columns
* Data types
* Data distributions
* Initial data quality
* Relationships between variables

---

## 02 — Data Cleaning

Handles:

* Data validation
* Missing values
* Data formatting
* Date conversion
* Date feature extraction
* Outlier treatment
* Data consistency
* Dataset preparation
* Removal of irrelevant attributes

---

## 03 — Feature Engineering

Creates and processes:

* Date features
* Floor features
* Domain ratios
* Property flags
* Size categories
* Log-transformed features
* Feature interactions
* Location-property combinations
* Structured numerical representations from text fields

---

## 04 — Model Training

Performs:

* Data preparation
* Numerical imputation
* Feature scaling
* Categorical target encoding
* Pipeline construction
* Log-target transformation
* Model training
* Model configuration
* Ensemble construction
* Model persistence

---

## 05 — Model Evaluation

Performs:

* Model prediction
* MAE calculation
* RMSE calculation
* R² calculation
* Model comparison
* Final model evaluation
* Final model selection

---

# 💾 Trained Model

The final trained machine-learning artifacts are stored in:

```text
ml-service/model/
```

### Files

```text
best_model.pkl
model_metadata.pkl
```

The saved artifacts allow the deployed prediction service to load the trained model and associated metadata.

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/janithumayanga2004/SmartRent.git
cd SmartRent
```

---

## 2️⃣ Frontend Setup

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

## 3️⃣ Backend Setup

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

The machine-learning workflow uses:

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

<br>

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
* ☁️ Cloud deployment expansion
* 🔄 Automated model retraining
* 📈 Advanced rental-market forecasting
* 🤖 Improved recommendation algorithms
* 🌐 Wider geographic coverage
* 📊 Real-time rental-market monitoring

---

# 👥 Team Project

<div align="center">

## **DATA FLUX**

### *SmartRent Development Team*

</div>

SmartRent was developed as a group academic project combining:

```text
🤖 Machine Learning
📊 Data Science
🎨 Frontend Development
⚙️ Backend Development
🗄️ Database Management
📈 Data Visualization
💻 Software Engineering
```

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

### **TEAM DATA FLUX**

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
* Target encoding
* Feature scaling
* Log transformation
* Outlier treatment
* Text feature extraction
* Feature interaction
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

| Category                | Details                                 |
| :---------------------- | :-------------------------------------- |
| **Project**             | SmartRent                               |
| **Project Type**        | Full-Stack Machine Learning Application |
| **Domain**              | Real Estate / Rental Analytics          |
| **Primary Task**        | House Rental Price Prediction           |
| **Dataset**             | House Rent Dataset                      |
| **Listings**            | 4,746                                   |
| **Cities**              | 6 Indian Tier-1 Cities                  |
| **Final Model**         | Voting Ensemble (LogTarget)             |
| **MAE**                 | ₹4,657.56                               |
| **RMSE**                | ₹8,479.29                               |
| **R²**                  | 0.8529                                  |
| **Frontend**            | React 19 + Vite 8                       |
| **Backend**             | Python + Flask                          |
| **Database**            | SQLite + SQLAlchemy                     |
| **Machine Learning**    | Scikit-Learn + XGBoost                  |
| **Frontend Deployment** | Firebase                                |
| **Backend Deployment**  | Railway                                 |
| **Team**                | Data Flux                               |
| **Members**             | 4                                       |

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

![React](https://img.shields.io/badge/React-19-20232A?style=flat-square\&logo=react\&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat-square\&logo=flask\&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square\&logo=sqlite\&logoColor=white)
![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square\&logo=scikit-learn\&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-189FDD?style=flat-square)

<br>

**Built with ❤️ using React • Flask • SQLite • Scikit-Learn • XGBoost**

<br>

---

### 🏠 SmartRent — Turning Rental Data into Intelligent Insights

</div>
