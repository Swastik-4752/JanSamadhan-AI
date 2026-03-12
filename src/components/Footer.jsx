import { useLocation } from "react-router-dom";

function Footer() {
    const location = useLocation();

    // Hide footer on admin pages
    if (location.pathname.startsWith("/admin")) return null;

    return (
        <footer className="bg-dark-100 border-t border-dark-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Branding */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs">
                                JS
                            </div>
                            <span className="text-white font-bold text-lg">
                                JanSamadhan <span className="text-primary">AI</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            AI-Powered Civic Complaint Management System for Municipal
                            Corporation of Delhi.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="/"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/file-complaint"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    File Complaint
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/track"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Track Complaint
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
                            Contact MCD
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>📞 Helpline: 155305</li>
                            <li>📧 complaints@mcd.gov.in</li>
                            <li>🏛️ MCD HQ, New Delhi — 110002</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-dark-300 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-gray-600 text-xs">
                        © 2026 JanSamadhan AI — Municipal Corporation of Delhi. All rights
                        reserved.
                    </p>
                    <p className="text-gray-600 text-xs">
                        Built by{" "}
                        <span className="text-gold">Team Flowmatic</span> |
                        India Innovates 2026
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
