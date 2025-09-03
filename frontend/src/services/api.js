import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:5000/api"
})

// Admin APIs
export const fetchUsers = () => API.get("/admin/users");
export const fetchUsage = (id) => API.get(`/admin/usage/${id}`);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
// export const blockUser = (id) => API.post(`/admin/users/${id}/block`);
export const updateRole = (id) => API.patch(`/admin/users/${id}/role`)
export const getStats = () => API.get(`/admin/stats`)

// Auth APIs
export const signup = (formData) => API.post("/auth/signup", formData)
export const login = (formData) => API.post("/auth/login", formData)

export default API