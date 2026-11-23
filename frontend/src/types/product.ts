export interface Product {
    id: number
    name: string
    price: number
    createdAt?: string
    updatedAt?: string
}

export type ProductValues = Omit<Product, "id" | "createdAt" | "updatedAt">
