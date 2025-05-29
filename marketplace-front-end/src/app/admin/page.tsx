"use client"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSellersTab from "@/components/AdminSellersTab";
import AdminUsersTab from "@/components/AdminUsersTab";
import AdminStoresTab from "@/components/AdminStoresTab";
import AdminProductsTab from "@/components/AdminProductsTab";
import AdminOrdersTab from "@/components/AdminOrdersTab";
import AdminCategoriesTab from "@/components/AdminCategoriesTab";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const TABS = [
  { label: "Sellers", component: <AdminSellersTab /> },
  { label: "Users", component: <AdminUsersTab /> },
  { label: "Stores", component: <AdminStoresTab /> },
  { label: "Products", component: <AdminProductsTab /> },
  { label: "Orders", component: <AdminOrdersTab /> },
  { label: "Categories", component: <AdminCategoriesTab /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  // Protect the page: only allow admins
  useEffect(() => {
    if (!user) {
      // Not logged in, redirect to login
      router.push("/");
    } else if (user.role !== "ADMIN") {
      // Not an admin, redirect or show error
      router.push("/");
    }
  }, [user, router]);

  // Optionally, show a loading state while checking auth
  if (!user || user.role !== "ADMIN") {
    return <div className="flex items-center justify-center min-h-screen">Checking admin access...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-8">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              className={`px-6 py-2 rounded-t font-semibold border-b-2 transition-all
                ${tab === i
                  ? "bg-white border-[#C1CF16] text-[#1C2834]"
                  : "bg-[#F7F8FB] border-transparent text-[#495D69] hover:bg-white"}`}
              onClick={() => setTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-[#DBDBDB] p-8 shadow-sm min-h-[400px]">
          {TABS[tab].component}
        </div>
      </main>
      <Footer />
    </div>
  );
}