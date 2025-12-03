"use client";

import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

interface FilterControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedAttributes?: string[];
  onAttributeChange?: (attributes: string[]) => void;
  availableAttributes?: string[];
}

export function FilterControls({
  sortBy,
  onSortChange,
  selectedAttributes = [],
  onAttributeChange,
  availableAttributes = [],
}: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ];

  const toggleAttribute = (attribute: string) => {
    if (!onAttributeChange) return;

    const newAttributes = selectedAttributes.includes(attribute)
      ? selectedAttributes.filter((a) => a !== attribute)
      : [...selectedAttributes, attribute];

    onAttributeChange(newAttributes);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Sort Dropdown */}
        <div className="flex-1 sm:max-w-xs">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-white/40" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-purple-500/30 rounded-lg
                       text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500/50
                       transition-all duration-200
                       appearance-none cursor-pointer
                       [&>option]:bg-gray-900 [&>option]:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Button (only show if there are attributes) */}
        {availableAttributes.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                     transition-all duration-200
                     ${
                       showFilters || selectedAttributes.length > 0
                         ? "bg-purple-600 text-white"
                         : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                     }
                     border ${
                       showFilters || selectedAttributes.length > 0
                         ? "border-purple-500"
                         : "border-purple-500/30"
                     }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {selectedAttributes.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {selectedAttributes.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Attribute Filters (expandable) */}
      {showFilters && availableAttributes.length > 0 && (
        <div className="bg-white/5 border border-purple-500/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Filter by Attributes</h4>
            {selectedAttributes.length > 0 && (
              <button
                onClick={() => onAttributeChange?.([])}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {availableAttributes.map((attribute) => {
              const isSelected = selectedAttributes.includes(attribute);
              return (
                <button
                  key={attribute}
                  onClick={() => toggleAttribute(attribute)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                           ${
                             isSelected
                               ? "bg-purple-600 text-white border-purple-500"
                               : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-purple-500/30"
                           }
                           border`}
                >
                  {attribute}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
