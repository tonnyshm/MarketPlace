"use client"
import { ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ShopItem({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleClick = () => {
    router.push(`/details/${product.id}`);
  };

  return (
    <div 
      className="flex flex-col justify-end items-start w-[370px] h-[344px] bg-white border border-[#DBDBDB] rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="w-full h-[256px] bg-[url('/bg_lines.png'),#F7F8FB] bg-cover" />
      <div className="flex flex-row items-center p-5 gap-2 w-full">
        <div className="flex flex-col justify-center items-start gap-2 flex-1">
          <span className="font-medium text-[14px] text-[#1C2834]">{product.name}</span>
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold text-[16px] text-[#C1CF16]">{product.price} Rwf</span>
            {product.oldPrice && (
              <span className="text-[#DBDBDB] font-bold text-base line-through">{product.oldPrice} Rwf</span>
            )}
          </div>
          {product.inStock ? (
            <span className="text-green-600 font-bold">In Stock</span>
          ) : (
            <span className="text-red-600 font-bold">Out of Stock</span>
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          <button 
            disabled={!product.inStock}
            className={`p-2 rounded-lg hover:bg-[#F7F8FB] ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.images?.[0],
                inStock: product.inStock
              });
            }}
          >
            <ShoppingCart className="w-5 h-5 text-[#C1CF16]" />
          </button>
          <button 
            className="p-2 rounded-lg hover:bg-[#F7F8FB]"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Save/wishlist functionality
            }}
          >
            <Heart className="w-5 h-5 text-[#495D69]" />
          </button>
        </div>
      </div>
    </div>
  );
}