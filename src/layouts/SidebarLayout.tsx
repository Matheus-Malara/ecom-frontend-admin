import {NavLink, Outlet} from "react-router-dom";
import Header from "@/components/Header";

export default function SidebarLayout() {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
                <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
                <nav className="space-y-2">
                    <NavLink to="/" className={navStyle}>📊 Dashboard</NavLink>
                    <NavLink to="/products" className={navStyle}>📦 Products</NavLink>
                    <NavLink to="/brands" className={navStyle}>🏷️ Brands</NavLink>
                    <NavLink to="/categories" className={navStyle}>📁 Categories</NavLink>
                    <NavLink to="/orders" className={navStyle}>🛒 Orders</NavLink>
                    <NavLink to="/users" className={navStyle}>👤 Users</NavLink>
                </nav>
            </aside>

            <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
                <Header/> {/* 👈 Aparece sempre nas rotas privadas */}
                <main className="p-6 flex-1">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

function navStyle({isActive}: { isActive: boolean }) {
    return `block px-4 py-2 rounded font-medium ${
        isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"
    }`;
}
