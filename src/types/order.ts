export interface OrderItem {
    productName: string;
    quantity: number;
    pricePerUnit: number;
    imageUrl: string;
}

export interface Order {
    id: number;
    totalAmount: number;
    status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    createdAt: string;
    items: OrderItem[];
}
