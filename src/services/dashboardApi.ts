import api from "@/services/axiosInstance";
import type {DashboardSummary} from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const response = await api.get("/dashboard/summary");
    return response.data.data;
}
