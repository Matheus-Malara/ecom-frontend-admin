import api from "@/services/axiosInstance.ts";
import type {User} from "@/types/user.ts";
import type {UserFilter} from "@/types/user-filter.ts";
import type {Page} from "@/types/paginated.ts";

export async function getFilteredUsers(
    filter: UserFilter,
    page: number = 0,
    size: number = 10
): Promise<Page<User>> {
    const params: Record<string, string | number | boolean | undefined> = {
        page,
        size,
    };

    if (filter.email) params.email = filter.email;
    if (filter.firstName) params.firstName = filter.firstName;
    if (filter.lastName) params.lastName = filter.lastName;
    if (filter.active !== undefined) params.active = filter.active;

    const response = await api.get("/users", {params});
    return response.data.data;
}

export async function toggleUserStatus(email: string, active: boolean): Promise<void> {
    await api.patch(`/users/${email}/status`, {active});
}
