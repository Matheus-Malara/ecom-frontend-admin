export interface ProductImage {
    id: number
    imageUrl: string
    displayOrder: number
}

export interface Product {
    id: number
    name: string
    description: string
    categoryId: number
    categoryName: string
    brandId: number
    brandName: string
    price: number
    stock: number
    weightGrams: number
    flavor: string
    images: ProductImage[]
    active: boolean
}
