import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, Building2 } from "lucide-react";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/admin/dashboard", { replace: true });
            }
            setCheckingAuth(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            switch (err.code) {
                case "auth/user-not-found":
                    setError("No admin account found with this email.");
                    break;
                case "auth/wrong-password":
                    setError("Incorrect password. Please try again.");
                    break;
                case "auth/invalid-credential":
                    setError("Invalid credentials. Please check email and password.");
                    break;
                case "auth/too-many-requests":
                    setError("Too many failed attempts. Please try later.");
                    break;
                default:
                    setError("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg animate-pulse-glow">
                    JS
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Checking authentication...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            {/* Background accents */}
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md animate-fade-in-up">
                {/* Card */}
                <div className="bg-dark-100 border border-dark-300 rounded-2xl overflow-hidden">
                    {/* Gold top border */}
                    <div className="h-1 bg-gradient-to-r from-gold via-yellow-500 to-gold" />

                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                                JS
                            </div>
                            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                                <ShieldCheck className="text-gold" size={24} />
                                Admin Portal
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                JanSamadhan AI — MCD Command Center
                            </p>

                            {/* MCD Badge */}
                            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">
                                <Building2 size={14} /> Municipal Corporation of Delhi
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@jansamadhan.com"
                                    className="input-dark"
                                    autoComplete="email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="input-dark pr-12"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Hint */}
                <p className="text-center text-gray-600 text-xs mt-4">
                    Protected access for authorized MCD officers only.
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;

/*
 * ============================================
 * TO CREATE ADMIN USER:
 * Go to Firebase Console → Authentication → Add User
 * Email: admin@jansamadhan.com
 * Password: Admin@1234
 * ============================================
 */
