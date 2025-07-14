import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {createProduct, getProductById, updateProduct} from "@/services/productApi";
import {getAllActiveBrands} from "@/services/brandApi";
import {getAllActiveCategories} from "@/services/categoryApi";
import type {ProductRequest} from "@/types/ProductRequest";
import type {Brand} from "@/types/brand";
import type {Category} from "@/types/category";
import {toast} from "react-toastify";

export default function ProductFormPage() {
    const {id} = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState<ProductRequest>({
        name: "",
        description: "",
        categoryId: 0,
        brandId: 0,
        price: 0,
        stock: 0,
        weightGrams: 0,
        flavor: "",
    });

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
                    })
                )
                .catch(() => toast.error("Failed to load product"));
        }
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const {name, value} = e.target;
        setForm({...form, [name]: name === "categoryId" || name === "brandId" ? Number(value) : value});
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const fn = isEdit ? updateProduct : createProduct;
        fn(Number(id), form)
            .then(() => {
                toast.success(`Product ${isEdit ? "updated" : "created"} successfully`);
                navigate("/products");
            })
            .catch(() => toast.error("Failed to save product"));
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
                        placeholder="Product name"
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
                        placeholder="Product description"
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
                        placeholder="Ex: 99.90"
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
                        placeholder="Units in stock"
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
                        placeholder="Ex: 1000"
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
                        placeholder="Ex: Chocolate"
                        required
                    />
                </div>

                <div className="md:col-span-2 flex justify-center mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary w-48"
                    >
                        {isEdit ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );

}
