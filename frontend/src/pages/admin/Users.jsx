function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <table className="w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Files Uploaded</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.fileCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
