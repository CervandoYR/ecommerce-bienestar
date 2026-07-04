"use client";

import { useState } from "react";
import { Button } from "./button";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  multiple?: boolean;
  defaultImage?: any;
}

export function CloudinaryUploader({ onUploadSuccess, folder = "bienestar-store", multiple = false, defaultImage }: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      // 1. Obtener firma
      const res = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al obtener firma");

      // 2. Subir a Cloudinary (Client-Side Upload)
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", data.apiKey);
        formData.append("timestamp", data.timestamp.toString());
        formData.append("signature", data.signature);
        formData.append("folder", data.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Error al subir");
        
        return uploadData.secure_url;
      });

      const urls = await Promise.all(uploadPromises);
      
      urls.forEach(url => onUploadSuccess(url));

    } catch (err: any) {
      setError(err.message || "Ocurrió un error al subir la imagen");
    } finally {
      setIsUploading(false);
      // Limpiar input
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-warm-300 rounded-xl hover:border-sage-500 hover:bg-sage-50 text-warm-600 transition-colors">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImagePlus className="w-5 h-5" />
            )}
            <span className="font-medium text-sm">
              {isUploading ? "Subiendo..." : "Subir imágenes"}
            </span>
          </div>
        </label>
      </div>
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
    </div>
  );
}
