import {getFilteredBrands, toggleBrandStatus, deleteBrand} from "@/services/brandApi.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import type {Page} from "@/types/paginated.ts";
import type {Brand} from "@/types/brand.ts";

import {useToastStore} from "@/stores/toastStore";
import {toast} from "react-toastify";

import type {BrandFilter} from "@/types/brand-filter.ts";

export default function BrandListPage() {
    const [filter, setFilter] = useState<BrandFilter>({});
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [brandsPage, setBrandsPage] = useState<Page<Brand>>();
    const {setToast} = useToastStore();

    useEffect(() => {
        fetchBrands();
    }, [page, filter])

    const handleToggleStatus = async (brand: Brand) => {
        try {
            await toggleBrandStatus(brand.id, !brand.active);
            setToast(`Brand ${brand.active ? "deactivated" : "activated"}`, "success");
            fetchBrands();
        } catch {
            setToast("Failed to update status", "error");
        }
    };

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const data = await getFilteredBrands(filter, page, 10);
            setBrandsPage(data);
        } catch {
            toast.error("Failed to load brands");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this brand?")) return;
        try {
            await deleteBrand(id);
            setToast("Brand deleted", "success");
            fetchBrands();
        } catch {
            setToast("Failed to delete brand", "error");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">🏷️ Brand List</h2>

            {/*Filters*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={filter.name || ""}
                    onChange={(e) => setFilter((prev) => ({...prev, name: e.target.value}))}
                    className="input"
                />
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
            </div>

            {/* New Brand Button */}
            <div className="mb-4">
                <button
                    onClick={() => navigate("/brands/new")}
                    className="btn bg-green-600 hover:bg-green-700"
                >
                    ➕ New Brand
                </button>
            </div>

            {/* Brand Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border bg-white">
                    <thead className="bg-gray-100">
                    <tr className="text-left">
                        <th className="p-3">Logo</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="p-3 text-center">Loading...</td>
                        </tr>
                    ) : (
                        brandsPage?.content.map((brand) => (
                            <tr key={brand.id} className="border-t align-middle">
                                <td className="p-3">
                                    <img
                                        src={brand.logoUrl}
                                        alt="Brand"
                                        className="w-16 h-16 object-contain"
                                    />
                                </td>
                                <td className="p-3 align-middle">{brand.name}</td>
                                <td className="p-3 align-middle">
                        <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                                brand.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {brand.active ? "Active" : "Inactive"}
                        </span>
                                </td>
                                <td className="p-3 align-middle">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(brand)}
                                            className="text-sm px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                                        >
                                            {brand.active ? "Deactivate" : "Activate"}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/brands/${brand.id}/edit`)}
                                            className="text-sm px-3 py-1 rounded bg-blue-100 hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand.id)}
                                            className="text-sm px-3 py-1 rounded bg-red-100 hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>


            {/* Pagination */}
            {brandsPage && brandsPage.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({length: brandsPage.totalPages}).map((_, i) => (
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
