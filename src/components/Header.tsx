import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const {logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-6">
            <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
                🛒 Admin Dashboard
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={logout}
                    className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
