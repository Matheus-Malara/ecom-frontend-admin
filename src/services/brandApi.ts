import api from "@/services/axiosInstance"
import type {Brand} from "@/types/brand"
import type {StandardResponse} from "@/types/api-response"
import type {Page} from "@/types/paginated"
import type {BrandFilter} from "@/types/brand-filter.ts";

export interface BrandForm {
    name: string
    description?: string
    logoUrl?: string
}

// 🔍 Get paginated and filtered brands
export async function getFilteredBrands(
    filter: BrandFilter,
    page = 0,
    size = 10
): Promise<Page<Brand>> {
    const params = new URLSearchParams();

    if (filter.name) params.append("name", filter.name);
    if (filter.active !== undefined) params.append("active", String(filter.active));

    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await api.get<StandardResponse<Page<Brand>>>("/brands", {params});
    return response.data.data;
}

// 🔍 Get brand by ID
export async function getBrandById(id: number): Promise<Brand> {
    const response = await api.get<StandardResponse<Brand>>(`/brands/${id}`);
    return response.data.data;
}

// ➕ Create new brand
export async function createBrand(data: BrandForm): Promise<Brand> {
    const response = await api.post<StandardResponse<Brand>>(`/brands`, data);
    return response.data.data;
}

// ✏️ Update brand
export async function updateBrand(id: number, data: BrandForm): Promise<Brand> {
    const response = await api.put<StandardResponse<Brand>>(`/brands/${id}`, data);
    return response.data.data;
}

// 🗑️ Delete brand
export async function deleteBrand(id: number): Promise<void> {
    await api.delete(`/brands/${id}`);
}

// 📷 Upload brand image
export async function uploadBrandImage(id: number, file: File): Promise<Brand> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<StandardResponse<Brand>>(`/brands/${id}/upload-logo`, formData);
    return response.data.data;
}

// ❌ Delete brand image
export async function deleteBrandImage(id: number): Promise<void> {
    await api.delete(`/brands/${id}/image`);
}

// ✅ Toggle active status
export async function toggleBrandStatus(id: number, active: boolean): Promise<void> {
    await api.patch(`/brands/${id}/status`, null, {params: {active}});
}

// 📦 Get all active brands (no pagination)
export async function getAllActiveBrands(): Promise<Brand[]> {
    const page = await getFilteredBrands({active: true}, 0, 999);
    return page.content;
}