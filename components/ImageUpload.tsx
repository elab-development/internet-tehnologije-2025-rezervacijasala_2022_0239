"use client";

import { CldUploadWidget } from "next-cloudinary";
import Button from "./Button";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
}

export default function ImageUpload({ onUpload, value }: ImageUploadProps) {
  return (
    <div>
      <CldUploadWidget
        uploadPreset="sale_preset" // OVDE STAVI IME PRESETA KOJI SI NAPRAVILA
        onSuccess={(result: any) => {
          onUpload(result.info.secure_url); // Ovo nam vraća link do slike
        }}
      >
        {({ open }) => (
          <div style={{ display: 'grid', gap: 10 }}>
            {value && (
              <img 
                src={value} 
                alt="Preview" 
                style={{ width: 200, height: 150, objectFit: 'cover', borderRadius: 8 }} 
              />
            )}
            <Button onClick={() => open()}>
              {value ? "Promeni sliku" : "Dodaj sliku"}
            </Button>
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}