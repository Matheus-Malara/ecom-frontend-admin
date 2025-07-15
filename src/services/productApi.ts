import api from "@/services/axiosInstance";
import type {Product} from "@/types/product";
import type {ProductFilter} from "@/types/product-filter";
import type {StandardResponse} from "@/types/api-response";
import type {Page} from "@/types/paginated";
import type {ProductImage} from "@/types/product";

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

    const response = await api.get<StandardResponse<Page<Product>>>("/products", {params});
    return response.data.data;
}

// GET /api/products/:id
export async function getProductById(id: number): Promise<Product> {
    const response = await api.get<StandardResponse<Product>>(`/products/${id}`);
    return response.data.data;
}

// POST /api/products
export async function createProduct(data: Partial<Product>, image?: File): Promise<Product> {
    const formData = new FormData();

    formData.append("name", data.name ?? "");
    formData.append("description", data.description ?? "");
    formData.append("categoryId", String(data.categoryId));
    formData.append("brandId", String(data.brandId));
    formData.append("price", String(data.price ?? 0));
    formData.append("stock", String(data.stock ?? 0));
    formData.append("weightGrams", String(data.weightGrams ?? 0));
    formData.append("flavor", data.flavor ?? "");

    if (image) {
        formData.append("image", image);
    }

    const response = await api.post<StandardResponse<Product>>("/products", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });

    return response.data.data;
}

// PUT /api/products/:id
export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.put<StandardResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
}

// DELETE /api/products/:id
export async function deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
}

// PATCH /api/products/:id/status?active=true|false
export async function toggleProductStatus(id: number, active: boolean): Promise<void> {
    await api.patch(`/products/${id}/status`, null, {
        params: {active},
    });
}

// POST /api/products/:id/upload-image
export async function uploadProductImage(id: number, file: File): Promise<ProductImage> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<StandardResponse<ProductImage>>(
        `/products/${id}/upload-image`,
        formData,
        {
            headers: {"Content-Type": "multipart/form-data"},
        }
    );

    return response.data.data;
}

// DELETE /api/products/:productId/images/:imageId
export async function deleteProductImage(productId: number, imageId: number): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
}
