'use client'

import { User, Phone, Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { StoreDto, ProductDto } from "@/types/dto";
import axios from "axios";

export default function StoreItem({ store }: { store: StoreDto }) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  useEffect(() => {
    axios.get<ProductDto[]>(`/api/products/store/${store.id}`)
      .then(res => setProducts(res.data));
  }, [store.id]);

  return (
    <div className="flex flex-col justify-center items-start w-full max-w-[1568px] h-[524px] bg-white border border-[#DBDBDB] rounded-2xl p-0 relative">
      {/* Header Row */}
      <div className="flex flex-row items-center w-full h-[100px] border-b border-[#DBDBDB] px-10 py-5 gap-5">
        {/* Store Icon */}
        <div
          className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center"
          style={{
            background: "url('/bg_lines.png'), #C1CF16",
            backgroundSize: "cover",
          }}
        >
          <User className="text-white w-8 h-8" />
        </div>
        {/* Store Info */}
        <div className="flex flex-col flex-1 gap-1">
          <span className="font-medium text-[14px] leading-[18px] text-[#1C2834]">
            {store.name}
          </span>
          <span className="font-light text-[12px] leading-[24px] text-[#495D69]">
            {store.productCount} Products
          </span>
        </div>
        {/* View Profile Button */}
        <button className="flex flex-row items-center gap-2 px-8 py-2 bg-[#C1CF16] rounded-lg font-extrabold text-[14px] leading-[18px] capitalize text-[#1C2834]">
          <User className="w-4 h-4" />
          View Profile
        </button>
        {/* Call Button */}
        <button className="flex items-center justify-center w-12 h-12 border border-[#DBDBDB] rounded-lg ml-2">
          <Phone className="w-4 h-4 text-[#141C24]" />
        </button>
        {/* Favorite Button */}
        <button className="flex items-center justify-center w-12 h-12 border border-[#DBDBDB] rounded-lg ml-2">
          <Heart className="w-4 h-4 text-[#141C24]" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-10 p-10 w-full">
        {/* Left: Store Details */}
        <div className="flex flex-col gap-8 w-[658px]">
          {/* About */}
          <div>
            <div className="font-bold text-[16px] text-[#1C2834] capitalize mb-2">About</div>
            <div className="font-light text-[14px] text-[#495D69] leading-[24px]">
              {store.description}
            </div>
          </div>
          {/* Categories */}
          <div>
            <div className="font-bold text-[16px] text-[#1C2834] capitalize mb-2">Categories</div>
            <div className="flex flex-row gap-2">
              {store.categories?.map((cat) => (
                <span key={cat.id} className="px-5 py-2 border border-[#DBDBDB] rounded-full text-[10px] font-medium text-[#495D69]">{cat.name}</span>
              ))}
            </div>
          </div>
          {/* Reviews */}
          <div>
            <div className="font-bold text-[16px] text-[#1C2834] capitalize mb-2">Reviews</div>
            <div className="flex flex-row items-center gap-4">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#C1CF16]" fill="#C1CF16" />
                <span className="font-bold text-[16px] text-[#495D69]">{store.rating?.toFixed(2) ?? "-"}</span>
              </span>
              <span className="font-light text-[14px] text-[#495D69]">({store.reviewCount} Reviews)</span>
            </div>
          </div>
          {/* Explore Products Button */}
          <button className="flex flex-row items-center justify-center border border-[#DBDBDB] rounded-lg px-8 py-2 font-extrabold text-[14px] text-[#141C24] capitalize mt-4">
            Explore Products
          </button>
        </div>
        {/* Right: Products for this store */}
        <div className="flex-1 flex flex-row gap-8">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="w-[250px] h-[344px] bg-white border border-[#DBDBDB] rounded-2xl flex flex-col">
              <div
                className="w-full h-[256px] rounded-t-2xl"
                style={{
                  background: "url('/bg_lines.png'), #F7F8FB",
                  backgroundSize: "cover",
                }}
              />
              <div className="flex flex-col gap-2 p-5">
                <span className="font-medium text-[14px] text-[#1C2834]">{product.name}</span>
                <div className="flex flex-row items-center gap-2">
                  <span className="font-bold text-[16px] text-[#C1CF16]">{product.price.toLocaleString()} Rwf</span>
                  {product.oldPrice && (
                    <span className="font-bold text-[14px] text-[#DBDBDB] line-through">{product.oldPrice.toLocaleString()} Rwf</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}