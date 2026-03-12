import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
    FileText,
    Search,
    BarChart3,
    Shield,
    Clock,
    MapPin,
    ArrowRight,
    Zap,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "File Complaint",
        desc: "Report civic issues like potholes, garbage, water leakage with a unique tracking ID.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
    },
    {
        icon: Search,
        title: "Track in Real-Time",
        desc: "Follow your complaint status from submission to resolution — complete transparency.",
        color: "text-green-400",
        bg: "bg-green-500/10",
    },
    {
        icon: Clock,
        title: "SLA Enforcement",
        desc: "Urgent complaints get 24hr deadline, Standard gets 72hr. Missed SLA = auto-escalation.",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
    },
    {
        icon: BarChart3,
        title: "Ward Analytics",
        desc: "Real-time performance dashboard showing ward-level complaint data and resolution rates.",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
    {
        icon: MapPin,
        title: "Auto Ward Assignment",
        desc: "Complaints are automatically assigned to the right ward and officer based on location.",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
    },
    {
        icon: Shield,
        title: "Government Credible",
        desc: "Built for Municipal Corporation of Delhi with secure, accountable data handling.",
        color: "text-gold",
        bg: "bg-gold/10",
    },
];

const stats = [
    { value: "20M+", label: "Citizens Served" },
    { value: "272", label: "Wards Covered" },
    { value: "24hr", label: "Urgent SLA" },
    { value: "99.9%", label: "Uptime" },
];

function Home() {
    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 animate-fade-in-up">
                            <Zap size={14} />
                            AI-Powered Civic Complaint System
                        </div>

                        {/* Title */}
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-in-up"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <span className="text-white">Jan</span>
                            <span className="gradient-text">Samadhan</span>
                            <span className="text-white"> AI</span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            India's first ward-level civic complaint intelligence system.
                            Report issues. Track resolutions. Hold officers accountable.
                            <br />
                            <span className="text-gold font-medium">
                                Municipal Corporation of Delhi
                            </span>
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <Link
                                to="/file-complaint"
                                className="btn-primary flex items-center gap-2 text-base px-8 py-3"
                            >
                                <FileText size={18} />
                                File a Complaint
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/track"
                                className="flex items-center gap-2 px-8 py-3 rounded-lg text-base font-semibold text-white border border-dark-300 hover:border-primary/50 hover:bg-dark-100 transition-all duration-200"
                            >
                                <Search size={18} />
                                Track Complaint
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="border-y border-dark-300 bg-dark-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl md:text-3xl font-extrabold gradient-text">
                                    {stat.value}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        How It Works
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        A complete civic complaint lifecycle — from filing to resolution,
                        with full transparency at every step.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feat, i) => (
                        <div
                            key={i}
                            className="card-hover group animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div
                                className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <feat.icon className={feat.color} size={24} />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">
                                {feat.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-blue-600/10 border border-primary/20 p-8 md:p-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Facing a civic issue?
                            </h3>
                            <p className="text-gray-400">
                                File your complaint now and get a tracking ID within seconds.
                            </p>
                        </div>
                        <Link
                            to="/file-complaint"
                            className="btn-primary flex items-center gap-2 text-base px-8 py-3 flex-shrink-0"
                        >
                            Get Started
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
