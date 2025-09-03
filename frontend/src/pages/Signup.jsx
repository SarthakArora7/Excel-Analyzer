import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form) 
      alert("Signup successful, please login!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
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
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Signup
        </button>
      </form>
    </div>
  );
}
