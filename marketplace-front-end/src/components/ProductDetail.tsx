import { Star, Heart, MoreVertical, Phone, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCart } from "@/context/CartContext";

interface SavedCheckResponse {
  saved: boolean;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  productId: number;
  createdAt: string;
}

export default function ProductDetail({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    // Check if product is saved when component mounts
    const checkIfSaved = async () => {
      try {
        const response = await axios.get<SavedCheckResponse>(`/api/saved/check/${product.id}`);
        setIsSaved(response.data.saved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    checkIfSaved();
  }, [product.id]);

  useEffect(() => {
    if (product?.id) {
      axios.get<Review[]>(`/api/reviews/product/${product.id}`)
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
  }, [product?.id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Check if product has stock value, otherwise use inStock
    const isInStock = typeof product.stock === 'number' ? product.stock > 0 : product.inStock;
    console.log('Product stock:', product.stock);
    console.log('Product inStock:', product.inStock);
    console.log('Is in stock:', isInStock);
    if (!isInStock) {
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.images?.[0],
      inStock: isInStock
    }, quantity);
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await axios.delete(`/api/saved/${product.id}`);
      } else {
        await axios.post(`/api/saved/${product.id}`);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  const handleContactStore = () => {
    // TODO: Implement contact store functionality
    console.log('Contacting store:', product.store);
  };

  if (!product) return null;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-[#DBDBDB] p-8 shadow-sm flex flex-col gap-8">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-[#1C2834]">Product Details</span>
          <span className="ml-2 px-2 py-1 rounded bg-[#F7F8FB] text-xs font-semibold text-[#495D69] border border-[#DBDBDB]">
            {typeof product.stock === 'number' ? (product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK') : (product.inStock ? 'IN STOCK' : 'OUT OF STOCK')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={`flex items-center gap-2 px-6 py-2 border border-[#DBDBDB] rounded-lg font-semibold text-[#1C2834] bg-white hover:bg-[#F7F8FB] ${isSaved ? 'text-[#C1CF16]' : ''}`}
            onClick={handleSave}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'text-[#C1CF16]' : ''}`} fill={isSaved ? '#C1CF16' : 'none'} /> 
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F7F8FB]">
            <MoreVertical className="w-5 h-5 text-[#495D69]" />
          </button>
        </div>
      </div>
      <hr className="-mx-8 border-[#DBDBDB]" />
      {/* Product Info */}
      <div className="flex flex-col gap-6 mt-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1C2834] mb-2">{product.name}</h2>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[#C1CF16] font-bold text-xl">
              {product.price.toLocaleString()} Rwf
            </span>
            {product.oldPrice && (
              <span className="text-[#DBDBDB] font-bold text-base line-through">${product.oldPrice}</span>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[#1C2834] mb-1">Description</h3>
          <p className="text-[#495D69] text-base font-normal">{product.description}</p>
        </div>
        <div>
          <h3 className="font-bold text-[#1C2834] mb-1">Reviews</h3>
          {averageRating !== null && (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-[#1C2834]">Rating:</span>
              <span className="flex items-center">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-5 h-5 ${n <= Math.round(averageRating) ? "text-[#C1CF16]" : "text-[#DBDBDB]"}`} fill={n <= Math.round(averageRating) ? "#C1CF16" : "none"} />
                ))}
              </span>
              <span className="text-[#495D69] text-sm">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
            </div>
          )}
          {reviews.length > 0 ? (
            <div className="flex flex-col gap-2">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-[#F7F8FB] pb-2">
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-4 h-4 ${n <= r.rating ? "text-[#C1CF16]" : "text-[#DBDBDB]"}`} fill={n <= r.rating ? "#C1CF16" : "none"} />
                    ))}
                    <span className="text-xs text-[#495D69] ml-2">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[#1C2834]">{r.comment}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#495D69] mt-2">No reviews yet.</div>
          )}
        </div>
        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-2 mt-2">
          {(() => {
            const isInStock = typeof product.stock === 'number' ? product.stock > 0 : product.inStock;
            console.log('Rendering cart section - isInStock:', isInStock);
            return isInStock ? (
              <>
                <button 
                  className="w-12 h-12 border border-[#DBDBDB] rounded-lg text-2xl font-bold text-[#1C2834] bg-white hover:bg-[#F7F8FB]"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="w-12 h-12 flex items-center justify-center border border-[#F7F8FB] rounded-lg bg-[#F7F8FB] text-lg font-bold text-[#1C2834]">
                  {quantity}
                </span>
                <button 
                  className="w-12 h-12 border border-[#DBDBDB] rounded-lg text-2xl font-bold text-[#1C2834] bg-white hover:bg-[#F7F8FB]"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
                <button 
                  className="flex items-center gap-2 px-8 py-3 bg-[#C1CF16] rounded-lg font-bold text-[16px] text-[#1C2834] ml-4 hover:bg-[#b0b800] transition-colors"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" /> Add To Cart
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-8 py-3 bg-gray-200 rounded-lg font-bold text-[16px] text-gray-500 ml-4 cursor-not-allowed">
                <ShoppingCart className="w-5 h-5" /> Out of Stock
              </div>
            );
          })()}
        </div>
      </div>
      <hr className="-mx-8 border-[#DBDBDB]" />
      {/* Store Info Row */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#C1CF16] flex items-center justify-center mr-2 bg-cover bg-[url('/bg_lines.png')]" />
          <span className="font-bold text-[#1C2834]">{product.store?.name || 'Store Name'}</span>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-2 border border-[#DBDBDB] rounded-lg font-semibold text-[#1C2834] bg-white hover:bg-[#F7F8FB]"
          onClick={handleContactStore}
        >
          <Phone className="w-4 h-4 text-[#C1CF16]" /> Contact Store
        </button>
      </div>
    </div>
  );
} 