import { useEffect, useState } from "react";
import axios from "axios";
import { ProductDto } from "@/types/dto";

export default function AdminProductsTab() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    categoryId: "",
    storeId: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [stores, setStores] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStores();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios.get<ProductDto[]>("/api/products")
      .then(res => setProducts(res.data))
      .catch(() => {})
      .then(() => setLoading(false));
  };

  const fetchCategories = () => {
    axios.get<{ id: number; name: string }[]>("/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => {});
  };

  const fetchStores = () => {
    axios.get<{ id: number; name: string }[]>("/api/stores")
      .then(res => setStores(res.data))
      .catch(() => {});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    axios.post<ProductDto>("/api/products", {
      ...form,
      price: typeof form.price === "string" ? parseFloat(form.price) : form.price,
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      storeId: form.storeId ? Number(form.storeId) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
    })
      .then(res => {
        setProducts([...products, res.data]);
        setForm({ name: "", description: "", price: "", oldPrice: "", stock: "", categoryId: "", storeId: "" });
        setMessage("Product created!");
      })
      .catch(() => setMessage("Failed to create product."));
  };

  const handleEdit = (prod: ProductDto) => {
    setEditingId(prod.id);
    setForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      oldPrice: prod.oldPrice ? prod.oldPrice.toString() : "",
      stock: prod.stock !== undefined ? prod.stock.toString() : "",
      categoryId: prod.categoryId.toString(),
      storeId: prod.storeId.toString(),
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    axios.put<ProductDto>(`/api/products/${editingId}`, {
      ...form,
      price: typeof form.price === "string" ? parseFloat(form.price) : form.price,
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      storeId: form.storeId ? Number(form.storeId) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
    })
      .then(res => {
        setProducts(products.map(p => p.id === editingId ? res.data : p));
        setEditingId(null);
        setForm({ name: "", description: "", price: "", oldPrice: "", stock: "", categoryId: "", storeId: "" });
        setMessage("Product updated!");
      })
      .catch(() => setMessage("Failed to update product."));
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/products/${id}`)
      .then(() => setProducts(products.filter(p => p.id !== id)));
  };

  const handleFeature = (id: number) => {
    axios.post<ProductDto>(`/api/admin/products/${id}/feature`)
      .then(res => setProducts(products.map(p => p.id === id ? res.data : p)));
  };

  const handleSearch = () => {
    if (!search) {
      fetchProducts();
      return;
    }
    setLoading(true);
    axios.get<ProductDto[]>(`/api/products/search?query=${encodeURIComponent(search)}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .then(() => setLoading(false));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or description"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <button
          className="bg-[#C1CF16] text-[#1C2834] px-4 py-2 rounded font-bold"
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className="bg-gray-300 text-[#1C2834] px-4 py-2 rounded font-bold"
          onClick={() => { setSearch(""); fetchProducts(); }}
        >
          Reset
        </button>
      </div>

      {/* Create/Edit Form */}
      <div className="bg-white rounded-xl p-8 mb-6 max-w-xl w-full mx-auto shadow flex flex-col gap-4">
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Product Name"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <input
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <input
          name="price"
          value={form.price || ""}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <input
          name="oldPrice"
          value={form.oldPrice || ""}
          onChange={handleChange}
          placeholder="Old Price"
          type="number"
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <input
          name="stock"
          value={form.stock || ""}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          min={0}
          className="border border-[#C1CF16] rounded px-4 py-2"
        />
        <select
          name="categoryId"
          value={form.categoryId || ""}
          onChange={handleChange}
          className="border border-[#C1CF16] rounded px-4 py-2"
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="storeId"
          value={form.storeId || ""}
          onChange={handleChange}
          className="border border-[#C1CF16] rounded px-4 py-2"
        >
          <option value="">Select Store</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
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
              onClick={() => { setEditingId(null); setForm({ name: "", description: "", price: "", oldPrice: "", stock: "", categoryId: "", storeId: "" }); }}
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
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between bg-[#F7F8FB] p-4 rounded-lg shadow">
            <div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-gray-500">{product.description}</div>
              <div className="text-sm text-gray-500">Price: ${product.price}</div>
              <div className="text-sm text-gray-500">
                Category: {categories.find(c => c.id === product.categoryId)?.name || 'N/A'} | 
                Store: {stores.find(s => s.id === product.storeId)?.name || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                Old Price: {product.oldPrice ? `$${product.oldPrice}` : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                Stock: {product.stock}
              </div>
              {product.featured && <span className="text-green-600 font-bold">(Featured)</span>}
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-[#C1CF16] rounded text-[#1C2834] font-bold"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-[#C1CF16] rounded text-[#1C2834] font-bold"
                onClick={() => handleFeature(product.id)}
              >
                Feature
              </button>
              <button
                className="px-4 py-2 bg-red-500 rounded text-white font-bold"
                onClick={() => handleDelete(product.id)}
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
