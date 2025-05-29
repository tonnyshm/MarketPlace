import { useEffect, useState } from 'react';
import { Search, Filter, ExternalLink, ChevronRight, Store } from 'lucide-react';
import axios from 'axios';

interface StoreDto {
  id: number;
  name: string;
  productCount: number;
}

export default function Top10Store() {
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get<StoreDto[]>('/api/stores/top');
        setStores(res.data);
      } catch (e) {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <aside className="w-[370px] bg-white rounded-2xl border border-[#E3E3E3] p-6 flex flex-col gap-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-[#C1CF16]" />
          <span className="font-bold text-lg text-[#1C2834]">Top 10 Stores</span>
        </div>
        <ExternalLink className="w-5 h-5 text-[#495D69] cursor-pointer" />
      </div>
      {/* Search Bar */}
      <div className="bg-[#F7F8FB] rounded-lg flex items-center px-4 py-3 mb-2">
        <Search className="w-4 h-4 text-[#C1CF16]" />
        <input
          type="text"
          placeholder="Search a store"
          className="ml-3 flex-1 bg-transparent outline-none text-sm text-[#1C2834] placeholder:text-[#1C2834]/60"
        />
        <Filter className="w-4 h-4 text-[#C1CF16] ml-2 cursor-pointer" />
      </div>
      {/* Store List */}
      <ul className="flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))
        ) : (
          stores.map((store) => (
            <li key={store.id} className="flex items-center gap-4 cursor-pointer group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#C1CF16] bg-cover bg-[url('/bg_lines.png')]" />
              <div className="flex-1">
                <div className="font-semibold text-[#1C2834] text-base leading-tight">{store.name}</div>
                <div className="text-xs text-[#495D69] font-light">{store.productCount} Products</div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C1CF16] opacity-70 group-hover:translate-x-1 transition" />
            </li>
          ))
        )}
      </ul>
    </aside>
  );
} 