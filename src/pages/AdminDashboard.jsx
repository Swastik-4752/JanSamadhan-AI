import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    addDoc,
    Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import StatusBadge from "../components/StatusBadge";
import {
    LogOut,
    Loader2,
    AlertTriangle,
    ClipboardList,
    Clock,
    CheckCircle,
    Activity,
    Search,
    X,
    Database,
    BarChart2,
    ImagePlus,
    Upload,
    ArrowUpCircle,
    MapPin,
    User,
    FileText,
    Tag,
    Phone,
    Camera,
} from "lucide-react";
import { CATEGORIES, STATUSES, WARDS } from "../utils/constants";
import toast from "react-hot-toast";

// ============================================
// SEED DATA FUNCTION
// ============================================
const sampleComplaints = [
    { name: "Rahul Sharma", phone: "9876543210", ward: "Connaught Place", category: "Road & Potholes", priority: "Urgent", description: "Badi pothole hai Rohini sector 5 mein, 2 hafte se fix nahi hua", status: "Pending", daysAgo: 5 },
    { name: "Priya Verma", phone: "9123456789", ward: "Karol Bagh", category: "Garbage & Sanitation", priority: "Standard", description: "Kachra collection 3 din se nahi hua. Pura mohalla smell maar raha hai.", status: "Assigned", daysAgo: 2 },
    { name: "Amit Singh", phone: "9988776655", ward: "Dwarka", category: "Water Leakage", priority: "Urgent", description: "Main pipe burst near Dwarka Mor metro station. Paani barbaad ho raha hai.", status: "In Progress", daysAgo: 1 },
    { name: "Sunita Devi", phone: "9876501234", ward: "Rohini", category: "Streetlight", priority: "Standard", description: "Rohini Sector 22 mein street light nahi jal rahi. Raat ko andhera.", status: "Resolved", daysAgo: 3, resolutionPhotoUrl: "https://res.cloudinary.com/djgxnupog/image/upload/v1710000000/sample_resolved.jpg" },
    { name: "Manoj Kumar", phone: "9654321098", ward: "Saket", category: "Drainage", priority: "Urgent", description: "Nala overflow ho raha hai Saket mein. Baarish mein flooding. 10 din ho gaye koi nahi aaya.", status: "Pending", daysAgo: 10 },
    { name: "Rekha Yadav", phone: "9012345678", ward: "Lajpat Nagar", category: "Garbage & Sanitation", priority: "Standard", description: "Market area mein dustbin overflow. Tourists ko bhi dikkat.", status: "Assigned", daysAgo: 4 },
    { name: "Vikas Gupta", phone: "9876509876", ward: "Janakpuri", category: "Road & Potholes", priority: "Urgent", description: "C-block road completely broken. Accidents ho rahe hain daily.", status: "In Progress", daysAgo: 0 },
    { name: "Neha Agarwal", phone: "9988001122", ward: "Pitampura", category: "Water Leakage", priority: "Standard", description: "Underground pipe leak near park. Paani waste ho raha hai.", status: "Pending", daysAgo: 1 },
    { name: "Rajesh Mishra", phone: "9123401234", ward: "Mayur Vihar", category: "Streetlight", priority: "Urgent", description: "Phase 2 mein poori colony ki lights band hain. 1 week ho gaya.", status: "Pending", daysAgo: 7 },
    { name: "Kavita Sharma", phone: "9876543211", ward: "Vasant Kunj", category: "Drainage", priority: "Standard", description: "Drain block hai B-block mein. Machhar bahut aa rahe hain.", status: "Resolved", daysAgo: 2 },
    { name: "Deepak Chauhan", phone: "9012300123", ward: "Connaught Place", category: "Other", priority: "Standard", description: "Footpath tiles broken near N-block. Senior citizens ko problem. 6 din ho gaye.", status: "Assigned", daysAgo: 6 },
    { name: "Anita Rawat", phone: "9654300654", ward: "Dwarka", category: "Garbage & Sanitation", priority: "Urgent", description: "Hospital ke bahar kachra dheer laga hai. Health hazard. Bahut din ho gaye.", status: "Pending", daysAgo: 8 },
    { name: "Sanjay Tiwari", phone: "9988770011", ward: "Rohini", category: "Road & Potholes", priority: "Standard", description: "Sector 15 main road pe speed breaker tuta hua hai.", status: "In Progress", daysAgo: 5 },
    { name: "Geeta Rani", phone: "9876123456", ward: "Karol Bagh", category: "Water Leakage", priority: "Urgent", description: "Borewell overflow ho raha hai. Gali mein paani bhar gaya. 4 din se koi nahi aaya.", status: "Assigned", daysAgo: 4 },
    { name: "Pankaj Verma", phone: "9123456700", ward: "Saket", category: "Streetlight", priority: "Standard", description: "Park ke andar sab lights band hain. Evening walk nahi ho paati.", status: "Resolved", daysAgo: 1 },
];

