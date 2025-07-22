import {useEffect, useState} from "react";
import {getFilteredOrders, getOrderById, updateOrderStatus} from "@/services/orderApi";
import type {Order} from "@/types/order";
import type {OrderFilter} from "@/types/order-filter";
import type {Page} from "@/types/paginated";
import type {OrderStatus} from "@/types/order-status";
import {toast} from "react-toastify";
import {useToastStore} from "@/stores/toastStore";

const statusOptions: OrderStatus[] = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

function getNextStatus(current: OrderStatus): OrderStatus | null {
    const transitions: Record<OrderStatus, OrderStatus | null> = {
        PENDING: "PAID",
        PAID: "PROCESSING",
        PROCESSING: "SHIPPED",
        SHIPPED: "DELIVERED",
        DELIVERED: null,
        CANCELLED: null,
    };
    return transitions[current] || null;
}

function getFallbackImageUrl(): string {
    return "/images/no-image.jpg";
}

function getStatusIcon(status: OrderStatus): string {
    const icons: Record<OrderStatus, string> = {
        PENDING: "🕒",
        PAID: "💰",
        PROCESSING: "⚙️",
        SHIPPED: "🚚",
        DELIVERED: "📦",
        CANCELLED: "❌",
    };
    return icons[status] || "";
}

function getStatusClass(status: OrderStatus): string {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";
        case "PAID":
            return "bg-green-100 text-green-800";
        case "PROCESSING":
            return "bg-blue-100 text-blue-800";
        case "SHIPPED":
            return "bg-indigo-100 text-indigo-800";
        case "DELIVERED":
            return "bg-purple-100 text-purple-800";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function OrderListPage() {
    const [filter, setFilter] = useState<OrderFilter>({});
    const [page, setPage] = useState(0);
    const [ordersPage, setOrdersPage] = useState<Page<Order>>();
    const [loading, setLoading] = useState(false);
    const {setToast} = useToastStore();
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderDetails, setOrderDetails] = useState<Order | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const openOrderDetails = async (id: number) => {
        setSelectedOrderId(id);
        setDetailsLoading(true);
        try {
            const data = await getOrderById(id);
            setOrderDetails(data);
        } catch {
            toast.error("Failed to fetch order details");
            setSelectedOrderId(null);
        } finally {
            setDetailsLoading(false);
        }
    };


    useEffect(() => {
        fetchOrders();
    }, [page, filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getFilteredOrders(filter, page, 10);
            setOrdersPage(data);
        } catch {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (order: Order, newStatus: OrderStatus) => {
        try {
            await updateOrderStatus(order.id, newStatus);
            setToast("Order status updated", "success");
            fetchOrders();
        } catch {
            setToast("Failed to update status", "error");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">🧾 Order List</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="text-sm text-gray-700 block mb-1">Customer Email</label>
                    <input
                        type="text"
                        placeholder="Customer email"
                        value={filter.userEmail || ""}
                        onChange={(e) =>
                            setFilter((prev) => ({...prev, userEmail: e.target.value}))
                        }
                        className="input w-full"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-700 block mb-1">Status</label>
                    <select
                        value={filter.status || ""}
                        onChange={(e) =>
                            setFilter((prev) => ({
                                ...prev,
                                status: e.target.value ? (e.target.value as OrderStatus) : undefined,
                            }))
                        }
                        className="input w-full"
                    >
                        <option value="">All Statuses</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm text-gray-700 block mb-1">Start Date</label>
                    <input
                        type="date"
                        value={filter.startDate || ""}
                        onChange={(e) =>
                            setFilter((prev) => ({...prev, startDate: e.target.value}))
                        }
                        className="input w-full"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-700 block mb-1">End Date</label>
                    <input
                        type="date"
                        value={filter.endDate || ""}
                        onChange={(e) =>
                            setFilter((prev) => ({...prev, endDate: e.target.value}))
                        }
                        className="input w-full"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border bg-white">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">Total</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Created At</th>
                        <th className="text-left p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="p-4 text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        ordersPage?.content.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="p-3">
                                    <button
                                        onClick={() => openOrderDetails(order.id)}
                                        className="text-sm font-medium text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                    >
                                        #{order.id}
                                    </button>
                                </td>
                                <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                                <td className="p-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 ${getStatusClass(order.status)}`}>
                                        {getStatusIcon(order.status)} {order.status}
                                    </span>
                                </td>

                                <td className="p-3">
                                    {new Date(order.createdAt).toLocaleString()}
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        disabled={!getNextStatus(order.status)}
                                        onClick={() =>
                                            handleStatusUpdate(order, getNextStatus(order.status)!)
                                        }
                                        className={`text-sm px-3 py-1 rounded ${
                                            getNextStatus(order.status)
                                                ? "bg-blue-100 hover:bg-blue-200"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Next Status: {getNextStatus(order.status) || "-"}
                                    </button>

                                    <button
                                        disabled={order.status !== "PENDING" && order.status !== "PAID"}
                                        onClick={() => {
                                            setSelectedOrderToCancel(order);
                                            setCancelModalOpen(true);
                                        }}
                                        className={`text-sm px-3 py-1 rounded ${
                                            order.status === "PENDING" || order.status === "PAID"
                                                ? "bg-red-100 hover:bg-red-200"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {ordersPage && ordersPage.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({length: ordersPage.totalPages}).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`px-3 py-1 rounded ${
                                i === page ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {cancelModalOpen && selectedOrderToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4">Cancel Order #{selectedOrderToCancel.id}?</h3>
                        <p className="mb-6 text-sm text-gray-600">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setCancelModalOpen(false);
                                    setSelectedOrderToCancel(null);
                                }}
                                className="btn bg-gray-300 hover:bg-gray-400"
                            >
                                Close
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await updateOrderStatus(selectedOrderToCancel.id, "CANCELLED");
                                        setToast("Order cancelled", "success");
                                        fetchOrders();
                                    } catch {
                                        setToast("Failed to cancel order", "error");
                                    } finally {
                                        setCancelModalOpen(false);
                                        setSelectedOrderToCancel(null);
                                    }
                                }}
                                className="btn bg-red-600 hover:bg-red-700 text-white"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedOrderId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
                        <h3 className="text-lg font-bold mb-2">Order #{selectedOrderId}</h3>

                        {detailsLoading || !orderDetails ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Status: {getStatusIcon(orderDetails.status)}{" "}
                                    <span className={getStatusClass(orderDetails.status)}>{orderDetails.status}</span>
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Total: <strong>${orderDetails.totalAmount.toFixed(2)}</strong>
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    Created at: {new Date(orderDetails.createdAt).toLocaleString()}
                                </p>

                                <h4 className="font-semibold mb-2">Items</h4>
                                <ul className="text-sm space-y-2">
                                    {orderDetails.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 border-b py-2">
                                            <img
                                                src={item.imageUrl?.trim() ? item.imageUrl : getFallbackImageUrl()}
                                                alt={item.productName}
                                                className="w-12 h-12 object-cover rounded border"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{item.productName}</div>
                                                <div className="text-xs text-gray-500">
                                                    Quantity: {item.quantity} × ${item.pricePerUnit.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="font-semibold">
                                                ${(item.pricePerUnit * item.quantity).toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setSelectedOrderId(null);
                                    setOrderDetails(null);
                                }}
                                className="btn bg-gray-300 hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
