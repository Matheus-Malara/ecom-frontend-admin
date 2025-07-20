import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {
    getFilteredCategories,
    toggleCategoryStatus,
    deleteCategory
} from "@/services/categoryApi";

import type {Page} from "@/types/paginated";
import type {Category} from "@/types/category";
import type {CategoryFilter} from "@/types/category-filter";

import {useToastStore} from "@/stores/toastStore";

export default function CategoryListPage() {
    const [filter, setFilter] = useState<CategoryFilter>({});
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categoriesPage, setCategoriesPage] = useState<Page<Category>>();
    const {setToast} = useToastStore();

    useEffect(() => {
        fetchCategories();
    }, [page, filter]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getFilteredCategories(filter, page, 10);
            setCategoriesPage(data);
        } catch {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (category: Category) => {
        try {
            await toggleCategoryStatus(category.id, !category.active);
            setToast(`Category ${category.active ? "deactivated" : "activated"}`, "success");
            fetchCategories();
        } catch {
            setToast("Failed to update status", "error");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id);
            setToast("Category deleted", "success");
            fetchCategories();
        } catch {
            setToast("Failed to delete category", "error");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold">📂 Category List</h2>

            {/* Filters */}
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

            {/* New Category Button */}
            <div className="mb-4">
                <button
                    onClick={() => navigate("/categories/new")}
                    className="btn bg-green-600 hover:bg-green-700"
                >
                    ➕ New Category
                </button>
            </div>

            {/* Category Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border bg-white">
                    <thead className="bg-gray-100">
                    <tr className="text-left">
                        <th className="p-3">Image</th>
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
                        categoriesPage?.content.map((category) => (
                            <tr key={category.id} className="border-t align-middle">
                                <td className="p-3">
                                    {category.imageUrl ? (
                                        <img
                                            src={category.imageUrl}
                                            alt="Category"
                                            className="w-16 h-16 object-contain"
                                        />
                                    ) : (
                                        <span className="text-gray-400 italic">No image</span>
                                    )}
                                </td>
                                <td className="p-3 align-middle">{category.name}</td>
                                <td className="p-3 align-middle">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                            category.active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {category.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-3 align-middle">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(category)}
                                            className="text-sm px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                                        >
                                            {category.active ? "Deactivate" : "Activate"}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/categories/${category.id}/edit`)}
                                            className="text-sm px-3 py-1 rounded bg-blue-100 hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
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
            {categoriesPage && categoriesPage.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({length: categoriesPage.totalPages}).map((_, i) => (
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