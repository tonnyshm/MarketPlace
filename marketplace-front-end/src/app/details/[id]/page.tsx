"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductPictures from '@/components/ProductPictures';
import ProductDetail from '@/components/ProductDetail';
import ShopItem from '@/components/ShopItem';
import OpenYourStore from '@/components/OpenYourStore';
import Footer from '@/components/Footer';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  store?: {
    id: number;
    name: string;
  };
  images?: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}

export default function DetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`/api/products/${params.id}`);
        setProduct(response.data);
        
        // Fetch related products (same category)
        if (response.data.categoryId) {
          const relatedResponse = await axios.get<Product[]>(`/api/products?categoryId=${response.data.categoryId}&limit=4`);
          setRelatedProducts(relatedResponse.data.filter(p => p.id !== response.data.id));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fff]">
        <Navbar />
        <main className="flex-1 w-full max-w-[1568px] mx-auto px-4 pt-8 pb-0 flex flex-col">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
              <div className="flex-1 min-w-[350px] h-[400px] bg-gray-200 rounded"></div>
              <div className="flex-1 min-w-[350px] h-[400px] bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fff]">
        <Navbar />
        <main className="flex-1 w-full max-w-[1568px] mx-auto px-4 pt-8 pb-0 flex flex-col">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#1C2834]">Product not found</h1>
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
        {/* Breadcrumb */}
        <nav className="text-sm text-[#495D69] flex items-center gap-2 mb-6">
          <span className="hover:underline cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:underline cursor-pointer">Products</span>
          <span>/</span>
          <span className="hover:underline cursor-pointer">{product.category?.name || 'Category'}</span>
          <span>/</span>
          <span className="text-[#1C2834] font-semibold">{product.name}</span>
        </nav>
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="flex-1 min-w-[350px]">
            <ProductPictures product={product} />
          </div>
          <div className="flex-1 min-w-[350px]">
            <ProductDetail product={product} />
          </div>
        </div>
        {/* You might also like */}
        {relatedProducts.length > 0 && (
          <div className="mt-2 mb-12">
            <h2 className="font-bold text-lg text-[#1C2834] mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ShopItem key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        <OpenYourStore />
      </main>
      <Footer />
    </div>
  );
} 