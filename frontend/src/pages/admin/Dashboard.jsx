import React, { useState, useEffect } from "react";
import {
  fetchUsers,
  fetchUsage,
  deleteUser,
  updateRole,
  getStats,
} from "../../services/api.js"; // adjust path according to your project

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userUsage, setUserUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // Fetch system stats
  const loadStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  // Fetch usage for a specific user
  const loadUserUsage = async (id) => {
    try {
      const res = await fetchUsage(id);
      setUserUsage(res.data);
    } catch (err) {
      console.error("Failed to fetch user usage", err);
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      loadUsers(); // refresh list
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  // Update user role
  const handleUpdateRole = async (id, newRole) => {
    try {
      await updateRole(id, newRole); // adjust backend if needed
      loadUsers(); // refresh list
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadUsers(), loadStats()]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section className="stats">
            <h2>System Stats</h2>
            <p>Total Users: {stats.totalUsers}</p>
            <p>Total Datasets: {stats.totalDatasets}</p>
            <p>Total Charts: {stats.totalCharts}</p>
            <p>Storage Used (MB): {stats.storageUsedMB}</p>
          </section>

          <section className="users">
            <h2>Users</h2>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateRole(
                            user._id,
                            user.role === "admin" ? "user" : "admin"
                          )
                        }
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUserId(user._id);
                          loadUserUsage(user._id);
                        }}
                      >
                        View Usage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {selectedUserId && userUsage && (
            <section className="usage">
              <h2>User Usage - {selectedUserId}</h2>
              <p>Datasets Uploaded: {userUsage.datasetsUploaded}</p>
              <p>Charts Generated: {userUsage.chartsGenerated}</p>
              <p>Storage Used (MB): {userUsage.storageUsedMB}</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
