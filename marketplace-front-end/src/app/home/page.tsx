"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import the global auth context
import Navbar from '@/components/Navbar';
import StoreHeaderSection from '@/components/StoreHeaderSection';
import ShopItem from '@/components/ShopItem';
import Top10Store from '@/components/Top10Store';
import OpenYourStore from '@/components/OpenYourStore';
import Footer from '@/components/Footer';
// import SearchSection from '@/components/SearchSection';
import axios from 'axios';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth(); // Use the global auth context
  const [products, setProducts] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/'); // Redirect to login page if not logged in
    }
  }, [user, router]);

  useEffect(() => {
    // Load all products initially
    const fetchProducts = async () => {
      try {
        const res = await axios.get<any[]>('/api/products');
        // Process products to ensure correct stock status
        const processedProducts = res.data.map(product => ({
          ...product,
          inStock: typeof product.stock === 'number' ? product.stock > 0 : product.inStock
        }));
        console.log('Processed products:', processedProducts);
        setProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    // Set up periodic refresh every 30 seconds
    const refreshInterval = setInterval(fetchProducts, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get<any[]>(`/api/products/search?query=${encodeURIComponent(query)}`);
      // Process search results the same way
      const processedProducts = res.data.map(product => ({
        ...product,
        inStock: typeof product.stock === 'number' ? product.stock > 0 : product.inStock
      }));
      setProducts(processedProducts);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-0 pt-8 pb-0 bg-white">
        <StoreHeaderSection onSearch={handleSearch} />
        <div className="w-full max-w-[1568px] mx-auto flex flex-col md:flex-row gap-8 my-12 px-4">
          {/* Main grid of ShopItems */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 && !searching && (
              <div className="col-span-full text-center text-[#495D69]">No products found.</div>
            )}
            {products.map(product => (
              <ShopItem key={product.id} product={product} />
            ))}
          </div>
          {/* Sidebar for Top10Store */}
          <div className="w-full md:w-[370px] flex-shrink-0">
            <Top10Store />
          </div>
        </div>
        <OpenYourStore />
      </main>
      <Footer />
    </div>
  );
}
