export interface Category {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    active: boolean;
}

export interface CategoryForm {
    name: string;
    description?: string;
    imageUrl?: string;
}
