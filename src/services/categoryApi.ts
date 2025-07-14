import api from "@/services/axiosInstance"
import type {Category} from "@/types/category"
import type {Page} from "@/types/paginated"
import type {StandardResponse} from "@/types/api-response"

export interface CategoryFilter {
    active?: boolean
    name?: string
}

export interface CategoryForm {
    name: string
    description: string
}

// 🔍 Get paginated and filtered categories
export async function getCategories(params: {
    page?: number
    size?: number
    sort?: string
} & CategoryFilter): Promise<Page<Category>> {
    const response = await api.get<StandardResponse<Page<Category>>>(`/categories`, {params});
    return response.data.data;
}

// 🔍 Get category by ID
export async function getCategoryById(id: number): Promise<Category> {
    const response = await api.get<StandardResponse<Category>>(`/categories/${id}`);
    return response.data.data;
}

// ➕ Create new category
export async function createCategory(data: CategoryForm): Promise<Category> {
    const response = await api.post<StandardResponse<Category>>(`/categories`, data);
    return response.data.data;
}

// ✏️ Update category
export async function updateCategory(id: number, data: CategoryForm): Promise<Category> {
    const response = await api.put<StandardResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
}

// 🗑️ Delete category
export async function deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
}

// 📷 Upload category image
export async function uploadCategoryImage(id: number, file: File): Promise<Category> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<StandardResponse<Category>>(`/categories/${id}/upload-image`, formData);
    return response.data.data;
}

// ❌ Delete image
export async function deleteCategoryImage(id: number): Promise<void> {
    await api.delete(`/categories/${id}/image`);
}

// ✅ Toggle active status
export async function toggleCategoryStatus(id: number, active: boolean): Promise<void> {
    await api.patch(`/categories/${id}/status`, null, {params: {active}});
}

// 📦 Get all active categories (no pagination)
export async function getAllActiveCategories(): Promise<Category[]> {
    const page = await getCategories({active: true, size: 999});
    return page.content;
}
