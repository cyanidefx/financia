# Financia

Financia is a full-stack web application that helps users manage their personal and household finances efficiently. It provides tools to track expenses, manage budgets, view dashboards, export/import financial data, and analyze spending habits.

## Features

* User authentication (register, login, JWT-based auth)
* Dashboard displaying recent expenses and budget summary
* Expense management: add, view, edit, and delete expenses
* Budget management: create and track budgets by category
* Analytics: charts and tables to analyze spending trends
* Data export/import in CSV format
* Secure API endpoints with middleware authentication

---

## Folder Structure

The project is organized into two main parts: **backend** and **frontend**.

### Backend

Handles data storage, user authentication, and RESTful API.

```
backend/
├── config/
│   └── db.js                  # Database connection configuration
│
├── controllers/               # Business logic for handling requests
│   ├── authController.js
│   ├── budgetController.js
│   ├── expenseController.js
│   └── temp.csv               # Temporary file for import/export operations
│
├── middleware/
│   └── auth.js                # Middleware for route protection
│
├── models/                    # Mongoose models defining data schemas
│   ├── Budget.js
│   ├── Expense.js
│   └── User.js
│
├── routes/                    # Defines application routes
│   ├── auth.js
│   ├── budgets.js
│   ├── dashboard.js
│   └── expenses.js
│
├── .env                       # Environment variables (e.g., database URI, secrets)
└── server.js                  # Main entry point to start the server
```

---

### Frontend

Static web frontend built with HTML, CSS, and vanilla JavaScript.

```
frontend/
├── js/                        # JavaScript files for frontend logic
│   ├── analytics.js
│   ├── auth.js
│   ├── budgets.js
│   ├── dashboard.js
│   ├── export-import.js
│   └── register.js
│
├── analytics.html             # Spending trends and charts
├── budgets.html               # Budgets list and management
├── dashboard.html             # Main dashboard page
├── export-import.html         # Import/export CSV interface
├── index.html                 # Landing page
├── login.html                 # Login form
├── register.html              # Registration form
└── styles.css                 # Main stylesheet
```

---

## Technologies Used

* **Backend**: Node.js, Express.js, MongoDB, Mongoose
* **Frontend**: HTML, CSS, JavaScript
* **Authentication**: JSON Web Tokens (JWT)
* **Data Format**: CSV for import/export

---

## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/financia.git
cd financia
```

2. **Install dependencies:**

```bash
cd backend
npm install
```

3. **Set up environment variables:**
   Create a `.env` file inside the `backend` folder:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

4. **Start the server:**

```bash
npm start
```

5. **Open the frontend:**
   Simply open any of the HTML files in the `frontend/` folder using your browser.

---

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License.

---
