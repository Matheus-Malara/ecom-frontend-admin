import type {OrderStatus} from "./order-status";

export interface OrderFilter {
    status?: OrderStatus;
    userEmail?: string;
    startDate?: string;
    endDate?: string;
}