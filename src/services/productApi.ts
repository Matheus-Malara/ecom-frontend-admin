import axios from "@/services/axiosInstance";
import type {Product} from "@/types/product";
import type {ProductFilter} from "@/types/product-filter";
import type {StandardResponse} from "@/types/api-response";
import type {Page} from "@/types/paginated";

// GET /api/products
export async function getFilteredProducts(
    filter: ProductFilter,
    page = 0,
    size = 10
): Promise<Page<Product>> {
    const params = new URLSearchParams();

    if (filter.name) params.append("name", filter.name);
    if (filter.categoryId) params.append("categoryId", filter.categoryId.toString());
    if (filter.brandId) params.append("brandId", filter.brandId.toString());
    if (filter.flavor) params.append("flavor", filter.flavor);
    if (filter.active !== undefined) params.append("active", String(filter.active));
    if (filter.minPrice !== undefined) params.append("minPrice", String(filter.minPrice));
    if (filter.maxPrice !== undefined) params.append("maxPrice", String(filter.maxPrice));

    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await axios.get<StandardResponse<Page<Product>>>("/products", {
        params,
    });

    return response.data.data;
}

// GET /api/products/:id
export async function getProductById(id: number): Promise<Product> {
    const response = await axios.get<StandardResponse<Product>>(`/products/${id}`);
    return response.data.data;
}

// POST /api/products
export async function createProduct(data: Partial<Product>): Promise<Product> {
    const response = await axios.post<StandardResponse<Product>>("/products", data);
    return response.data.data;
}

// PUT /api/products/:id
export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await axios.put<StandardResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
}

// DELETE /api/products/:id
export async function deleteProduct(id: number): Promise<void> {
    await axios.delete(`/products/${id}`);
}

// PATCH /api/products/:id/status?active=true|false
export async function toggleProductStatus(id: number, active: boolean): Promise<void> {
    await axios.patch(`/products/${id}/status`, null, {
        params: {active},
    });
}

// POST /api/products/:id/upload-image
export async function uploadProductImage(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`/products/${id}/upload-image`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// DELETE /api/products/:productId/images/:imageId
export async function deleteProductImage(productId: number, imageId: number): Promise<void> {
    await axios.delete(`/products/${productId}/images/${imageId}`);
}
