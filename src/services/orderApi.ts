import api from "@/services/axiosInstance";
import type {Order} from "@/types/order";
import type {OrderStatus} from "@/types/order-status";
import type {Page} from "@/types/paginated";
import type {OrderFilter} from "@/types/order-filter";

export async function getFilteredOrders(
    filter: OrderFilter,
    page: number = 0,
    size: number = 10
): Promise<Page<Order>> {
    const params: Record<string, string | number | boolean | undefined> = {
        page,
        size,
    };

    if (filter.status) params.status = filter.status;
    if (filter.userEmail) params.userEmail = filter.userEmail;
    if (filter.startDate) params.startDate = filter.startDate;
    if (filter.endDate) params.endDate = filter.endDate;

    const response = await api.get("/admin/orders", {params});
    return response.data.data;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await api.put(`/admin/orders/${id}/status`, {status});
    return response.data.data;
}

export async function getOrderById(id: number): Promise<Order> {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data.data;
}