async function seedData() {
    try {
        for (const item of sampleComplaints) {
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - item.daysAgo);

            const trackingId = `JS-${format(createdAt, "yyyyMMdd")}-${String(Math.floor(1000 + Math.random() * 9000))}`;

            await addDoc(collection(db, "complaints"), {
                name: item.name,
                phone: item.phone,
                ward: item.ward,
                category: item.category,
                priority: item.priority,
                description: item.description,
                status: item.status,
                trackingId,
                createdAt: Timestamp.fromDate(createdAt),
                resolvedAt: item.status === "Resolved" ? Timestamp.fromDate(new Date()) : null,
                resolutionPhotoUrl: item.resolutionPhotoUrl || null,
            });
        }
        toast.success("15 sample complaints loaded!");
    } catch (error) {
        console.error("Seed error:", error);
        toast.error("Failed to load sample data.");
    }
}

// ============================================
// SLA HELPER
// ============================================
function getSlaInfo(complaint) {
    if (!complaint.createdAt) return { label: "—", color: "text-gray-500" };

    const createdDate = complaint.createdAt.toDate ? complaint.createdAt.toDate() : new Date(complaint.createdAt);
    const slaHours = complaint.priority === "Urgent" ? 24 : 72;
    const deadline = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
    const now = new Date();

    if (complaint.status === "Resolved") {
        return { label: <><CheckCircle size={14} className="inline mr-1 -mt-0.5" /> Met</>, color: "text-green-400" };
    }

    if (now > deadline) {
        return { label: <><AlertTriangle size={14} className="inline mr-1 -mt-0.5" /> Breached</>, color: "text-red-400", breached: true };
    }

    const hoursLeft = differenceInHours(deadline, now);
    const minsLeft = differenceInMinutes(deadline, now) % 60;

    if (hoursLeft > 0) {
        return { label: `${hoursLeft}hr ${minsLeft}m left`, color: "text-yellow-400" };
    }

    return { label: `${minsLeft}m left`, color: "text-yellow-400" };
}

