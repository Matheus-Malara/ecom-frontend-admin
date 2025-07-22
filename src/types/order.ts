import type {OrderStatus} from "./order-status";
import type {OrderItem} from "./order-item";

export interface Order {
    id: number;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    items: OrderItem[];
}
