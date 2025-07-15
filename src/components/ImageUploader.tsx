import { useRef } from "react";
import type { ProductImage } from "@/types/product";

interface Props {
    title: string;
    images: ProductImage[];
    onUpload: (file: File) => void;
    onDelete: (imageId: number) => void;
}

export default function ImageUploader({ title, images, onUpload, onDelete }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <div>
            <label className="text-sm font-semibold mb-1 block">{title}</label>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-700
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />

            <div className="flex flex-wrap gap-4 mt-4">
                {images.map((img) => (
                    <div key={img.id} className="relative group">
                        <img
                            src={img.imageUrl}
                            alt="Product"
                            className="w-32 h-32 object-cover border rounded shadow"
                        />
                        <button
                            type="button"
                            onClick={() => onDelete(img.id)}
                            className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}