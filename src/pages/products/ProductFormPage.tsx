import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useToastStore} from "@/stores/toastStore";


import {
    createProduct,
    deleteProductImage,
    getProductById,
    updateProduct,
    uploadProductImage,
} from "@/services/productApi";
import {getAllActiveBrands} from "@/services/brandApi";
import {getAllActiveCategories} from "@/services/categoryApi";
import type {ProductRequest} from "@/types/ProductRequest";
import type {ProductImage} from "@/types/product";
import type {Brand} from "@/types/brand";
import type {Category} from "@/types/category";
import ImageUploader from "@/components/ImageUploader";

export default function ProductFormPage() {
    const {id} = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const {setToast} = useToastStore();

    const [form, setForm] = useState<ProductRequest & { images?: ProductImage[] }>({
        name: "",
        description: "",
        categoryId: 0,
        brandId: 0,
        price: 0,
        stock: 0,
        weightGrams: 0,
        flavor: "",
        images: [],
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        getAllActiveCategories().then(setCategories);
        getAllActiveBrands().then(setBrands);
    }, []);

    useEffect(() => {
        if (isEdit) {
            getProductById(Number(id))
                .then((p) =>
                    setForm({
                        name: p.name,
                        description: p.description,
                        categoryId: p.categoryId!,
                        brandId: p.brandId!,
                        price: p.price,
                        stock: p.stock,
                        weightGrams: p.weightGrams,
                        flavor: p.flavor,
                        images: p.images || [],
                    })
                )
                .catch(() => toast.error("Failed to load product"));
        }
    }, [id]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]: name === "categoryId" || name === "brandId" ? Number(value) : value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (
            !form.name.trim() ||
            form.categoryId <= 0 ||
            form.brandId <= 0 ||
            form.price <= 0 ||
            form.stock < 0 ||
            form.weightGrams <= 0
        ) {
            toast.error("Please fill out all fields correctly.");
            return;
        }

        try {
            if (isEdit) {
                await updateProduct(Number(id), form);
                setToast("Product updated successfully", "success");
            } else {
                await createProduct(form, imageFile ?? undefined);
                setToast("Product created successfully", "success");
            }
            navigate("/products");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save product");
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-8 text-center">
                {isEdit ? "Edit Product" : "Create Product"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-semibold mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Category</label>
                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="input"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Brand</label>
                    <select
                        name="brandId"
                        value={form.brandId}
                        onChange={handleChange}
                        className="input"
                        required
                    >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Weight (grams)</label>
                    <input
                        type="number"
                        name="weightGrams"
                        value={form.weightGrams}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Flavor</label>
                    <input
                        name="flavor"
                        value={form.flavor}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                {!isEdit && (
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-semibold mb-1">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                            className="block w-full text-sm text-gray-700
                                file:mr-4 file:py-2 file:px-4
                                file:rounded file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />

                        {imageFile && (
                            <div className="mt-3">
                                <span className="text-sm text-gray-600">{imageFile.name}</span>
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="mt-2 h-40 object-contain border rounded"
                                />
                            </div>
                        )}
                    </div>
                )}

                {isEdit && id && (
                    <div className="md:col-span-2">
                        <ImageUploader
                            title="Product Images"
                            images={form.images || []}
                            onUpload={(file) =>
                                uploadProductImage(Number(id), file).then((img) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        images: [...(prev.images || []), img],
                                    }))
                                )
                            }
                            onDelete={(imageId) =>
                                deleteProductImage(Number(id), imageId).then(() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        images: (prev.images || []).filter((img) => img.id !== imageId),
                                    }))
                                )
                            }
                        />
                    </div>
                )}

                <div className="md:col-span-2 flex justify-center mt-4 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="btn btn-primary w-48">
                        Back
                    </button>
                    <button type="submit" className="btn btn-primary w-48">
                        {isEdit ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
