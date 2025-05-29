import { ShoppingCart, Heart } from "lucide-react";

export default function SavedProduct({
  title,
  price,
  oldPrice,
  storeName,
  onAddToCart,
}: {
  title: string;
  price: string;
  oldPrice: string;
  storeName?: string;
  onAddToCart?: () => void;
}) {
  return (
    <div className="flex flex-col justify-end items-start w-[370px] h-[344px] bg-white border border-[#DBDBDB] rounded-2xl overflow-hidden">
      <div className="w-full h-[256px] bg-[url('/bg_lines.png'),#F7F8FB] bg-cover" />
      <div className="flex flex-row items-center p-5 gap-2 w-full">
        <div className="flex flex-col justify-center items-start gap-2 flex-1">
          <span className="font-medium text-[14px] text-[#1C2834]">{title}</span>
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold text-[16px] text-[#C1CF16]">{price}</span>
            {oldPrice && (
              <span className="font-bold text-[14px] text-[#DBDBDB] line-through">{oldPrice}</span>
            )}
          </div>
          {storeName && (
            <span className="text-xs text-[#495D69]">Store: {storeName}</span>
          )}
        </div>
        <button
          className="flex items-center justify-center w-12 h-12 border border-[#DBDBDB] rounded-lg ml-2"
          onClick={onAddToCart}
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-5 h-5 text-[#C1CF16]" />
        </button>
        <button className="flex items-center justify-center w-12 h-12 border border-[#DBDBDB] rounded-lg ml-2 bg-[#C1CF16]/20">
          <Heart className="w-4 h-4 text-[#C1CF16]" />
        </button>
      </div>
    </div>
  );
}