import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";

const navLinks = [
    { path: "/", label: "Home" },
    { path: "/file-complaint", label: "File Complaint" },
    { path: "/track", label: "Track Status" },
];

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Hide navbar on admin pages
    if (location.pathname.startsWith("/admin")) return null;

    return (
        <nav className="sticky top-0 z-50 bg-dark-100/80 backdrop-blur-xl border-b border-dark-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                            JS
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg tracking-tight">
                                JanSamadhan
                            </span>
                            <span className="text-primary font-bold text-lg"> AI</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-400 hover:text-white hover:bg-dark-200"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/admin"
                            className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gold hover:bg-gold/10 transition-all duration-200"
                        >
                            <ShieldCheck size={16} />
                            Admin
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="md:hidden bg-dark-100 border-t border-dark-300 px-4 py-3 space-y-1 animate-fade-in-up">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-400 hover:text-white hover:bg-dark-200"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gold hover:bg-gold/10 transition-all duration-200"
                    >
                        <ShieldCheck size={16} />
                        Admin Portal
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
