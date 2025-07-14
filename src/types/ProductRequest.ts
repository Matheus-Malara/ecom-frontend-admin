export interface ProductRequest {
    name: string;
    description: string;
    categoryId: number;
    brandId: number;
    price: number;
    stock: number;
    weightGrams: number;
    flavor: string;
}