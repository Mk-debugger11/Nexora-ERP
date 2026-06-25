# Nexora ERP

Nexora ERP is a comprehensive, modern Enterprise Resource Planning and Inventory Management system tailored for E-commerce and retail businesses. Built with a powerful Django REST Framework backend and a dynamic, highly responsive React frontend, it empowers administrators to manage products, inventory, warehouses, orders, and users seamlessly.

---

## 🚀 Features

- **Real-time Dashboard Analytics:** Visualize your key business metrics (Revenue, Sales Orders, Low Stock Alerts) instantly with dynamic charts and summary metrics.
- **Dynamic Form Generation:** Forms across the frontend are automatically generated based on the backend Django models, allowing for incredibly fast iteration and consistency.
- **Advanced Inventory Management:** Support for multiple warehouses, complete with localized racks, shelves, and floor-level tracking.
- **Order Lifecycle Tracking:** Fully integrated Purchase Orders (PO) and Sales Orders (SO) tracking with item inwarding, outwarding, and status progression.
- **User Role Management:** Manage employees, administrators, suppliers, and customers with role-based access control.
- **Interactive User Onboarding:** Step-by-step guided tutorials for new users highlighting core system features.

---

## 🛠️ Technology Stack

### Frontend
- **React (Vite):** Fast, modern UI development.
- **Material-UI (MUI):** Premium, customizable UI components and data grids.
- **Recharts:** Interactive, data-driven dashboard charts.
- **React Router DOM:** Client-side routing.
- **React-Hook-Form:** Performant, flexible, and extensible forms.

### Backend
- **Django & Django REST Framework (DRF):** Powerful Python framework for robust APIs.
- **PostgreSQL (Neon DB):** Serverless Postgres for highly scalable and reliable database management.
- **SimpleJWT:** Secure JSON Web Token authentication.

---

## 🏗️ Architecture & Core Modules

The backend is organized into micro-service-like Django apps, each handling specific domains of the business logic:

### 1. UserServices
Handles authentication, user sessions, and broad application analytics.
- **Models:** `Users`, `ActivityLog`, `CompanySettings`
- **Key APIs:** Login/Registration, JWT Token Generation, Dashboard Analytics data aggregation.

### 2. ProductServices
Manages the catalog, categorizations, and customer interactions regarding products.
- **Models:** `Products`, `Categories`, `ProductReviews`
- **Features:** Dynamic form rendering logic (excluding heavy file uploads to optimize database constraints), SEO field management.

### 3. InventoryServices
The core of physical goods tracking.
- **Models:** `Warehouse`, `RackAndShelvesAndFloor`, `Inventory`, `InventoryLog`
- **Features:** Stock alerts, multi-location support, and logging every inward/outward action.

### 4. OrderService
Manages the influx and outflux of goods.
- **Models:** `PurchaseOrder`, `PurchaseOrderItems`, `PurchaseOrderItemInwardedLog`, `SalesOrder`, `SalesOrderOrderItems`
- **Features:** PO approvals, item-by-item receiving logs, and sales tracking.

---

## 🔌 API Integration Details

The system heavily utilizes a single Dynamic Form API (`/api/getForm/<model_name>/`) which eliminates the need to hardcode form fields on the frontend. 

When the frontend needs to create or edit an item (e.g. Product, Warehouse, Category):
1. **GET Request:** The frontend queries the backend dynamic form endpoint.
2. **Schema Generation:** The backend (`Helpers.py` & `DynamicFormController.py`) inspects the Django model, formats the data types (Text, Select, Textarea, JSON), applies exclusion rules (e.g., hiding `image` and file fields), and returns a structured JSON schema.
3. **Rendering:** The React `<DynamicForm />` component parses this schema and renders the appropriate Material-UI fields dynamically.

---

## 💻 Getting Started (Development)

### Prerequisites
- Node.js (v16+)
- Python (3.10+)
- PostgreSQL (or valid Neon DB connection string)

### Backend Setup
1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your `.env` file with your Database URL and Secret Keys.
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file (e.g., `VITE_APP_BASE_URL=http://localhost:8000/api/`).
4. Start the development server:
   ```bash
   npm start
   ```

---

## 📝 License

Copyright © 2026 Nexora ERP. All Rights Reserved.
