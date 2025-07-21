import api from "@/services/axiosInstance";
import type {StandardResponse} from "@/types/api-response";
import type {Page} from "@/types/paginated";
import type {Category} from "@/types/category";
import type {CategoryFilter} from "@/types/category-filter";

export interface CategoryForm {
    name: string;
    description?: string;
    imageUrl?: string;
}

// 🔍 Get paginated and filtered categories
export async function getFilteredCategories(
    filter: CategoryFilter,
    page = 0,
    size = 10
): Promise<Page<Category>> {
    const params = new URLSearchParams();

    if (filter.name) params.append("name", filter.name);
    if (filter.active !== undefined) params.append("active", String(filter.active));

    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await api.get<StandardResponse<Page<Category>>>("/categories", {params});
    return response.data.data;
}

// 🔍 Get category by ID
export async function getCategoryById(id: number): Promise<Category> {
    const response = await api.get<StandardResponse<Category>>(`/categories/${id}`);
    return response.data.data;
}

// ➕ Create category with optional image
export async function createCategory(data: { name: string; description?: string }, image?: File): Promise<Category> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");

    if (image) {
        formData.append("image", image);
    }

    const response = await api.post<StandardResponse<Category>>("/categories", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });

    return response.data.data;
}

// ✏️ Update category (no image update here, only fields)
export async function updateCategory(id: number, data: CategoryForm): Promise<Category> {
    const response = await api.put<StandardResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
}

// 🗑️ Delete category
export async function deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
}

// 📷 Upload or replace category image
export async function uploadCategoryImage(id: number, file: File): Promise<Category> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<StandardResponse<Category>>(
        `/categories/${id}/upload-image`,
        formData,
        {
            headers: {"Content-Type": "multipart/form-data"},
        }
    );

    return response.data.data;
}

// ❌ Delete category image
export async function deleteCategoryImage(id: number): Promise<void> {
    await api.delete(`/categories/${id}/image`);
}

// ✅ Toggle active status
export async function toggleCategoryStatus(id: number, active: boolean): Promise<void> {
    await api.patch(`/categories/${id}/status`, null, {
        params: {active},
    });
}

// 📦 Get all active categories (used for selects)
export async function getAllActiveCategories(): Promise<Category[]> {
    const page = await getFilteredCategories({active: true}, 0, 999);
    return page.content;
}
