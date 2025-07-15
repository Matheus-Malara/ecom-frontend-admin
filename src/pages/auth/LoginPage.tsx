import {useNavigate} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth";
import {useEffect, useState} from "react";
import {getAccessToken} from "@/services/authStorage";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login, loading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (getAccessToken()) {
            navigate("/");
        }
    }, [navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch {
            alert("Invalid credentials");
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20 p-4 shadow bg-white rounded">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                       className="input" required/>
                <input type="password" placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)} className="input" required/>
                <button type="submit" className="btn w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
