import {useEffect, useState} from "react";
import {getDashboardSummary} from "@/services/dashboardApi";
import type {DashboardSummary} from "@/types/dashboard";

export default function DashboardPage() {
    const [data, setData] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardSummary()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        {title: "Products", value: data?.products, icon: "🧃"},
        {title: "Brands", value: data?.brands, icon: "🏷️"},
        {title: "Categories", value: data?.categories, icon: "📦"},
        {title: "Orders", value: data?.orders, icon: "🧾"},
        {title: "Users", value: data?.users, icon: "👤"},
    ];

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">📊 Dashboard</h2>
            {loading ? (
                <p className="text-gray-500">Loading dashboard...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="bg-white shadow rounded-xl p-5 flex flex-col items-center justify-center text-center"
                        >
                            <div className="text-3xl">{card.icon}</div>
                            <div className="text-xl font-semibold mt-2">{card.value}</div>
                            <div className="text-sm text-gray-500">{card.title}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
