"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
}

export function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Only JPEG, PNG, GIF, and WebP are allowed"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File too large", {
        description: `Maximum file size is 10MB (received ${(file.size / 1024 / 1024).toFixed(2)}MB)`
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    onImageSelect(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-purple-500/20">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative w-full aspect-square rounded-lg border-2 border-dashed
            flex flex-col items-center justify-center gap-4
            cursor-pointer transition-all duration-200
            ${
              isDragging
                ? "border-purple-500 bg-purple-500/10"
                : "border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5"
            }
          `}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-12 h-12 text-purple-500/50" />
          <div className="text-center px-4">
            <p className="text-sm font-medium text-white/80">
              Drop your image here or click to browse
            </p>
            <p className="text-xs text-white/50 mt-1">
              JPEG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
