"use client";

import { Plus, X } from "lucide-react";
import type { NFTAttribute } from "@/types";

interface AttributeBuilderProps {
  attributes: NFTAttribute[];
  onChange: (attributes: NFTAttribute[]) => void;
  disabled?: boolean;
}

const COMMON_TRAITS = [
  "Rarity",
  "Color",
  "Background",
  "Eyes",
  "Mouth",
  "Accessory",
  "Power",
  "Level",
  "Type",
  "Element",
];

export function AttributeBuilder({
  attributes,
  onChange,
  disabled = false,
}: AttributeBuilderProps) {
  const addAttribute = () => {
    onChange([...attributes, { trait_type: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (
    index: number,
    field: keyof NFTAttribute,
    value: string
  ) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    onChange(newAttributes);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white">
          Attributes (Optional)
        </label>
        <button
          type="button"
          onClick={addAttribute}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700
                   disabled:bg-gray-600 disabled:cursor-not-allowed
                   text-white text-sm font-medium rounded-lg
                   transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Trait
        </button>
      </div>

      {attributes.length === 0 ? (
        <div className="text-center py-8 px-4 bg-white/5 border border-purple-500/20 rounded-lg">
          <p className="text-sm text-white/60">
            No attributes added yet. Click &quot;Add Trait&quot; to start.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {attributes.map((attr, index) => (
            <div
              key={index}
              className="flex gap-2 items-start p-3 bg-white/5 border border-purple-500/20 rounded-lg"
            >
              <div className="flex-1 grid grid-cols-2 gap-2">
                {/* Trait Type */}
                <div className="space-y-1">
                  <label
                    htmlFor={`trait-type-${index}`}
                    className="block text-xs text-white/60"
                  >
                    Trait Type
                  </label>
                  <input
                    id={`trait-type-${index}`}
                    type="text"
                    value={attr.trait_type}
                    onChange={(e) =>
                      updateAttribute(index, "trait_type", e.target.value)
                    }
                    placeholder="e.g., Rarity"
                    list={`trait-suggestions-${index}`}
                    disabled={disabled}
                    className="w-full px-3 py-2 bg-white/5 border border-purple-500/30 rounded-lg
                             text-white text-sm placeholder:text-white/40
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200"
                  />
                  <datalist id={`trait-suggestions-${index}`}>
                    {COMMON_TRAITS.map((trait) => (
                      <option key={trait} value={trait} />
                    ))}
                  </datalist>
                </div>

                {/* Value */}
                <div className="space-y-1">
                  <label
                    htmlFor={`trait-value-${index}`}
                    className="block text-xs text-white/60"
                  >
                    Value
                  </label>
                  <input
                    id={`trait-value-${index}`}
                    type="text"
                    value={attr.value}
                    onChange={(e) =>
                      updateAttribute(index, "value", e.target.value)
                    }
                    placeholder="e.g., Legendary"
                    disabled={disabled}
                    className="w-full px-3 py-2 bg-white/5 border border-purple-500/30 rounded-lg
                             text-white text-sm placeholder:text-white/40
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200"
                  />
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                disabled={disabled}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10
                         disabled:opacity-50 disabled:cursor-not-allowed
                         rounded-lg transition-all duration-200"
                aria-label="Remove attribute"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {attributes.length > 0 && (
        <p className="text-xs text-white/50 px-1">
          {attributes.length} attribute{attributes.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
}
