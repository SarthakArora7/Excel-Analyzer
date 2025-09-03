import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChartBuilder from "./pages/ChartBuilder";
import UserDashboard from "./pages/UserDashboard";

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <Dashboard />
          </PrivateRoute>
          }
        />
        <Route path="/chart/:id" element={<ChartBuilder />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
