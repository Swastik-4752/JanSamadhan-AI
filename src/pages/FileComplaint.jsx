import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { generateTrackingId } from "../utils/generateId";
import { CATEGORIES, WARDS, PRIORITIES } from "../utils/constants";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { Send, CheckCircle, Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function FileComplaint() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        ward: "",
        category: "",
        priority: "Standard",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [trackingId, setTrackingId] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newTrackingId = generateTrackingId();
            await addDoc(collection(db, "complaints"), {
                ...formData,
                trackingId: newTrackingId,
                status: "Pending",
                createdAt: serverTimestamp(),
                resolvedAt: null,
            });

            setTrackingId(newTrackingId);
            setSubmitted(true);
            toast.success("Complaint filed successfully!");
        } catch (error) {
            console.error("Error filing complaint:", error);
            toast.error("Failed to file complaint. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyTrackingId = () => {
        navigator.clipboard.writeText(trackingId);
        toast.success("Tracking ID copied!");
    };

    // Success State
    if (submitted) {
        return (
            <div className="min-h-screen bg-dark flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="card max-w-md w-full text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Complaint Filed!
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Your complaint has been registered successfully. Use the tracking
                            ID below to check status.
                        </p>

                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-4 mb-6">
                            <p className="text-xs text-gray-500 mb-1">Your Tracking ID</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-2xl font-bold font-mono text-primary">
                                    {trackingId}
                                </span>
                                <button
                                    onClick={copyTrackingId}
                                    className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-dark-300 transition-colors"
                                    title="Copy ID"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/track"
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                Track Complaint
                            </Link>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({
                                        name: "",
                                        phone: "",
                                        ward: "",
                                        category: "",
                                        priority: "Standard",
                                        description: "",
                                    });
                                }}
                                className="flex-1 py-2.5 px-6 rounded-lg font-semibold text-white border border-dark-300 hover:bg-dark-200 transition-all"
                            >
                                File Another
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white">File a Complaint</h1>
                    <p className="text-gray-500 mt-1">
                        Report a civic issue to MCD. You'll receive a tracking ID
                        immediately.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="card space-y-5 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Rahul Sharma"
                                className="input-dark"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 9876543210"
                                className="input-dark"
                            />
                        </div>
                    </div>

                    {/* Ward & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Ward <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                required
                                className="select-dark"
                            >
                                <option value="">Select Ward</option>
                                {WARDS.map((w) => (
                                    <option key={w} value={w}>
                                        {w}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="select-dark"
                            >
                                <option value="">Select Category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Priority
                        </label>
                        <div className="flex gap-4">
                            {PRIORITIES.map((p) => (
                                <label
                                    key={p}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${formData.priority === p
                                            ? p === "Urgent"
                                                ? "border-red-500/50 bg-red-500/10 text-red-400"
                                                : "border-primary/50 bg-primary/10 text-primary"
                                            : "border-dark-300 bg-dark-200 text-gray-400 hover:border-gray-500"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p}
                                        checked={formData.priority === p}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">{p}</span>
                                    <span className="text-xs text-gray-500">
                                        {p === "Urgent" ? "(24hr SLA)" : "(72hr SLA)"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe the issue in detail (e.g. location, severity, how long it's been there)..."
                            className="input-dark resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Submit Complaint
                            </>
                        )}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default FileComplaint;
