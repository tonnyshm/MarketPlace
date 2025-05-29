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
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  productId: number;
  createdAt: string;
}

export default function DetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`/api/products/${params.id}`);
        const productData = response.data as Product;
        console.log('Raw product data:', productData);
        console.log('Stock value:', productData.stock);
        console.log('Original inStock:', productData.inStock);
        
        // Set inStock based on stock value if available, otherwise keep the original inStock value
        const processedProductData = {
          ...productData,
          inStock: typeof productData.stock === 'number' ? productData.stock > 0 : productData.inStock
        };
        console.log('Final inStock:', processedProductData.inStock);
        setProduct(processedProductData);
        
        // Fetch related products (same category)
        if (productData.categoryId) {
          const relatedResponse = await axios.get<Product[]>(`/api/products?categoryId=${productData.categoryId}&limit=4`);
          const relatedData = relatedResponse.data as Product[];
          console.log('Raw related products:', relatedData);
          const processedRelatedData = relatedData.map(p => ({
            ...p,
            inStock: typeof p.stock === 'number' ? p.stock > 0 : p.inStock
          }));
          console.log('Processed related products:', processedRelatedData);
          setRelatedProducts(processedRelatedData.filter(p => p.id !== productData.id));
        }

        if (productData.id) {
          axios.get<Review[]>(`/api/reviews/product/${productData.id}`)
            .then(res => {
              setReviews(res.data);
              if (res.data.length > 0) {
                const avg = res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length;
                setAverageRating(avg);
              } else {
                setAverageRating(null);
              }
            });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
      
      // Set up periodic refresh every 10 seconds
      const refreshInterval = setInterval(fetchProduct, 10000);
      
      // Cleanup interval on component unmount
      return () => clearInterval(refreshInterval);
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
          <span className="hover:underline cursor-pointer">{product?.category?.name || 'Category'}</span>
          <span>/</span>
          <span className="text-[#1C2834] font-semibold">{product?.name}</span>
        </nav>
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="flex-1 min-w-[350px]">
            <ProductPictures product={product!} />
          </div>
          <div className="flex-1 min-w-[350px]">
            <ProductDetail product={product!} />
          </div>
        </div>
        {/* Average Rating */}
        {averageRating !== null && (
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[#1C2834]">Rating:</span>
            <span className="flex items-center">
              {[1,2,3,4,5].map(n => (
                <svg key={n} width={20} height={20} fill={n <= Math.round(averageRating) ? "#C1CF16" : "#DBDBDB"} viewBox="0 0 20 20">
                  <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                </svg>
              ))}
            </span>
            <span className="text-[#495D69] text-sm">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-bold text-[#1C2834] mb-2">Customer Reviews</h3>
            <div className="flex flex-col gap-4">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-[#F7F8FB] pb-2">
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(n => (
                      <svg key={n} width={16} height={16} fill={n <= r.rating ? "#C1CF16" : "#DBDBDB"} viewBox="0 0 20 20">
                        <polygon points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36" />
                      </svg>
                    ))}
                    <span className="text-xs text-[#495D69] ml-2">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[#1C2834]">{r.comment}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-[#495D69] mt-4">No reviews yet.</div>
        )}
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