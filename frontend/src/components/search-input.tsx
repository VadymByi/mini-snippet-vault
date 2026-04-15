"use client";

import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    // SEARCH CONTAINER
    <div className="mb-10 group">
      {/* INPUT WRAPPER */}
      <div className="relative">
        {/* SEARCH ICON */}
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
          size={20}
        />

        {/* INPUT FIELD */}
        <input
          type="text"
          placeholder="Search by title, content or tags..."
          className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-medium transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {/* CLEAR BUTTON */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
