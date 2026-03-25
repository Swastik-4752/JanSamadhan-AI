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
    Phone,
    Camera,
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

    /* Phone lookup state */
    const [phoneInput, setPhoneInput] = useState("");
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneResults, setPhoneResults] = useState(null); // null | [] | "not_found"

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
                const data = { id: doc.id, ...doc.data() };
                console.log("Complaint:", data);
                setComplaint(data);
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

    /* ── Phone lookup query ── */
    const doPhoneSearch = async () => {
        const phone = phoneInput.trim();
        if (!phone) return;
        setPhoneLoading(true);
        setPhoneResults(null);
        // Clear single-complaint view
        setComplaint(null);
        setRating(0);

        try {
            const q = query(
                collection(db, "complaints"),
                where("phone", "==", phone)
            );
            const snap = await getDocs(q);
            if (snap.empty) {
                setPhoneResults("not_found");
            } else {
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                // Sort newest first
                list.sort((a, b) => {
                    const aT = a.createdAt?.toDate?.() || new Date(0);
                    const bT = b.createdAt?.toDate?.() || new Date(0);
                    return bT - aT;
                });
                setPhoneResults(list);
            }
        } catch (err) {
            console.error("Phone search error:", err);
            setPhoneResults("not_found");
        } finally {
            setPhoneLoading(false);
        }
    };

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        doPhoneSearch();
    };

    /** When user clicks a card from phone results, switch to tracking ID view */
    const selectFromPhoneResults = (trackingId) => {
        setPhoneResults(null);
        setPhoneInput("");
        setInput(trackingId);
        doSearch(trackingId);
    };

    /** Mask phone: "9876543210" → "XXXXXX3210" */
    const maskPhone = (phone) => {
        if (!phone || phone.length < 4) return "XXXX";
        return "X".repeat(phone.length - 4) + phone.slice(-4);
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

                {/* ── OR divider ── */}
                {!complaint && !loading && (
                    <div className="flex items-center gap-4 max-w-xl mx-auto mb-8">
                        <div className="flex-1 h-px bg-dark-300" />
                        <span className="text-gray-500 text-sm font-medium">— OR —</span>
                        <div className="flex-1 h-px bg-dark-300" />
                    </div>
                )}

                {/* ── Phone Lookup ── */}
                {!complaint && !loading && (
                    <form
                        onSubmit={handlePhoneSubmit}
                        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-12"
                    >
                        <div className="relative flex-1">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="tel"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                                placeholder="Enter your registered mobile number"
                                className="w-full bg-dark-100 border border-dark-300 rounded-xl pl-10 pr-5 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/50 focus:border-[#1A73E8] transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={phoneLoading || !phoneInput.trim()}
                            className="inline-flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1558b0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
                        >
                            <Search size={18} />
                            Find My Complaints
                        </button>
                    </form>
                )}

                {/* ── Phone Loading ── */}
                {phoneLoading && (
                    <div className="text-center py-16">
                        <Loader2
                            size={40}
                            className="animate-spin text-[#1A73E8] mx-auto mb-4"
                        />
                        <p className="text-gray-400">
                            Looking up complaints...
                        </p>
                    </div>
                )}

                {/* ── Phone Not Found ── */}
                {phoneResults === "not_found" && (
                    <div className="text-center py-16 bg-dark-100 border border-dark-300 rounded-2xl">
                        <XCircle
                            size={48}
                            className="text-red-400 mx-auto mb-4"
                        />
                        <h2 className="text-xl font-bold mb-2">
                            No complaints found with this number
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Please check your phone number and try again
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

                {/* ── Phone Results List ── */}
                {Array.isArray(phoneResults) && phoneResults.length > 0 && (
                    <div className="space-y-4 mb-8">
                        <p className="text-gray-400 text-sm">
                            Found <span className="text-white font-semibold">{phoneResults.length}</span> complaint{phoneResults.length > 1 ? "s" : ""} for <span className="font-mono text-white">{maskPhone(phoneInput || phoneResults[0]?.phone)}</span>
                        </p>

                        {phoneResults.map((item) => {
                            const filed = item.createdAt?.toDate
                                ? item.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                : "—";
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => selectFromPhoneResults(item.trackingId)}
                                    className="w-full text-left bg-dark-100 border border-dark-300 rounded-2xl p-5 hover:border-[#1A73E8]/50 hover:shadow-[0_0_12px_1px_rgba(26,115,232,0.2)] transition-all duration-200 group"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <p className="font-mono text-[#1A73E8] font-bold text-sm group-hover:underline">
                                                {item.trackingId}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {safeName(item.name)} · {maskPhone(item.phone)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor[item.status] || statusColor.Pending}`}>
                                                {item.status}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${priorityColor[item.priority] || priorityColor.Standard}`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            {catIcons[item.category] || <ClipboardList size={12} />}
                                            {item.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {item.ward}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {filed}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}

                        <p className="text-gray-600 text-xs text-center mt-4">
                            Complaint details are public record as per RTI guidelines.
                        </p>
                    </div>
                )}

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

                        {/* ─ Photo Evidence (Before / After) ─ */}
                        {(() => {
                            const userPhoto =
                                c.complaintPhotoUrl ||
                                c.imageUrl ||
                                c.image ||
                                c.photo ||
                                c.fileUrl;
                            const adminPhoto = c.resolutionPhotoUrl;
                            if (!userPhoto && !adminPhoto) return null;
                            return (
                                <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6 sm:p-8">
                                    <h3 className="flex items-center gap-2 text-lg font-bold mb-5 text-gold">
                                        <Camera size={20} />
                                        Photo Evidence
                                    </h3>

                                    {userPhoto && adminPhoto ? (
                                        /* ── Both photos side by side ── */
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
                                                    Reported Issue
                                                </p>
                                                <img
                                                    src={userPhoto}
                                                    alt="Reported issue"
                                                    className="w-full max-h-[250px] object-cover rounded-xl border border-dark-300"
                                                />
                                                <p className="text-gray-500 text-xs mt-2">Photo submitted by citizen</p>
                                            </div>
                                            <div>
                                                <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                                                    Resolution Proof
                                                </p>
                                                <img
                                                    src={adminPhoto}
                                                    alt="Resolution proof"
                                                    className="w-full max-h-[250px] object-cover rounded-xl border border-dark-300"
                                                />
                                                <p className="text-gray-500 text-xs mt-2">Verified by Ward Officer</p>
                                            </div>
                                        </div>
                                    ) : userPhoto ? (
                                        /* ── Only user photo ── */
                                        <div>
                                            <p className="text-[#1A73E8] text-xs font-semibold uppercase tracking-wider mb-2">
                                                Reported Issue
                                            </p>
                                            <img
                                                src={userPhoto}
                                                alt="Reported issue"
                                                className="w-full max-h-[300px] object-cover rounded-xl border border-dark-300 mb-2"
                                            />
                                            <p className="text-gray-500 text-xs">Photo submitted by citizen</p>
                                        </div>
                                    ) : (
                                        /* ── Only admin photo ── */
                                        <div>
                                            <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                                                Resolution Proof
                                            </p>
                                            <img
                                                src={adminPhoto}
                                                alt="Resolution proof"
                                                className="w-full max-h-[300px] object-cover rounded-xl border border-dark-300 mb-2"
                                            />
                                            <p className="text-gray-500 text-xs">Verified by Ward Officer</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
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
