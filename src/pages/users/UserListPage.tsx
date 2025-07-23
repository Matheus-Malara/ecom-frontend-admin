import {useEffect, useState} from "react";
import {getFilteredUsers, toggleUserStatus} from "@/services/userApi";
import {useToastStore} from "@/stores/toastStore";
import type {User} from "@/types/user";
import type {UserFilter} from "@/types/user-filter";
import type {Page} from "@/types/paginated";

export default function UserListPage() {
    const [filter, setFilter] = useState<UserFilter>({});
    const [page, setPage] = useState(0);
    const [usersPage, setUsersPage] = useState<Page<User>>();
    const [loading, setLoading] = useState(false);
    const {setToast} = useToastStore();

    useEffect(() => {
        fetchUsers();
    }, [page, filter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getFilteredUsers(filter, page, 10);
            setUsersPage(data);
        } catch {
            setToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await toggleUserStatus(user.email, !user.active);
            setToast(`User ${user.active ? "deactivated" : "activated"}`, "success");
            fetchUsers();
        } catch {
            setToast("Failed to update user status", "error");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">👤 User List</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Email"
                    value={filter.email || ""}
                    onChange={(e) => setFilter((prev) => ({...prev, email: e.target.value}))}
                    className="input"
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={filter.firstName || ""}
                    onChange={(e) => setFilter((prev) => ({...prev, firstName: e.target.value}))}
                    className="input"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={filter.lastName || ""}
                    onChange={(e) => setFilter((prev) => ({...prev, lastName: e.target.value}))}
                    className="input"
                />
                <select
                    value={filter.active === undefined ? "" : filter.active ? "true" : "false"}
                    onChange={(e) =>
                        setFilter((prev) => ({
                            ...prev,
                            active: e.target.value === "" ? undefined : e.target.value === "true",
                        }))
                    }
                    className="input"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border bg-white">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">First Name</th>
                        <th className="text-left p-3">Last Name</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="p-4 text-center">Loading...</td>
                        </tr>
                    ) : (
                        usersPage?.content.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-3">#{user.id}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.firstName}</td>
                                <td className="p-3">{user.lastName}</td>
                                <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${
                                                user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        className="text-sm px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200"
                                    >
                                        {user.active ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {usersPage && usersPage.totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({length: usersPage.totalPages}).map((_, i) => (
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
        </div>
    );
}
