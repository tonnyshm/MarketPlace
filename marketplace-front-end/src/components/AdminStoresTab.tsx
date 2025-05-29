import { useEffect, useState } from "react";
import axios from "axios";
import { StoreDto, OrderDto } from "@/types/dto";

export default function AdminStoresTab() {
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<StoreDto>>({ name: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, []);

  const fetchStores = () => {
    setLoading(true);
    axios.get<StoreDto[]>("/api/stores")
      .then(res => setStores(res.data))
      .catch(() => {})
      .then(() => setLoading(false));
  };

  const fetchUsers = () => {
    axios.get<{ id: number; name: string }[]>("/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(() => {});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!selectedUserId) {
      setMessage("Please select a user.");
      return;
    }
    axios.post<StoreDto>(`/api/stores/${selectedUserId}`, form)
      .then(res => {
        setStores([...stores, res.data]);
        setForm({ name: "", description: "" });
        setSelectedUserId(undefined);
        setMessage("Store created!");
      })
      .catch(() => setMessage("Failed to create store."));
  };

  const handleEdit = (store: StoreDto) => {
    setEditingId(store.id);
    setForm({
      name: store.name,
      description: store.description,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    axios.put<StoreDto>(`/api/stores/${editingId}`, form)
      .then(res => {
        setStores(stores.map(s => s.id === editingId ? res.data : s));
        setEditingId(null);
        setForm({ name: "", description: "" });
        setMessage("Store updated!");
      })
      .catch(() => setMessage("Failed to update store."));
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/stores/${id}`)
      .then(() => setStores(stores.filter(s => s.id !== id)));
  };

  const handleViewOrders = (storeId: number) => {
    setSelectedStoreId(storeId);
    axios.get<OrderDto[]>(`/api/stores/${storeId}/orders`)
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Stores</h2>
      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}

      {/* Create/Edit Form */}
      <div className="flex gap-4 mb-6">
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Store Name"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <input
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <select
          value={selectedUserId || ""}
          onChange={e => setSelectedUserId(Number(e.target.value))}
          className="border border-[#C1CF16] rounded px-4 py-2"
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {editingId ? (
          <>
            <button
              className="bg-[#C1CF16] text-[#1C2834] px-4 py-2 rounded font-bold"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="bg-gray-300 text-[#1C2834] px-4 py-2 rounded font-bold"
              onClick={() => { setEditingId(null); setForm({ name: "", description: "" }); }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="bg-[#C1CF16] text-[#1C2834] px-4 py-2 rounded font-bold"
            onClick={handleCreate}
            disabled={!form.name || !selectedUserId}
          >
            Add
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="flex items-center justify-between bg-[#F7F8FB] p-4 rounded-lg shadow">
            <div>
              <div className="font-semibold">{store.name}</div>
              <div className="text-sm text-gray-500">{store.description}</div>
              <div className="text-sm text-gray-500">Owner: {store.ownerName}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-[#C1CF16] rounded text-[#1C2834] font-bold"
                onClick={() => handleEdit(store)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-[#C1CF16] rounded text-[#1C2834] font-bold"
                onClick={() => handleViewOrders(store.id)}
              >
                View Orders
              </button>
              <button
                className="px-4 py-2 bg-red-500 rounded text-white font-bold"
                onClick={() => handleDelete(store.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Modal */}
      {selectedStoreId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">Orders for Store</h3>
            <div className="space-y-2">
              {orders.map(order => (
                <div key={order.id} className="border p-2 rounded">
                  <div>Order ID: {order.id}</div>
                  <div>Status: {order.status}</div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-[#C1CF16] rounded text-[#1C2834] font-bold"
              onClick={() => setSelectedStoreId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}