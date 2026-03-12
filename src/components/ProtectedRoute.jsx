import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { Loader2 } from "lucide-react";

/**
 * ProtectedRoute — Gates admin routes behind Firebase auth.
 * Shows loading spinner while checking auth state.
 * Redirects to /admin if not authenticated.
 */
function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg animate-pulse-glow">
                    JS
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Loading JanSamadhan AI...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}

export default ProtectedRoute;
