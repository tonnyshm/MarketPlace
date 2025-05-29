import SearchSection from './SearchSection';

export default function StoreHeaderSection({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <section className="w-full max-w-[1700px] mx-auto bg-[#F7F8FB] rounded-3xl py-12 px-6 flex flex-col items-center justify-center relative" style={{ minHeight: 260 }}>
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-center mb-2">
        <span className="text-[#C1CF16]">Mark8</span>
        <span className="text-[#1C2834]"> Stores</span>
      </h1>
      {/* Store Count */}
      <span className="text-[#495D69] text-base font-normal mb-6">54 Stores</span>
      {/* Search Section */}
      <div className="w-full max-w-2xl mb-6">
        <SearchSection onSearch={onSearch} />
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-row gap-4 mt-2">
        <button className="px-6 py-2 rounded-full border border-[#1C2834] text-[#1C2834] font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C1CF16]">All</button>
        <button className="px-6 py-2 rounded-full border border-gray-200 text-[#495D69] font-semibold bg-white hover:border-[#C1CF16]">Vectors</button>
        <button className="px-6 py-2 rounded-full border border-gray-200 text-[#495D69] font-semibold bg-white hover:border-[#C1CF16]">Icons</button>
        <button className="px-6 py-2 rounded-full border border-gray-200 text-[#495D69] font-semibold bg-white hover:border-[#C1CF16]">Backgrounds</button>
      </div>
    </section>
  );
} 