"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { NFTFormData } from "@/types";

interface NFTPreviewProps {
  formData: NFTFormData;
}

export function NFTPreview({ formData }: NFTPreviewProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(formData.image);
    } else {
      setImagePreview(null);
    }
  }, [formData.image]);

  const hasContent = formData.name || formData.description || imagePreview;

  if (!hasContent) {
    return (
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-purple-400/50" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Live Preview</p>
            <p className="text-white/40 text-xs mt-1">
              Fill in the form to see your NFT preview
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl overflow-hidden">
      {/* Preview Badge */}
      <div className="bg-purple-500/10 border-b border-purple-500/20 px-4 py-2">
        <p className="text-xs font-medium text-purple-300 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          Live Preview
        </p>
      </div>

      {/* NFT Card Preview */}
      <div className="p-4">
        {/* Image Preview */}
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="NFT Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/20" />
            </div>
          )}
        </div>

        {/* Metadata Preview */}
        <div className="space-y-3">
          <div>
            <h3 className="text-white font-semibold text-lg truncate">
              {formData.name || (
                <span className="text-white/40 italic">NFT Name</span>
              )}
            </h3>
            <p className="text-white/60 text-sm line-clamp-3 leading-relaxed min-h-[3.6rem]">
              {formData.description || (
                <span className="text-white/30 italic">
                  Your NFT description will appear here...
                </span>
              )}
            </p>
          </div>

          {/* Attributes Preview */}
          {formData.attributes && formData.attributes.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              {formData.attributes.filter(attr => attr.trait_type && attr.value).map((attr, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs"
                >
                  <span className="text-white/50">{attr.trait_type}: </span>
                  <span className="font-medium text-purple-300">{attr.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Preview */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span className="text-xs text-white/40">Preview</span>
          </div>
          <span className="text-xs text-purple-400 font-mono">#???</span>
        </div>
      </div>
    </div>
  );
}
