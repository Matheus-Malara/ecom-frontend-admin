import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {getFilteredProducts, toggleProductStatus, deleteProduct} from "@/services/productApi";
import {getAllActiveBrands} from "@/services/brandApi";
import {getAllActiveCategories} from "@/services/categoryApi";

import {useToastStore} from "@/stores/toastStore";

import type {Product} from "@/types/product";
import type {Brand} from "@/types/brand";
import type {Category} from "@/types/category";
import type {ProductFilter} from "@/types/product-filter";
import type {Page} from "@/types/paginated";

export default function ProductListPage() {
    const [filter, setFilter] = useState<ProductFilter>({});
    const [page, setPage] = useState(0);
    const [productsPage, setProductsPage] = useState<Page<Product>>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setToast} = useToastStore();


    useEffect(() => {
        fetchProducts();
    }, [page, filter]);

    useEffect(() => {
        getAllActiveBrands().then(setBrands).catch(() => toast.error("Failed to load brands"));
        getAllActiveCategories().then(setCategories).catch(() => toast.error("Failed to load categories"));
    }, []);

    const handleToggleStatus = async (product: Product) => {
        try {
            await toggleProductStatus(product.id, !product.active);
            setToast(`Product ${product.active ? "deactivated" : "activated"}`, "success");
            fetchProducts();
        } catch {
            setToast("Failed to update status", "error");
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getFilteredProducts(filter, page, 10);
            setProductsPage(data);
        } catch {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            setToast("Product deleted", "success");
            fetchProducts();
        } catch {
            setToast("Failed to delete product", "error");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">📦 Product List</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={filter.name || ""}
                    onChange={(e) => setFilter((prev) => ({...prev, name: e.target.value}))}
                    className="input"
                />
                <input
                    type="text"
                    placeholder="Flavor"
                    value={filter.flavor || ""}
                    onChange={(e) => setFilter((prev) => ({...prev, flavor: e.target.value}))}
                    className="input"
                />
                <select
                    value={filter.categoryId || ""}
                    onChange={(e) =>
                        setFilter((prev) => ({
                            ...prev,
                            categoryId: e.target.value ? Number(e.target.value) : undefined,
                        }))
                    }
                    className="input"
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    value={filter.brandId || ""}
                    onChange={(e) =>
                        setFilter((prev) => ({
                            ...prev,
                            brandId: e.target.value ? Number(e.target.value) : undefined,
                        }))
                    }
                    className="input"
                >
                    <option value="">All Brands</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <select
                    value={filter.active === undefined ? "" : filter.active ? "true" : "false"}
                    onChange={(e) =>
                        setFilter((prev) => ({
                            ...prev,
                            active: e.target.value === "" ? undefined : e.target.value === "true",
                        }))
                    }
                    className="input"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={filter.minPrice ?? ""}
                        onChange={(e) =>
                            setFilter((prev) => ({
                                ...prev,
                                minPrice: e.target.value ? Number(e.target.value) : undefined,
                            }))
                        }
                        className="input"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filter.maxPrice ?? ""}
                        onChange={(e) =>
                            setFilter((prev) => ({
                                ...prev,
                                maxPrice: e.target.value ? Number(e.target.value) : undefined,
                            }))
                        }
                        className="input"
                    />
                </div>
            </div>

            {/* New Product Button */}
            <div className="mb-4">
                <button
                    onClick={() => navigate("/products/new")}
                    className="btn bg-green-600 hover:bg-green-700"
                >
                    ➕ New Product
                </button>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border bg-white">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Brand</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Flavor</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="p-4 text-center">Loading...</td>
                        </tr>
                    ) : (
                        productsPage?.content.map((product) => (
                            <tr key={product.id} className="border-t">
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.brandName}</td>
                                <td className="p-3">{product.categoryName}</td>
                                <td className="p-3">{product.flavor}</td>
                                <td className="p-3">${product.price.toFixed(2)}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                            product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                      {product.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(product)}
                                        className="text-sm px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                                    >
                                        {product.active ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/products/${product.id}/edit`)}
                                        className="text-sm px-3 py-1 rounded bg-blue-100 hover:bg-blue-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-sm px-3 py-1 rounded bg-red-100 hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {productsPage && productsPage.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({length: productsPage.totalPages}).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`px-3 py-1 rounded ${
                                i === page ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
