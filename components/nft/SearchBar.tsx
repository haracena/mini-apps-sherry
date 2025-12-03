"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search NFTs...",
  resultCount,
  totalCount,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/40" />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white/5 border border-purple-500/30 rounded-lg
                   text-white placeholder:text-white/40
                   focus:outline-none focus:ring-2 focus:ring-purple-500/50
                   transition-all duration-200"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Result count */}
      {resultCount !== undefined && totalCount !== undefined && localValue && (
        <p className="text-sm text-white/60 px-1">
          {resultCount === 0 ? (
            "No NFTs found"
          ) : resultCount === totalCount ? (
            `Showing all ${totalCount} NFT${totalCount !== 1 ? "s" : ""}`
          ) : (
            `Found ${resultCount} of ${totalCount} NFT${totalCount !== 1 ? "s" : ""}`
          )}
        </p>
      )}
    </div>
  );
}
