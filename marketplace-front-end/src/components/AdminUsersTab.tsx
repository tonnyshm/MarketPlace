import { useEffect, useState } from "react";
import axios from "axios";
import { UserDto } from "@/types/dto";

export default function AdminUsersTab() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<UserDto[]>("/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(() => {})
      .then(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`/api/admin/users/${id}`)
      .then(() => setUsers(users.filter(u => u.id !== id)));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between bg-[#F7F8FB] p-4 rounded-lg shadow">
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email} - {user.role}</div>
            </div>
            <button
              className="px-4 py-2 bg-red-500 rounded text-white font-bold"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}