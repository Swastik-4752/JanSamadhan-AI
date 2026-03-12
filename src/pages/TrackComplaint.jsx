import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { STATUSES } from "../utils/constants";
import {
    Search,
    Loader2,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    Tag,
    User,
    FileText,
    Star,
    ArrowRight,
    XCircle,
    Trash2,
    Droplets,
    Lightbulb,
    Waves,
    ClipboardList,
    Construction,
    ArrowUpCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── Category icon map ── */
const catIcons = {
    "Road & Potholes": <Construction size={16} />,
    "Garbage & Sanitation": <Trash2 size={16} />,
    "Water Leakage": <Droplets size={16} />,
    Streetlight: <Lightbulb size={16} />,
    Drainage: <Waves size={16} />,
    Other: <ClipboardList size={16} />,
};

/* ── Status colours ── */
const statusColor = {
    Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    Assigned: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    "In Progress": "bg-orange-500/10 text-orange-400 border-orange-500/30",
    Resolved: "bg-green-500/10 text-green-400 border-green-500/30",
};

const priorityColor = {
    Urgent: "bg-red-500/10 text-red-400 border-red-500/30",
    Standard: "bg-gray-500/10 text-gray-300 border-gray-500/30",
};

/* ── Step list for the stepper ── */
const STEP_ORDER = STATUSES; // ["Pending", "Assigned", "In Progress", "Resolved"]

function TrackComplaint() {
    const [searchParams] = useSearchParams();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [complaint, setComplaint] = useState(null); // null | object | "not_found"
    const [rating, setRating] = useState(0);

    /* Auto-search from URL params */
    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setInput(id);
            doSearch(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Firestore query ── */
    const doSearch = async (trackingId) => {
        const id = (trackingId || input).trim();
        if (!id) return;
        setLoading(true);
        setComplaint(null);
        setRating(0);

        try {
            const q = query(
                collection(db, "complaints"),
                where("trackingId", "==", id)
            );
            const snap = await getDocs(q);
            if (snap.empty) {
                setComplaint("not_found");
            } else {
                const doc = snap.docs[0];
                setComplaint({ id: doc.id, ...doc.data() });
            }
        } catch (err) {
            console.error("Search error:", err);
            setComplaint("not_found");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        doSearch();
    };

    /* ── Formatters / helpers ── */
    const fmtDate = (ts) => {
        if (!ts) return "—";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getStepIndex = (status) =>
        STEP_ORDER.indexOf(status) === -1 ? 0 : STEP_ORDER.indexOf(status);

    /** SLA logic — returns { type, text, subtext } */
    const getSLA = (c) => {
        if (!c || !c.createdAt) return null;

        const created = c.createdAt.toDate
            ? c.createdAt.toDate()
            : new Date(c.createdAt);
        const slaHrs = c.priority === "Urgent" ? 24 : 72;
        const deadline = new Date(created.getTime() + slaHrs * 3600000);

        if (c.status === "Resolved") {
            const resolved = c.resolvedAt
                ? c.resolvedAt.toDate
                    ? c.resolvedAt.toDate()
                    : new Date(c.resolvedAt)
                : new Date();
            const diffMs = resolved - created;
            const hrs = Math.floor(diffMs / 3600000);
            const mins = Math.floor((diffMs % 3600000) / 60000);
            return {
                type: "resolved",
                icon: <CheckCircle size={16} className="inline mr-1.5 align-text-bottom" />,
                text: `Resolved in ${hrs} hours ${mins} minutes`,
                subtext: null,
            };
        }

        const now = new Date();
        if (now > deadline) {
            const overdueMs = now - deadline;
            const overdueHrs = Math.floor(overdueMs / 3600000);
            const overdueMins = Math.floor((overdueMs % 3600000) / 60000);
            return {
                type: "breached",
                icon: <AlertTriangle size={16} className="inline mr-1.5 align-text-bottom text-red-400" />,
                text: "SLA Breached — Escalated to Senior Officer",
                subtext: "This complaint has been automatically escalated due to missed deadline",
                overdueText: `Overdue by ${overdueHrs} hours ${overdueMins} minutes`,
            };
        }

        const remaining = deadline - now;
        const hrs = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        return {
            type: "within",
            icon: <Clock size={16} className="inline mr-1.5 align-text-bottom text-yellow-500" />,
            text: `Time Remaining: ${hrs}hrs ${mins}mins`,
            subtext: `Deadline: ${fmtDate({ toDate: () => deadline })}`,
        };
    };

    /** Privacy-safe name: "Swastik Bhoite" → "Swastik B." */
    const safeName = (name) => {
        if (!name) return "—";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0];
        return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    };

    /* ════════════════════════ RENDER ════════════════════════ */
    const c = typeof complaint === "object" && complaint ? complaint : null;
    const stepIdx = c ? getStepIndex(c.status) : 0;
    const sla = c ? getSLA(c) : null;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* ── Header ── */}
                <div className="text-center mb-10">
                    <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-bold mb-2">
                        <Search className="text-[#1A73E8]" size={36} />
                        Track Your Complaint
                    </h1>
                    <p className="text-gray-400">
                        Enter your tracking ID to see real-time status
                    </p>
                </div>

                {/* ── Search ── */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-12"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter tracking ID (e.g. JS-20260312-4752)"
                        className="flex-1 bg-dark-100 border border-dark-300 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/50 focus:border-[#1A73E8] transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="inline-flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1558b0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
                    >
                        <Search size={18} />
                        Search
                    </button>
                </form>

                {/* ── Loading ── */}
                {loading && (
                    <div className="text-center py-16">
                        <Loader2
                            size={40}
                            className="animate-spin text-[#1A73E8] mx-auto mb-4"
                        />
                        <p className="text-gray-400">
                            Searching for your complaint...
                        </p>
                    </div>
                )}

                {/* ── Not Found ── */}
                {complaint === "not_found" && (
                    <div className="text-center py-16 bg-dark-100 border border-dark-300 rounded-2xl">
                        <XCircle
                            size={48}
                            className="text-red-400 mx-auto mb-4"
                        />
                        <h2 className="text-xl font-bold mb-2">
                            No complaint found with this ID
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Please check your tracking ID and try again
                        </p>
                        <Link
                            to="/file-complaint"
                            className="inline-flex items-center gap-2 text-[#1A73E8] hover:underline font-medium"
                        >
                            File a new complaint
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {/* ── Complaint Found ── */}
                {c && (
                    <div className="space-y-6">
                        {/* ─ Resolved Banner ─ */}
                        {c.status === "Resolved" && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                                <CheckCircle
                                    size={36}
                                    className="text-green-400 mx-auto mb-3"
                                />
                                <div className="flex items-center justify-center gap-2 text-green-300 text-lg font-bold">
                                    Your complaint has been resolved!
                                </div>
                                {sla && (
                                    <p className="text-green-400/80 text-sm mt-1">
                                        {sla.text}
                                    </p>
                                )}

                                {/* Star rating (UI only) */}
                                <div className="mt-5">
                                    <p className="text-gray-300 text-sm mb-2">
                                        Rate your experience
                                    </p>
                                    <div className="flex items-center justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setRating(s)}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={28}
                                                    className={
                                                        s <= rating
                                                            ? "text-gold fill-gold"
                                                            : "text-dark-300"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {rating > 0 && (
                                        <p className="text-gold text-xs mt-2">
                                            Thank you for your feedback!
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ─ Top Card ─ */}
                        <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6 sm:p-8">
                            {/* Header row */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                                        Tracking ID
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-mono font-bold text-gold tracking-wider">
                                        {c.trackingId}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                            statusColor[c.status] ||
                                            statusColor.Pending
                                        }`}
                                    >
                                        {c.status}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                            priorityColor[c.priority] ||
                                            priorityColor.Standard
                                        }`}
                                    >
                                        {c.priority === "Urgent" ? (
                                            <>
                                                <AlertTriangle size={12} />
                                                Urgent
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardList size={12} />
                                                Standard
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Filed date */}
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
                                <Clock size={14} />
                                <span>Filed on {fmtDate(c.createdAt)}</span>
                            </div>

                            {/* ─── Progress Stepper ─── */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    {STEP_ORDER.map((step, idx) => {
                                        const completed = idx < stepIdx;
                                        const current = idx === stepIdx;
                                        return (
                                            <div
                                                key={step}
                                                className="flex items-center flex-1 last:flex-none"
                                            >
                                                {/* Circle */}
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                                            completed
                                                                ? "bg-[#1A73E8] text-white"
                                                                : current
                                                                ? "bg-[#1A73E8]/20 text-[#1A73E8] ring-4 ring-[#1A73E8]/20 animate-pulse"
                                                                : "bg-dark-200 text-gray-500 border border-dark-300"
                                                        }`}
                                                    >
                                                        {completed ? (
                                                            <CheckCircle
                                                                size={18}
                                                            />
                                                        ) : (
                                                            idx + 1
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-[10px] sm:text-xs mt-2 font-medium text-center ${
                                                            completed || current
                                                                ? "text-white"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {step}
                                                    </span>
                                                </div>

                                                {/* Connector line */}
                                                {idx < STEP_ORDER.length - 1 && (
                                                    <div
                                                        className={`flex-1 h-0.5 mx-2 rounded ${
                                                            idx < stepIdx
                                                                ? "bg-[#1A73E8]"
                                                                : "bg-dark-300"
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Escalated indicator below stepper */}
                                {sla && sla.type === "breached" && (
                                    <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                                        <ArrowUpCircle size={16} className="text-red-400" />
                                        <span className="text-red-400 text-xs font-semibold">Escalated</span>
                                        <span className="text-red-400/70 text-xs">— Auto-escalated to Senior Ward Officer</span>
                                    </div>
                                )}
                            </div>

                            {/* ─── SLA Box ─── */}
                            {sla && sla.type === "breached" && (
                                <div className="rounded-xl p-5 mb-8 border bg-red-500/10 border-red-500/30">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <AlertTriangle size={22} className="text-red-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-red-400 text-sm">
                                                {sla.text}
                                            </p>
                                            <p className="text-red-400/70 text-xs mt-1">
                                                {sla.subtext}
                                            </p>
                                            <p className="text-red-300 text-xs font-semibold mt-2">
                                                <Clock size={12} className="inline mr-1 -mt-0.5" />
                                                {sla.overdueText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {sla && sla.type !== "breached" && (
                                <div
                                    className={`rounded-xl p-4 mb-8 border ${
                                        sla.type === "resolved"
                                            ? "bg-green-500/10 border-green-500/30"
                                            : "bg-yellow-500/10 border-yellow-500/30"
                                    }`}
                                >
                                    <p
                                        className={`font-semibold text-sm ${
                                            sla.type === "resolved"
                                                ? "text-green-400"
                                                : "text-yellow-400"
                                        }`}
                                    >
                                        {sla.icon}
                                        {sla.text}
                                    </p>
                                    {sla.subtext && (
                                        <p
                                            className={`text-xs mt-1 ${
                                                sla.type === "resolved"
                                                    ? "text-green-400/70"
                                                    : "text-yellow-400/70"
                                            }`}
                                        >
                                            {sla.subtext}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ─── Complaint Details ─── */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-gold">
                                    Complaint Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Detail
                                        icon={
                                            <Tag
                                                size={16}
                                                className="text-[#1A73E8]"
                                            />
                                        }
                                        label="Category"
                                        value={
                                            <div className="flex items-center gap-2">
                                                {catIcons[c.category] || <ClipboardList size={16} />}
                                                <span>{c.category}</span>
                                            </div>
                                        }
                                    />
                                    <Detail
                                        icon={
                                            <MapPin
                                                size={16}
                                                className="text-[#1A73E8]"
                                            />
                                        }
                                        label="Ward"
                                        value={c.ward}
                                    />
                                    <Detail
                                        icon={
                                            <User
                                                size={16}
                                                className="text-[#1A73E8]"
                                            />
                                        }
                                        label="Filed By"
                                        value={safeName(c.name)}
                                    />
                                    {c.location && (
                                        <Detail
                                            icon={
                                                <MapPin
                                                    size={16}
                                                    className="text-[#1A73E8]"
                                                />
                                            }
                                            label="Location"
                                            value={c.location}
                                        />
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mt-5">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2">
                                        <FileText size={14} />
                                        Description
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed bg-dark-200 rounded-xl p-4 border border-dark-300">
                                        {c.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ─ Resolution Proof Photo ─ */}
                        {c.status === "Resolved" && c.resolutionPhotoUrl && (
                            <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6 sm:p-8">
                                <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-green-400">
                                    <CheckCircle size={20} />
                                    Resolution Proof
                                </h3>
                                <img
                                    src={c.resolutionPhotoUrl}
                                    alt="Resolution proof"
                                    className="w-full max-h-[250px] object-cover rounded-xl border border-dark-300 mb-3"
                                />
                                <p className="text-gray-400 text-sm">
                                    Verified and resolved by Ward Officer
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

/* ── Detail row helper ── */
function Detail({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 bg-dark-200 rounded-xl p-3 border border-dark-300">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

export default TrackComplaint;
