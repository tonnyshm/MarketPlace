"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { StoreDto } from "@/types/dto";

export default function SellerPage() {
  const [tab, setTab] = useState<"store" | "products" | "orders" | "categories">("store");
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (user.role !== "SELLER") {
      router.push("/"); // or show a "Not authorized" message
    }
  }, [user, router]);

  if (!user || user.role !== "SELLER") {
    return <div>Checking seller access...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FB]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Seller Control Center</h1>
        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab("store")} className={`px-6 py-2 rounded-full font-semibold ${tab === "store" ? "bg-[#C1CF16] text-[#1C2834]" : "bg-white text-[#495D69]"}`}>Store</button>
          <button onClick={() => setTab("products")} className={`px-6 py-2 rounded-full font-semibold ${tab === "products" ? "bg-[#C1CF16] text-[#1C2834]" : "bg-white text-[#495D69]"}`}>Products</button>
          <button onClick={() => setTab("orders")} className={`px-6 py-2 rounded-full font-semibold ${tab === "orders" ? "bg-[#C1CF16] text-[#1C2834]" : "bg-white text-[#495D69]"}`}>Orders</button>
          <button onClick={() => setTab("categories")} className={`px-6 py-2 rounded-full font-semibold ${tab === "categories" ? "bg-[#C1CF16] text-[#1C2834]" : "bg-white text-[#495D69]"}`}>Categories</button>
        </div>
        <div className="bg-white rounded-2xl border border-[#DBDBDB] p-8 shadow-sm">
          {tab === "store" && <StoreSection user={user} />}
          {tab === "products" && <ProductsSection user={user} />}
          {tab === "orders" && <OrdersSection user={user} />}
          {tab === "categories" && <CategoriesSection />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// --- Store Management ---
function StoreSection({ user }: { user: any }) {
  const [store, setStore] = useState<StoreDto | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get<StoreDto>(`/api/stores/owner/${user.id}`)
      .then(res => {
        setStore(res.data);
        setName(res.data?.name || "");
        setDescription(res.data?.description || "");
      })
      .catch(() => setStore(null));
  }, [user.id]);

  const handleCreate = async () => {
    axios.post<StoreDto>(`/api/stores/${user.id}`, { name, description })
      .then(res => {
        setStore(res.data);
        setMessage("Store created!");
      })
      .catch(() => setMessage("Failed to create store."));
  };

  const handleUpdate = async () => {
    if (!store) return;
    axios.put<StoreDto>(`/api/stores/${store.id}`, { name, description })
      .then(res => {
        setStore(res.data);
        setEditing(false);
        setMessage("Store updated!");
      })
      .catch(() => setMessage("Failed to update store."));
  };

  const handleDelete = async () => {
    if (!store || !window.confirm("Are you sure?")) return;
    axios.delete(`/api/stores/${store.id}`)
      .then(() => {
        setStore(null);
        setName("");
        setDescription("");
        setMessage("Store deleted!");
      })
      .catch(() => setMessage("Failed to delete store."));
  };

  return (
    <div>
      <h2 className="font-bold mb-4 text-xl">Your Store</h2>
      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}
      {!store ? (
        <div className="flex flex-col gap-4 max-w-lg">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Store Name" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg" />
          <button onClick={handleCreate} className="bg-[#C1CF16] text-[#1C2834] px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#b1be12]">Create Store</button>
        </div>
      ) : editing ? (
        <div className="flex flex-col gap-4 max-w-lg">
          <input value={name} onChange={e => setName(e.target.value)} className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg" />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-[#C1CF16] text-[#1C2834] px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#b1be12]">Save</button>
            <button onClick={() => setEditing(false)} className="px-6 py-3 rounded-lg border">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 store-card">
          <div><b>Name:</b> {store.name}</div>
          <div><b>Description:</b> {store.description}</div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setEditing(true)} className="bg-[#C1CF16] text-[#1C2834] px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#b1be12]">Edit</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg">Delete Store</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Product Management ---
function ProductsSection({ user }: { user: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [store, setStore] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", oldPrice: "", stock: "", categoryId: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    axios.get<any>(`/api/stores/owner/${user.id}`)
      .then(res => setStore(res.data));
    axios.get<any[]>(`/api/categories`)
      .then(res => setCategories(res.data.map(cat => ({ ...cat, id: Number(cat.id) }))));
  }, [user.id]);

  useEffect(() => {
    if (store) {
      axios.get<any[]>(`/api/products/store/${store.id}`)
        .then(res => setProducts(res.data));
    }
  }, [store]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!store) {
      setMessage("Store not loaded. Please try again.");
      return;
    }
    if (!form.categoryId) {
      setMessage("Please select a category.");
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      categoryId: Number(form.categoryId),
      storeId: store.id
    };
    console.log("Payload:", payload);
    axios.post<any>(`/api/products`, payload)
      .then(() => {
        setForm({ name: "", description: "", price: "", oldPrice: "", stock: "", categoryId: "" });
        setMessage("Product added!");
        axios.get<any[]>(`/api/products/store/${store.id}`)
          .then(res => setProducts(res.data));
      })
      .catch(() => setMessage("Failed to add product."));
  };

  const handleUpdate = async (id: number) => {
    if (!form.categoryId) {
      setMessage("Please select a category.");
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      categoryId: Number(form.categoryId),
      storeId: store.id
    };
    axios.put<any>(`/api/products/${id}`, payload)
      .then(() => {
        setEditingId(null);
        setForm({ name: "", description: "", price: "", oldPrice: "", stock: "", categoryId: "" });
        setMessage("Product updated!");
        axios.get<any[]>(`/api/products/store/${store.id}`)
          .then(res => setProducts(res.data));
      })
      .catch(() => setMessage("Failed to update product."));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    axios.delete(`/api/products/${id}`)
      .then(() => {
        setProducts(products.filter(p => p.id !== id));
        setMessage("Product deleted!");
      })
      .catch(() => setMessage("Failed to delete product."));
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get<any[]>(`/api/products/search?query=${encodeURIComponent(search)}`);
      setProducts(res.data.filter((p: any) => p.store?.id === store?.id));
    } catch {
      setMessage("Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setSearch("");
    if (store) {
      axios.get<any[]>(`/api/products/store/${store.id}`)
        .then(res => setProducts(res.data));
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-4 text-xl">Products</h2>
      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}
      <div className="mb-6 flex flex-wrap gap-4 items-end bg-[#F7F8FB] p-4 rounded-lg">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-56" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-56" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-40" />
        <input name="oldPrice" value={form.oldPrice} onChange={handleChange} placeholder="Old Price" type="number" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-40" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" min={0} className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-40" />
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-56">
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {editingId ? (
          <button onClick={() => handleUpdate(editingId)} className="bg-[#C1CF16] text-[#1C2834] px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#b1be12]">Update</button>
        ) : (
          <button onClick={handleCreate} className="bg-[#C1CF16] text-[#1C2834] px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#b1be12]">Add</button>
        )}
      </div>
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border border-[#C1CF16] rounded-lg px-4 py-2 text-lg w-72"
        />
        <button
          onClick={handleSearch}
          className="bg-[#C1CF16] text-[#1C2834] px-4 py-2 rounded-lg font-bold"
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>
        <button
          onClick={handleReset}
          className="ml-2 px-4 py-2 rounded-lg border"
        >
          Reset
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg bg-white">
          <thead>
            <tr className="bg-[#F7F8FB]">
              <th className="border p-3">Name</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Old Price</th>
              <th className="border p-3">Stock</th>
              <th className="border p-3">Category</th>
              <th className="border p-3">Featured</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-[#F7F8FB]">
                <td className="border p-3">{p.name}</td>
                <td className="border p-3">{p.description}</td>
                <td className="border p-3">{p.price}</td>
                <td className="border p-3">{p.oldPrice ?? "-"}</td>
                <td className="border p-3">{p.stock}</td>
                <td className="border p-3">{p.category?.name}</td>
                <td className="border p-3">{p.featured ? "Yes" : "No"}</td>
                <td className="border p-3">
                  <button
                    onClick={() => {
                      setEditingId(p.id);
                      setForm({
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        oldPrice: p.oldPrice || "",
                        stock: p.stock ? String(p.stock) : "",
                        categoryId: p.category?.id ? String(p.category.id) : ""
                      });
                    }}
                    className="mr-2 bg-[#C1CF16] text-[#1C2834] px-4 py-2 rounded-lg font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-white bg-red-500 px-4 py-2 rounded-lg font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && <div className="mt-4 text-gray-500">No products found.</div>}
    </div>
  );
}

// --- Orders Management ---
function OrdersSection({ user }: { user: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [store, setStore] = useState<any>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get<any>(`/api/stores/owner/${user.id}`)
      .then(res => {
        console.log('Store data:', res.data);
        setStore(res.data);
      })
      .catch(err => {
        console.error('Error fetching store:', err);
        setError("Failed to load store data.");
      });
  }, [user.id]);

  useEffect(() => {
    if (store) {
      console.log('Fetching orders for store:', store.id);
      axios.get<any[]>(`/api/stores/${store.id}/orders`)
        .then(res => {
          console.log('Orders data:', res.data);
          // Ensure each order has a status field
          const processedOrders = res.data.map(order => ({
            ...order,
            status: order.status || 'PENDING' // Default to PENDING if status is missing
          }));
          setOrders(processedOrders);
        })
        .catch(err => {
          console.error("Error fetching orders:", err);
          setError("Failed to load orders. Please try again.");
        });
    }
  }, [store]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    console.log('Updating order status:', { orderId, newStatus, storeId: store?.id });
    try {
      const response = await axios.put<any>(`/api/orders/${orderId}/status`, { 
        status: newStatus,
        storeId: store.id 
      });
      console.log('Status update response:', response.data);
      
      // Update the orders list with the new status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      setMessage(`Order #${orderId} marked as ${newStatus.toLowerCase()}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="font-bold mb-4 text-xl">Orders</h2>
      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg bg-white">
          <thead>
            <tr className="bg-[#F7F8FB]">
              <th className="border p-3">Order ID</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Total</th>
              <th className="border p-3">Created At</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => {
              console.log('Rendering order:', order);
              const showActions = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';
              console.log('Show actions for order', order.id, ':', showActions, 'Current status:', order.status);
              
              return (
                <tr key={order.id} className="hover:bg-[#F7F8FB]">
                  <td className="border p-3">{order.id}</td>
                  <td className="border p-3">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border p-3">{order.totalAmount} Rwf</td>
                  <td className="border p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="border p-3">
                    {showActions && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(order.id, "COMPLETED")}
                          className="px-4 py-2 bg-[#C1CF16] text-[#1C2834] rounded-lg font-bold hover:bg-[#b1be12]"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, "CANCELLED")}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && <div className="mt-4 text-gray-500">No orders found.</div>}
    </div>
  );
}

// --- Categories Management ---
function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get<any[]>(`/api/categories`)
      .then(res => setCategories(res.data));
  }, []);

  const handleCreate = async () => {
    axios.post(`/api/categories`, { name, description })
      .then(() => {
        setName("");
        setDescription("");
        setMessage("Category added!");
        axios.get<any[]>(`/api/categories`)
          .then(res => setCategories(res.data));
      })
      .catch(() => setMessage("Failed to add category."));
  };

  return (
    <div>
      <h2 className="font-bold mb-4 text-xl">Categories</h2>
      {message && <div className="mb-4 text-green-700 font-semibold">{message}</div>}
      <div className="mb-6 flex flex-wrap gap-4 items-end bg-[#F7F8FB] p-4 rounded-lg">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Category Name" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-56" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border border-[#C1CF16] focus:ring-2 focus:ring-[#C1CF16] rounded-lg px-4 py-3 text-lg w-56" />
        <button onClick={handleCreate} className="bg-[#C1CF16] text-[#1C2834] px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#b1be12]">Add</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg bg-white">
          <thead>
            <tr className="bg-[#F7F8FB]">
              <th className="border p-3">Name</th>
              <th className="border p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c.id} className="hover:bg-[#F7F8FB]">
                <td className="border p-3">{c.name}</td>
                <td className="border p-3">{c.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}