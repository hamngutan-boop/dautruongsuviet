import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export const SearchEngine = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#151619] border border-white/10 rounded-full pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6321]"
            placeholder="Tìm theo User_ID, loại vi phạm, hoặc gõ câu lệnh AI..."
          />
        </div>
        <button className="flex items-center gap-2 bg-white/5 text-white px-4 py-3 rounded-full text-sm font-bold">
          <Filter size={16} /> Bộ lọc <ChevronDown size={16} />
        </button>
      </div>
      
      <div className="bg-[#151619] border border-white/5 p-8 rounded-3xl text-center text-gray-500">
        Nhập truy vấn để bắt đầu tìm kiếm trong kho dữ liệu...
      </div>
    </div>
  );
};
