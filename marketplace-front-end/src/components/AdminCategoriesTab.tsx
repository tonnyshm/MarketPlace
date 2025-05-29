import { useEffect, useState } from "react";
import axios from "axios";
import { CategoryDto } from "@/types/dto";

export default function AdminCategoriesTab() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ id?: number; name: string; description: string }>({ name: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    axios.get<CategoryDto[]>("/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => {})
      .then(() => setLoading(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    axios.post<CategoryDto>("/api/categories", {
      name: form.name,
      description: form.description,
    })
      .then(res => {
        setCategories([...categories, res.data]);
        setForm({ name: "", description: "" });
        setMessage("Category created!");
      })
      .catch(() => setMessage("Failed to create category."));
  };

  const handleEdit = (cat: CategoryDto) => {
    setEditingId(cat.id);
    setForm({ id: cat.id, name: cat.name, description: cat.description });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    axios.put<CategoryDto>(`/api/categories/${editingId}`, {
      name: form.name,
      description: form.description,
    })
      .then(res => {
        setCategories(categories.map(c => c.id === editingId ? res.data : c));
        setEditingId(null);
        setForm({ name: "", description: "" });
        setMessage("Category updated!");
      })
      .catch(() => setMessage("Failed to update category."));
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/categories/${id}`)
      .then(() => setCategories(categories.filter(c => c.id !== id)));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Categories</h2>
      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}
      {/* Create/Edit Form */}
      <div className="flex gap-4 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category Name"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
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
            disabled={!form.name}
          >
            Add
          </button>
        )}
      </div>
      {/* List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between bg-[#F7F8FB] p-4 rounded-lg shadow">
            <div>
              <div className="font-semibold">{cat.name}</div>
              <div className="text-sm text-gray-500">{cat.description}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-[#C1CF16] rounded text-[#1C2834] font-bold"
                onClick={() => handleEdit(cat)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-500 rounded text-white font-bold"
                onClick={() => handleDelete(cat.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}