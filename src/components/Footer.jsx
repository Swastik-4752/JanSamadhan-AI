import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/file-complaint", label: "File Complaint" },
    { path: "/track", label: "Track Complaint" },
    { path: "/admin", label: "Admin Portal" },
];

function Footer() {
    return (
        <footer className="bg-[#111111] border-t-2 border-gold">
            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* ── Left Column: Brand ── */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building2 size={22} className="text-[#1A73E8]" />
                            <span className="text-[20px] font-bold text-white">
                                JanSamadhan
                            </span>
                            <span className="text-[20px] font-bold text-[#1A73E8] -ml-1">
                                AI
                            </span>
                        </div>
                        <p className="text-gold font-semibold text-sm">
                            Empowering 20 Million Delhi Citizens
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            AI-powered civic complaint management for Municipal
                            Corporation of Delhi
                        </p>
                    </div>

                    {/* ── Middle Column: Quick Links ── */}
                    <div className="space-y-4">
                        <h3 className="text-gold font-bold text-base">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Right Column: About ── */}
                    <div className="space-y-4">
                        <h3 className="text-gold font-bold text-base">About</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Built for India Innovates 2026</li>
                            <li>Municipal Corporation of Delhi</li>
                            <li>Bharat Mandapam, New Delhi</li>
                            <li>28 March 2026</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="border-t border-gold/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-gray-500 text-xs">
                        © 2026 JanSamadhan AI — Team Flowmatic | CSMSS College
                        of Engineering
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
