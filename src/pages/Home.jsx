import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, ChevronRight } from "lucide-react";

/* ── Data ── */
const stats = [
    { value: "20M+", label: "Delhi Citizens" },
    { value: "272", label: "Wards Covered" },
    { value: "24hr", label: "Urgent SLA" },
    { value: "Real-Time", label: "Live Tracking" },
];

const steps = [
    {
        num: 1,
        icon: "📝",
        title: "File Complaint",
        desc: "Submit via web in Hindi or English",
    },
    {
        num: 2,
        icon: "🤖",
        title: "AI Classification",
        desc: "Auto-assigned to correct ward officer instantly",
    },
    {
        num: 3,
        icon: "📍",
        title: "Track Progress",
        desc: "Real-time status updates with tracking ID",
    },
    {
        num: 4,
        icon: "✅",
        title: "Resolution Proof",
        desc: "Photo confirmation sent on completion",
    },
];

const categories = [
    { icon: "🛣️", label: "Road & Potholes" },
    { icon: "🗑️", label: "Garbage & Sanitation" },
    { icon: "💧", label: "Water Leakage" },
    { icon: "💡", label: "Streetlight" },
    { icon: "🌊", label: "Drainage" },
    { icon: "📋", label: "Other Issues" },
];

function Home() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />

            {/* ═══════════ SECTION 1 — HERO ═══════════ */}
            <section
                className="relative min-h-screen flex items-center justify-center px-4"
                style={{
                    background: `
                        linear-gradient(rgba(10,10,10,0.95), rgba(10,10,10,0.85)),
                        linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px),
                        linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
                }}
            >
                {/* Radial glow behind content */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1A73E8]/5 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-dark-100 border border-dark-300 rounded-full px-5 py-2 mb-8">
                        <span className="text-sm">🏆</span>
                        <span className="text-sm text-gray-300 font-medium">
                            India Innovates 2026{" "}
                            <span className="text-gold">|</span> Digital
                            Democracy
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-[48px] font-bold leading-tight mb-6">
                        Delhi&apos;s Civic Complaint System —{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] to-blue-400">
                            Reimagined
                        </span>
                    </h1>

                    {/* Sub-headline */}
                    <p className="text-gray-400 text-lg sm:text-[18px] max-w-2xl mx-auto mb-10 leading-relaxed">
                        File complaints, track resolution, hold officers
                        accountable. Powered by AI.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/file-complaint"
                            className="inline-flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1558b0] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                        >
                            📝 File a Complaint
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/track"
                            className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:bg-white/5"
                        >
                            🔍 Track Your Complaint
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronRight size={24} className="rotate-90 text-gray-500" />
                </div>
            </section>

            {/* ═══════════ SECTION 2 — STATS BAR ═══════════ */}
            <section className="bg-[#111111] border-y border-dark-300 py-12 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl sm:text-4xl font-bold text-[#1A73E8] mb-1">
                                {s.value}
                            </p>
                            <p className="text-gray-400 text-sm font-medium">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ SECTION 3 — HOW IT WORKS ═══════════ */}
            <section className="py-20 px-4 bg-[#0A0A0A]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
                        Four simple steps from complaint to resolution
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={step.num} className="relative group">
                                {/* Arrow connector (desktop only) */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 -right-4 w-8 text-dark-300 z-10">
                                        <ArrowRight
                                            size={20}
                                            className="text-gold/50"
                                        />
                                    </div>
                                )}

                                <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6 text-center hover:border-[#1A73E8]/40 transition-all duration-300 h-full">
                                    {/* Step number badge */}
                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] text-sm font-bold mb-4">
                                        {step.num}
                                    </div>

                                    {/* Icon */}
                                    <div className="text-4xl mb-3">
                                        {step.icon}
                                    </div>

                                    {/* Title & description */}
                                    <h3 className="text-white font-semibold text-lg mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 4 — COMPLAINT CATEGORIES ═══════════ */}
            <section className="py-20 px-4 bg-[#111111]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                        What Can You Report?
                    </h2>
                    <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
                        Select a category to file your complaint instantly
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {categories.map((cat) => (
                            <Link
                                key={cat.label}
                                to="/file-complaint"
                                className="group bg-dark-100 border border-dark-300 rounded-2xl p-6 text-center
                                    hover:-translate-y-1 hover:border-[#1A73E8]/50 hover:shadow-lg hover:shadow-[#1A73E8]/10
                                    transition-all duration-300"
                            >
                                <div className="text-4xl mb-3">
                                    {cat.icon}
                                </div>
                                <p className="text-white font-medium text-sm group-hover:text-[#1A73E8] transition-colors duration-200">
                                    {cat.label}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 5 — CTA BANNER ═══════════ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A73E8] to-[#0d47a1]" />
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

                <div className="relative z-10 max-w-4xl mx-auto text-center py-20 px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to Report an Issue?
                    </h2>
                    <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of Delhi citizens making their city
                        better
                    </p>
                    <Link
                        to="/file-complaint"
                        className="inline-flex items-center gap-2 bg-white text-[#1A73E8] font-bold px-10 py-4 rounded-xl
                            hover:bg-gray-100 transition-all duration-200 shadow-xl shadow-black/20 text-lg"
                    >
                        File Your Complaint Now
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
