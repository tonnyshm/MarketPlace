"use client"
import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OpenYourStore from "@/components/OpenYourStore";
import SavedProduct from "@/components/SavedProduct";
import axios from 'axios';
import { useCart } from "@/context/CartContext";

interface SavedProduct {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  store?: { name: string };
}

export default function SavedPage() {
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSavedProducts = async () => {
      try {
        const response = await axios.get<SavedProduct[]>('/api/saved');
        setSavedProducts(response.data);
      } catch (error) {
        console.error('Error fetching saved products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fff]">
        <Navbar />
        <main className="flex-1 w-full max-w-[1568px] mx-auto px-4 pt-8 pb-0 flex flex-col">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[344px] bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fff]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1568px] mx-auto px-4 pt-8 pb-0 flex flex-col">
        <h1 className="text-2xl font-bold text-[#1C2834] mb-6">Saved Products</h1>
        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <SavedProduct
                key={product.id}
                title={product.name}
                price={`${product.price} Rwf`}
                oldPrice={product.oldPrice ? `${product.oldPrice} Rwf` : ''}
                storeName={product.store?.name}
                onAddToCart={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice,
             
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#495D69]">You haven't saved any products yet.</p>
          </div>
        )}
      </main>
      <br></br>
      <OpenYourStore />
      <Footer />
    </div>
  );
}