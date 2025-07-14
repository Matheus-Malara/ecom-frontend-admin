export interface Brand {
    id: number
    name: string
    description: string
    logoUrl: string
    active: boolean
}

export interface BrandForm {
    name: string
    description?: string
    logoUrl?: string
}
