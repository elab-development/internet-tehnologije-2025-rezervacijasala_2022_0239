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
        uploadPreset="sale_preset" // ime preset-a sa cloudinary naloga
        onSuccess={(result: any) => {
          onUpload(result.info.secure_url); // vraća link do slike
        }}
      >
        {({ open }) => (
          <div style={{ display: 'grid', gap: 10 }}>
            {value && (
              <img 
                src={value} 
                alt="Preview" //Ako slika već postoji (npr. kod izmene), prikaži je kao preview
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