// ============================================
// CUSTOM CHART TOOLTIP
// ============================================
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-dark-100 border border-dark-300 rounded-lg px-3 py-2 text-sm shadow-xl">
            <p className="text-gray-400 text-xs">{label}</p>
            <p className="text-white font-semibold">{payload[0].value} complaints</p>
        </div>
    );
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [seeding, setSeeding] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    // Resolve modal state
    const [resolveModal, setResolveModal] = useState({ open: false, complaintId: null });
    const [resolvePhoto, setResolvePhoto] = useState(null);
    const [resolvePhotoPreview, setResolvePhotoPreview] = useState(null);
    const [resolving, setResolving] = useState(false);

    // Filters
    const [filterStatus, setFilterStatus] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterWard, setFilterWard] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Detail modal state
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    // Auth listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Real-time complaints listener
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "complaints"), (snapshot) => {
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            // Sort by createdAt descending
            data.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime - aTime;
            });
            setComplaints(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Logout
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/admin", { replace: true });
    };

    // Update complaint status
    const handleStatusChange = async (id, newStatus) => {
        // Intercept "Resolved" to open the modal
        if (newStatus === "Resolved") {
            setResolveModal({ open: true, complaintId: id });
            return;
        }

        setUpdatingId(id);
        try {
            const updateData = { status: newStatus };
            await updateDoc(doc(db, "complaints", id), updateData);
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update status.");
        }
        setUpdatingId(null);
    };

    // Resolve modal: file pick
    const handleResolveFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setResolvePhoto(file);
        setResolvePhotoPreview(URL.createObjectURL(file));
    };

    // Resolve modal: cancel
    const cancelResolve = () => {
        setResolveModal({ open: false, complaintId: null });
        setResolvePhoto(null);
        setResolvePhotoPreview(null);
    };

    // Resolve modal: confirm
    const confirmResolve = async () => {
        const { complaintId } = resolveModal;
        if (!complaintId) return;

        setResolving(true);
        try {
            let resolutionPhotoUrl = null;

            // Upload to Cloudinary if photo selected
            if (resolvePhoto) {
                const formData = new FormData();
                formData.append("file", resolvePhoto);
                formData.append("upload_preset", "Jansamadhan");

                const res = await fetch(
                    "https://api.cloudinary.com/v1_1/djgxnupog/image/upload",
                    { method: "POST", body: formData }
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.error?.message || "Upload failed");
                resolutionPhotoUrl = data.secure_url;
            }

            // Update Firestore
            await updateDoc(doc(db, "complaints", complaintId), {
                status: "Resolved",
                resolvedAt: serverTimestamp(),
                resolutionPhotoUrl,
            });

            toast.success("Complaint marked as Resolved!");
            cancelResolve();
        } catch (error) {
            console.error("Resolve error:", error);
            toast.error("Failed to resolve complaint.");
        } finally {
            setResolving(false);
        }
    };

    // Seed handler
    const handleSeed = async () => {
        setSeeding(true);
        await seedData();
        setSeeding(false);
    };

    // Filtered complaints
    const filtered = complaints.filter((c) => {
        if (filterStatus && c.status !== filterStatus) return false;
        if (filterCategory && c.category !== filterCategory) return false;
        if (filterWard && c.ward !== filterWard) return false;
        if (searchQuery && !c.trackingId?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    // Stats
    const totalCount = complaints.length;
    const pendingCount = complaints.filter((c) => c.status === "Pending").length;
    const inProgressCount = complaints.filter((c) => c.status === "Assigned" || c.status === "In Progress").length;
    const resolvedTodayCount = complaints.filter((c) => {
        if (c.status !== "Resolved" || !c.resolvedAt) return false;
        const resolved = c.resolvedAt.toDate ? c.resolvedAt.toDate() : new Date(c.resolvedAt);
        const today = new Date();
        return (
            resolved.getDate() === today.getDate() &&
            resolved.getMonth() === today.getMonth() &&
            resolved.getFullYear() === today.getFullYear()
        );
    }).length;

    // Chart data — Complaints by Category
    const categoryData = CATEGORIES.map((cat) => ({
        name: cat.length > 12 ? cat.substring(0, 12) + "…" : cat,
        count: complaints.filter((c) => c.category === cat).length,
    }));

    // Chart data — Top 5 Wards
    const wardCounts = WARDS.map((ward) => ({
        name: ward,
        count: complaints.filter((c) => c.ward === ward).length,
    }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const clearFilters = () => {
        setFilterStatus("");
        setFilterCategory("");
        setFilterWard("");
        setSearchQuery("");
    };

    const hasActiveFilters = filterStatus || filterCategory || filterWard || searchQuery;

    return (
        <div className="min-h-screen bg-dark">
            {/* ============ HEADER ============ */}
            <header className="sticky top-0 z-50 bg-dark-100/90 backdrop-blur-xl border-b-2 border-gold/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                JS
                            </div>
                            <div>
                                <h1 className="flex items-center gap-2 text-white font-bold text-lg leading-tight">
                                    <BarChart2 className="text-[#1A73E8]" size={20} />
                                    MCD Command Center
                                </h1>
                                <p className="text-gray-500 text-xs">
                                    {format(currentTime, "EEEE, dd MMMM yyyy — hh:mm:ss a")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-gray-400 text-sm">
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* ============ STATS ROW ============ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Total Complaints", value: totalCount, icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
                        { label: "Pending", value: pendingCount, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                        { label: "In Progress", value: inProgressCount, icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10" },
                        { label: "Resolved Today", value: resolvedTodayCount, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="card flex items-center gap-4 animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                <stat.icon className={stat.color} size={22} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-gray-500 text-xs">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ============ FILTER BAR ============ */}
                <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="select-dark text-sm"
                        >
                            <option value="">All Statuses</option>
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="select-dark text-sm"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <select
                            value={filterWard}
                            onChange={(e) => setFilterWard(e.target.value)}
                            className="select-dark text-sm"
                        >
                            <option value="">All Wards</option>
                            {WARDS.map((w) => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Tracking ID..."
                                className="input-dark text-sm pl-9 font-mono"
                            />
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white border border-dark-300 hover:bg-dark-200 transition-all"
                            >
                                <X size={14} />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* ============ COMPLAINTS TABLE ============ */}
                <div className="card mb-6 overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold text-lg">
                            Complaints ({filtered.length})
                        </h2>
                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gold hover:bg-gold/10 border border-gold/20 transition-all disabled:opacity-50"
                        >
                            {seeding ? <Loader2 className="animate-spin" size={14} /> : <Database size={14} />}
                            {seeding ? "Loading..." : "Load Sample Data"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="animate-spin text-primary" size={28} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <AlertTriangle className="text-gray-600 mx-auto mb-3" size={40} />
                            <p className="text-gray-400 font-medium">No complaints found</p>
                            <p className="text-gray-600 text-sm mt-1">
                                {hasActiveFilters ? "Try adjusting your filters." : "Load sample data to get started."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-dark-300">
                                        {["Tracking ID", "Name", "Category", "Ward", "Priority", "Status", "Filed", "SLA", "Action"].map(
                                            (header) => (
                                                <th
                                                    key={header}
                                                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                >
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-300/50">
                                    {filtered.map((c) => {
                                        const sla = getSlaInfo(c);
                                        const filedDate = c.createdAt?.toDate
                                            ? format(c.createdAt.toDate(), "dd MMM, hh:mm a")
                                            : "—";

                                        return (
                                            <tr
                                                key={c.id}
                                                onClick={() => setSelectedComplaint(c)}
                                                className={`hover:bg-dark-200/50 transition-colors cursor-pointer ${updatingId === c.id ? "opacity-50" : ""
                                                    }`}
                                            >
                                                <td className="px-6 py-3">
                                                    <span className="font-mono text-sm text-primary font-medium">
                                                        {c.trackingId}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-300">
                                                    {c.name}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-400">
                                                    {c.category}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-400">
                                                    {c.ward}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <StatusBadge status={c.priority} type="priority" />
                                                </td>
                                                <td className="px-6 py-3">
                                                    <StatusBadge status={c.status} />
                                                    {sla.breached && (
                                                        <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-red-400">
                                                            <ArrowUpCircle size={10} /> Escalated
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap">
                                                    {filedDate}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className={`text-xs font-medium whitespace-nowrap ${sla.color}`}>
                                                        {sla.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <select
                                                        value={c.status}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusChange(c.id, e.target.value);
                                                        }}
                                                        disabled={updatingId === c.id}
                                                        className="bg-dark-200 border border-dark-300 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                                                    >
                                                        {STATUSES.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ============ ANALYTICS SECTION ============ */}
                {complaints.length > 0 && (
                    <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                        <h2 className="text-white font-semibold text-lg mb-4">
                            Ward & Category Analytics
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Chart 1: Complaints by Category */}
                            <div className="card">
                                <h3 className="text-gray-300 font-medium text-sm mb-4">
                                    Complaints by Category
                                </h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={categoryData} barSize={32}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: "#9CA3AF", fontSize: 11 }}
                                            axisLine={{ stroke: "#3A3A3A" }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: "#9CA3AF", fontSize: 11 }}
                                            axisLine={{ stroke: "#3A3A3A" }}
                                            tickLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(26, 115, 232, 0.05)" }} />
                                        <Bar dataKey="count" fill="#1A73E8" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Chart 2: Top 5 Wards */}
                            <div className="card">
                                <h3 className="text-gray-300 font-medium text-sm mb-4">
                                    Top Wards by Complaints
                                </h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={wardCounts} barSize={32}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: "#9CA3AF", fontSize: 11 }}
                                            axisLine={{ stroke: "#3A3A3A" }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: "#9CA3AF", fontSize: 11 }}
                                            axisLine={{ stroke: "#3A3A3A" }}
                                            tickLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(201, 168, 76, 0.05)" }} />
                                        <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ============ COMPLAINT DETAIL MODAL ============ */}
            {selectedComplaint && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedComplaint(null)}>
                    <div
                        className="bg-dark-100 border border-dark-300 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="font-mono text-[#1A73E8] text-lg font-bold">{selectedComplaint.trackingId}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Filed {selectedComplaint.createdAt?.toDate ? format(selectedComplaint.createdAt.toDate(), "dd MMM yyyy, hh:mm a") : "—"}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="p-1.5 rounded-lg hover:bg-dark-200 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Status & Priority badges */}
                        <div className="flex items-center gap-3 mb-6">
                            <StatusBadge status={selectedComplaint.status} />
                            <StatusBadge status={selectedComplaint.priority} type="priority" />
                            {(() => {
                                const sla = getSlaInfo(selectedComplaint);
                                return sla.breached ? (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/30">
                                        <ArrowUpCircle size={12} /> Escalated
                                    </span>
                                ) : null;
                            })()}
                        </div>

                        {/* SLA info */}
                        {(() => {
                            const sla = getSlaInfo(selectedComplaint);
                            return (
                                <div className={`rounded-lg px-4 py-2.5 mb-6 text-xs font-medium ${sla.color} ${
                                    sla.breached ? "bg-red-500/10 border border-red-500/30" : sla.color.includes("green") ? "bg-green-500/10 border border-green-500/30" : "bg-yellow-500/10 border border-yellow-500/30"
                                }`}>
                                    {sla.label}
                                </div>
                            );
                        })()}

                        {/* Detail grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="flex items-start gap-3 bg-dark-200 rounded-xl p-3 border border-dark-300">
                                <User size={16} className="text-[#1A73E8] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-xs">Complainant</p>
                                    <p className="text-white text-sm font-medium">{selectedComplaint.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-dark-200 rounded-xl p-3 border border-dark-300">
                                <Phone size={16} className="text-[#1A73E8] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-xs">Phone</p>
                                    <p className="text-white text-sm font-medium">{selectedComplaint.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-dark-200 rounded-xl p-3 border border-dark-300">
                                <Tag size={16} className="text-[#1A73E8] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-xs">Category</p>
                                    <p className="text-white text-sm font-medium">{selectedComplaint.category}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-dark-200 rounded-xl p-3 border border-dark-300">
                                <MapPin size={16} className="text-[#1A73E8] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-xs">Ward</p>
                                    <p className="text-white text-sm font-medium">{selectedComplaint.ward}</p>
                                </div>
                            </div>
                            {selectedComplaint.location && (
                                <div className="flex items-start gap-3 bg-dark-200 rounded-xl p-3 border border-dark-300 sm:col-span-2">
                                    <MapPin size={16} className="text-[#1A73E8] mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-gray-400 text-xs">Location</p>
                                        <p className="text-white text-sm font-medium">{selectedComplaint.location}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2">
                                <FileText size={14} />
                                Description
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed bg-dark-200 rounded-xl p-4 border border-dark-300">
                                {selectedComplaint.description}
                            </p>
                        </div>

                        {/* Photos */}
                        {(selectedComplaint.complaintPhotoUrl || selectedComplaint.resolutionPhotoUrl) && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-3">
                                    <Camera size={14} />
                                    Photos
                                </div>
                                <div className={`grid gap-3 ${selectedComplaint.complaintPhotoUrl && selectedComplaint.resolutionPhotoUrl ? "grid-cols-2" : "grid-cols-1"}`}>
                                    {selectedComplaint.complaintPhotoUrl && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1.5">Issue Photo</p>
                                            <img src={selectedComplaint.complaintPhotoUrl} alt="Issue" className="w-full max-h-[180px] object-cover rounded-xl border border-dark-300" />
                                        </div>
                                    )}
                                    {selectedComplaint.resolutionPhotoUrl && (
                                        <div>
                                            <p className="text-xs text-green-400 mb-1.5">Resolution Proof</p>
                                            <img src={selectedComplaint.resolutionPhotoUrl} alt="Resolution" className="w-full max-h-[180px] object-cover rounded-xl border border-dark-300" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action */}
                        <div className="flex items-center gap-3 pt-4 border-t border-dark-300">
                            <span className="text-gray-400 text-sm shrink-0">Update Status:</span>
                            <select
                                value={selectedComplaint.status}
                                onChange={(e) => {
                                    handleStatusChange(selectedComplaint.id, e.target.value);
                                    if (e.target.value !== "Resolved") {
                                        setSelectedComplaint((prev) => prev ? { ...prev, status: e.target.value } : null);
                                    }
                                }}
                                disabled={updatingId === selectedComplaint.id}
                                className="flex-1 bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                            >
                                {STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-300 border border-dark-300 hover:bg-dark-200 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============ RESOLVE MODAL ============ */}
            {resolveModal.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-dark-100 border border-dark-300 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-fade-in-up">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <CheckCircle className="text-green-400" size={22} />
                                Mark as Resolved
                            </h2>
                            <button
                                onClick={cancelResolve}
                                className="p-1.5 rounded-lg hover:bg-dark-200 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            Optionally upload resolution proof photo
                        </p>

                        {/* Upload area */}
                        {resolvePhotoPreview ? (
                            <div className="relative mb-6">
                                <img
                                    src={resolvePhotoPreview}
                                    alt="Resolution proof preview"
                                    className="w-full max-h-[250px] object-cover rounded-xl border border-dark-300"
                                />
                                <button
                                    onClick={() => {
                                        setResolvePhoto(null);
                                        setResolvePhotoPreview(null);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-dark/80 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-dark-300 hover:border-primary/50 rounded-xl p-8 mb-6 cursor-pointer transition-colors group">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <ImagePlus className="text-primary" size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-300 text-sm font-medium">
                                        Click to upload photo
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        JPG, PNG or WEBP · Max 10MB
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleResolveFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {/* Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={cancelResolve}
                                disabled={resolving}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 border border-dark-300 hover:bg-dark-200 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmResolve}
                                disabled={resolving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1A73E8] hover:bg-[#1558b0] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-60"
                            >
                                {resolving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        {resolvePhoto ? "Uploading..." : "Resolving..."}
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Confirm Resolution
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
