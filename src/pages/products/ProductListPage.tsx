import {useEffect, useState} from "react";
import {getFilteredProducts, toggleProductStatus, deleteProduct} from "@/services/productApi";
import type {Product} from "@/types/product";
import type {ProductFilter} from "@/types/product-filter";
import type {Page} from "@/types/paginated";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function ProductListPage() {
    const [filter, setFilter] = useState<ProductFilter>({});
    const [page, setPage] = useState(0);
    const [productsPage, setProductsPage] = useState<Page<Product>>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [page, filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getFilteredProducts(filter, page, 10);
            setProductsPage(data);
        } catch (err) {
            toast.error("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (product: Product) => {
        try {
            await toggleProductStatus(product.id, !product.active);
            toast.success(`Product ${product.active ? "deactivated" : "activated"}`);
            fetchProducts();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            toast.success("Product deleted");
            fetchProducts();
        } catch {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">📦 Product List</h2>

            {/* Filtros */}
            <div className="flex items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={filter.name || ""}
                    onChange={(e) => setFilter((prev) => ({...prev, name: e.target.value}))}
                    className="border px-3 py-2 rounded w-64"
                />
                <select
                    value={filter.active === undefined ? "" : filter.active ? "true" : "false"}
                    onChange={(e) =>
                        setFilter((prev) => ({
                            ...prev,
                            active: e.target.value === "" ? undefined : e.target.value === "true",
                        }))
                    }
                    className="border px-3 py-2 rounded"
                >
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
                <div className="mb-4">
                    <button
                        onClick={() => navigate("/products/new")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        ➕ New Product
                    </button>
                </div>

            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border bg-white">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Brand</th>
                        <th className="text-left p-3">Category</th>
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
                    ) : productsPage?.content.map((product) => (
                        <tr key={product.id} className="border-t">
                            <td className="p-3">{product.name}</td>
                            <td className="p-3">{product.brandName}</td>
                            <td className="p-3">{product.categoryName}</td>
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
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
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
