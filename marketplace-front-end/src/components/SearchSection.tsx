'use client'

import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

export default function SearchSection({ onSearch }: { onSearch: (query: string) => void }) {
  const [input, setInput] = useState('');

  return (
    <div className="w-[888px] h-[128px] bg-white rounded-2xl px-10 py-10 flex items-center gap-8">
      {/* Label */}
      <h2 className="text-[#1C2834] text-base font-bold capitalize">Search</h2>

      {/* Input + Button Group */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center gap-3">
          {/* Input */}
          <div className="flex flex-col w-full">
            {/* Hidden label */}
            <label className="sr-only">Search</label>
            <div className="flex items-center bg-black/5 rounded-lg px-4 py-3 w-full">
              <Search className="w-4 h-4 text-[#C1CF16]" />
              <input
                type="text"
                placeholder="Search store, product, category..."
                className="ml-4 bg-transparent outline-none text-sm text-[#0C0D0D] placeholder:text-[#0C0D0D]/60 w-full"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onSearch(input); }}
              />
            </div>
          </div>

          {/* Filter Button (optional, hidden in Figma) */}
          <button className="hidden w-12 h-12 border border-gray-300 rounded-lg items-center justify-center">
            <Filter className="w-4 h-4 text-[#1C2834]" />
          </button>

          {/* Search Button */}
          <button
            className="flex items-center gap-2 bg-[#C1CF16] text-[#1C2834] font-extrabold px-8 py-3 rounded-lg text-sm hover:bg-[#b1be12] transition"
            onClick={() => onSearch(input)}
          >
            Search
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
