import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form)
      localStorage.setItem("token", res.data.token); // Step 2: store JWT
      localStorage.setItem("role", res.data.user.role);
      (res.data.user.role !== "admin") ? navigate("/upload") : navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-500 text-white p-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}
