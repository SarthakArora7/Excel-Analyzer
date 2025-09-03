# 📊 Excel Analyzer

Excel Analyzer is a **full-stack web application** built with **React + Node.js + MongoDB** that allows users to:
- Upload Excel/CSV files
- Analyze data
- Build and save interactive charts
- Track upload & chart history in their personal dashboard
- Manage users and usage via an **Admin Dashboard**

---

## 🚀 Features

### 👤 User Features
- **Authentication** (JWT-based)
  - Signup / Login
  - Role-based access (user / admin)
- **File Uploads**
  - Upload Excel/CSV files
  - Preview parsed data (first few rows + column headers)
- **Chart Builder**
  - Select X & Y axes
  - Choose chart type (Bar, Line, Scatter, 3D Scatter)
  - Download charts as PNG
  - Save charts to history
- **User Dashboard**
  - View upload history
  - View saved chart history with live previews

### 🛠️ Admin Features
- Admin Dashboard:
  - Manage users (list all, assign roles)
  - Monitor system usage (uploads & chart activity)
  - View usage statistics with charts

---

## 🏗️ Tech Stack

### Frontend
- React + Vite
- TailwindCSS + shadcn/ui
- Recharts (Bar, Line, Scatter charts)
- Plotly.js (3D Scatter support)
- Axios for API requests
- React Router for navigation

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Multer (file uploads)
- JWT for authentication
- XLSX (parse Excel files)

---

## 📂 Project Structure

```
excel-analyzer/
│
├── backend/                # Express + MongoDB backend
│   ├── models/             # Mongoose models (User, Upload, ChartHistory)
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   └── server.js           # Entry point
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Pages (Login, Signup, Dashboard, Admin, ChartBuilder)
│   │   ├── App.jsx         # Router + Layout
│   │   └── main.jsx        # React entry point
│   └── vite.config.js
│
└── README.md               # Documentation
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/excel-analyzer.git
cd excel-analyzer
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGO_URI=mongodb://localhost:27017/excel-analyzer
JWT_SECRET=your_secret_key
PORT=5000
```

Run server:
```bash
npm start
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔑 API Endpoints

### Auth
- `POST /api/auth/signup` → Register new user
- `POST /api/auth/login` → Login, returns JWT

### User
- `GET /api/user/uploads` → Get user uploads
- `GET /api/user/charts` → Get saved chart history

### Uploads
- `POST /api/upload` → Upload Excel/CSV
- `GET /api/upload/:id` → Get specific upload + preview data

### Charts
- `POST /api/chart/save` → Save chart configuration
- `GET /api/chart/:id` → Get chart details

### Admin
- `GET /api/admin/users` → List users
- `PATCH /api/admin/users/:id` → Update user role
- `GET /api/admin/usage` → System usage stats

---

## 📸 Screenshots

_(Add screenshots once UI is polished)_

---

## 🔮 Future Improvements
- Add **full Excel analysis tools** (stats, correlation, regression)
- Support **export to PDF/Excel** for reports
- Real-time collaboration
- Advanced chart types (heatmaps, histograms)

---

## 📝 License
MIT License © 2025 Your Name  
