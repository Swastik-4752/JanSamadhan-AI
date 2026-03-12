import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Building2 } from "lucide-react";

const navLinks = [
    { path: "/", label: "Home" },
    { path: "/file-complaint", label: "File Complaint", isButton: true },
    { path: "/track", label: "Track Complaint" },
    { path: "/admin", label: "Admin" },
];

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Hide navbar on admin dashboard
    if (location.pathname.startsWith("/admin/dashboard")) return null;

    const closeMobile = () => setMobileOpen(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0A0A0A] border-b-2 border-gold">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2 select-none shrink-0">
                        <Building2 size={22} className="text-[#1A73E8]" />
                        <span className="text-[20px] font-bold text-white whitespace-nowrap">
                            JanSamadhan
                        </span>
                        <span className="text-[20px] font-bold text-[#1A73E8] -ml-1 whitespace-nowrap">
                            AI
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) =>
                            link.isButton ? (
                                /* "File Complaint" stands out as a blue button */
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            isActive
                                                ? "bg-[#1A73E8] text-white shadow-lg shadow-blue-500/25"
                                                : "bg-[#1A73E8] text-white hover:bg-[#1558b0] hover:shadow-lg hover:shadow-blue-500/25"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ) : (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.path === "/"}
                                    className={({ isActive }) =>
                                        `px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                                            isActive
                                                ? "text-[#1A73E8] border-[#1A73E8]"
                                                : "text-white border-transparent hover:text-[#1A73E8]"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            )
                        )}
                    </div>

                    {/* ── Mobile Hamburger ── */}
                    <button
                        className="md:hidden text-white hover:text-[#1A73E8] p-2 transition-colors duration-200"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu (slide‑down) ── */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-[#0A0A0A] border-t border-dark-300 px-4 py-3 space-y-1">
                    {navLinks.map((link) =>
                        link.isButton ? (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={closeMobile}
                                className={({ isActive }) =>
                                    `block px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-all duration-200 ${
                                        isActive
                                            ? "bg-[#1A73E8] text-white"
                                            : "bg-[#1A73E8]/90 text-white hover:bg-[#1A73E8]"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ) : (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === "/"}
                                onClick={closeMobile}
                                className={({ isActive }) =>
                                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "text-[#1A73E8] bg-[#1A73E8]/10 border-l-2 border-[#1A73E8]"
                                            : "text-white hover:text-[#1A73E8] hover:bg-dark-200"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
