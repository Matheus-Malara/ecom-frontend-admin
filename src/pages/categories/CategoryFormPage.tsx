import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

import {createCategory, getCategoryById, updateCategory} from "@/services/categoryApi";
import type {Category} from "@/types/category";
import {useToastStore} from "@/stores/toastStore";

export default function CategoryFormPage() {
    const {id} = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const {setToast} = useToastStore();

    const [form, setForm] = useState<Partial<Category>>({
        name: "",
        description: "",
        imageUrl: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isEdit && id) {
            getCategoryById(Number(id))
                .then(setForm)
                .catch(() => toast.error("Failed to load category"));
        }
    }, [id, isEdit]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name?.trim()) {
            toast.error("Name is required.");
            return;
        }

        try {
            if (isEdit && id) {
                await updateCategory(Number(id), {
                    name: form.name!,
                    description: form.description,
                    imageUrl: form.imageUrl,
                });
                setToast("Category updated successfully", "success");
            } else {
                await createCategory(
                    {name: form.name!, description: form.description ?? ""},
                    imageFile ?? undefined
                );
                setToast("Category created successfully", "success");
            }

            navigate("/categories");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save category");
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-8 text-center">
                {isEdit ? "Edit Category" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
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

                <div className="flex flex-col">
                    <label className="text-sm font-semibold mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="input"
                    />
                </div>

                {!isEdit && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Category Image</label>
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
                                <span className="text-sm text-gray-600">
                                    {imageFile.name}
                                </span>
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="mt-2 h-40 object-contain border rounded"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                        className="btn btn-primary w-48"
                    >
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
