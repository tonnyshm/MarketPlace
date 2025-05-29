"use client";
import { useEffect, useState } from "react";
import Navbar from '@/components/Navbar';
import StoreHeaderSection from '@/components/StoreHeaderSection';
import StoreItem from '@/components/StoreItem';
import OpenYourStore from '@/components/OpenYourStore';
import Footer from '@/components/Footer';
import axios from 'axios';

export interface StoreDto {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
  productCount: number;
  categories: { id: number; name: string }[];
  rating: number;
  reviewCount: number;
}

export default function StorePage() {
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(3);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get<StoreDto[]>("/api/stores");
        setStores(response.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // If you have a backend search endpoint for stores, use it:
      // const response = await axios.get<StoreDto[]>(`/api/stores/search?query=${encodeURIComponent(query)}`);
      // setStores(response.data);

      // If not, filter client-side:
      setStores(prev =>
        prev.filter(store =>
          store.name.toLowerCase().includes(query.toLowerCase()) ||
          store.description.toLowerCase().includes(query.toLowerCase())
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const storesWithCategoryDescriptions = stores.map(store => ({
    ...store,
    categories: store.categories?.map(cat => ({
      ...cat,
      description: ""
    }))
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-0 pt-8 pb-0 bg-white">
        <StoreHeaderSection onSearch={handleSearch} />
        <div className="w-full max-w-[1568px] px-4 mx-auto flex flex-col gap-8 my-12">
          {loading ? (
            Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-[524px] bg-gray-100 rounded-2xl animate-pulse" />
            ))
          ) : (
            storesWithCategoryDescriptions.slice(0, count).map((store) => (
              <StoreItem key={store.id} store={store} />
            ))
          )}
        </div>
        {stores.length > count && (
          <button
            className="mb-8 px-8 py-3 rounded-lg bg-[#C1CF16] text-[#1C2834] font-bold hover:bg-[#b1be12] transition"
            onClick={() => setCount((c) => c + 3)}
          >
            Load More
          </button>
        )}
        <OpenYourStore />
      </main>
      <Footer />
    </div>
  );
}