import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { WARDS, CATEGORIES } from "../utils/constants";
import { generateTrackingId } from "../utils/generateId";
import { classifyComplaint } from "../services/geminiClassifier";
import {
    CheckCircle,
    Copy,
    Loader2,
    Phone,
    Clock,
    ShieldCheck,
    ArrowRight,
    ChevronRight,
    Zap,
    Eye,
    FileText,
    Bot,
    ClipboardList,
    AlertTriangle,
    PartyPopper,
    ImagePlus,
    X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── Initial form state ── */
const INITIAL = {
    name: "",
    phone: "",
    ward: "",
    category: "",
    priority: "Standard",
    description: "",
    location: "",
};

function FileComplaint() {
    const navigate = useNavigate();

    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null); // null | { trackingId, priority }
    const [copied, setCopied] = useState(false);

    /* ── AI Classification State ── */
    const [aiClassifying, setAiClassifying] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);

    /* ── Photo upload state ── */
    const [complaintPhoto, setComplaintPhoto] = useState(null);
    const [complaintPhotoPreview, setComplaintPhotoPreview] = useState(null);

    /* ── Helpers ── */
    const set = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));

        // If user manually changes category or priority after AI classified,
        // keep the banner but note that user has overridden
        if (
            aiSuggestion &&
            (key === "category" || key === "priority")
        ) {
            setAiSuggestion((prev) => ({ ...prev, userOverridden: true }));
        }
    };

    /* ── AI Classification Handler ── */
    const handleDescriptionBlur = async () => {
        const desc = form.description.trim();
        if (desc.length <= 20) return;

        setAiClassifying(true);
        try {
            const result = await classifyComplaint(desc);
            if (result) {
                setForm((prev) => ({
                    ...prev,
                    category: result.category,
                    priority: result.priority,
                }));
                setAiSuggestion({
                    category: result.category,
                    priority: result.priority,
                    userOverridden: false,
                });
                // Clear any existing category/priority errors
                setErrors((prev) => ({
                    ...prev,
                    category: "",
                    priority: "",
                }));
            }
        } catch (err) {
            console.error("AI classification failed:", err);
        } finally {
            setAiClassifying(false);
        }
    };

    /* ── Validation ── */
    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!form.phone.trim()) e.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(form.phone.trim()))
            e.phone = "Enter a valid 10-digit mobile number";
        if (!form.ward) e.ward = "Please select a ward";
        if (!form.category) e.category = "Please select a category";
        if (!form.description.trim())
            e.description = "Description is required";
        else if (form.description.trim().length < 20)
            e.description = "Minimum 20 characters required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ── Photo file handler ── */
    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, photo: "Max file size is 10MB" }));
            return;
        }
        setErrors((prev) => ({ ...prev, photo: "" }));
        setComplaintPhoto(file);
        setComplaintPhotoPreview(URL.createObjectURL(file));
    };

    const removePhoto = () => {
        setComplaintPhoto(null);
        setComplaintPhotoPreview(null);
    };

    /* ── Submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            // If description hasn't been classified yet, classify now before saving
            let finalCategory = form.category;
            let finalPriority = form.priority;
            let wasAiClassified = !!aiSuggestion;

            if (!aiSuggestion && form.description.trim().length > 20) {
                const result = await classifyComplaint(
                    form.description.trim()
                );
                if (result) {
                    finalCategory = result.category;
                    finalPriority = result.priority;
                    wasAiClassified = true;
                    setForm((prev) => ({
                        ...prev,
                        category: result.category,
                        priority: result.priority,
                    }));
                    setAiSuggestion({
                        category: result.category,
                        priority: result.priority,
                        userOverridden: false,
                    });
                }
            }

            // Upload photo to Cloudinary if selected
            let complaintPhotoUrl = null;
            if (complaintPhoto) {
                const fd = new FormData();
                fd.append("file", complaintPhoto);
                fd.append("upload_preset", "Jansamadhan");
                const res = await fetch(
                    "https://api.cloudinary.com/v1_1/djgxnupog/image/upload",
                    { method: "POST", body: fd }
                );
                const data = await res.json();
                complaintPhotoUrl = data.secure_url;
            }

            const trackingId = generateTrackingId();
            await addDoc(collection(db, "complaints"), {
                trackingId,
                name: form.name.trim(),
                phone: form.phone.trim(),
                ward: form.ward,
                category: finalCategory || form.category,
                description: form.description.trim(),
                location: form.location.trim(),
                priority: finalPriority || form.priority,
                status: "Pending",
                aiClassified: wasAiClassified,
                createdAt: serverTimestamp(),
                resolvedAt: null,
                complaintPhotoUrl,
            });
            setSuccess({
                trackingId,
                priority: finalPriority || form.priority,
            });
        } catch (err) {
            console.error("Firestore error:", err);
            setErrors({ form: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Copy helper ── */
    const copyId = () => {
        if (!success) return;
        navigator.clipboard.writeText(success.trackingId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    /* ── File another ── */
    const fileAnother = () => {
        setForm(INITIAL);
        setErrors({});
        setSuccess(null);
        setAiSuggestion(null);
        setAiClassifying(false);
        setComplaintPhoto(null);
        setComplaintPhotoPreview(null);
    };

    /* ═══════════════════════ RENDER ═══════════════════════ */
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* ── Page Header ── */}
                <div className="mb-10">
                    {/* Breadcrumb */}
                    <nav className="flex items-center text-sm text-gray-400 mb-3 gap-1">
                        <Link
                            to="/"
                            className="hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-200">File Complaint</span>
                    </nav>

                    <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold mb-2">
                        <FileText className="text-[#1A73E8]" size={32} />
                        File a Complaint
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Your complaint will be assigned a unique tracking ID and
                        forwarded to the concerned ward officer
                    </p>
                </div>

                {/* ── Two-Column Layout ── */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ───────── LEFT: Form / Success ───────── */}
                    <div className="lg:w-[60%]">
                        {success ? (
                            /* ── SUCCESS SCREEN ── */
                            <div className="bg-dark-100 border border-dark-300 rounded-2xl p-8 sm:p-10 text-center">
                                {/* Animated checkmark */}
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 animate-bounce">
                                    <CheckCircle
                                        size={48}
                                        className="text-green-400"
                                    />
                                </div>

                                <h2 className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-bold mb-2">
                                    Complaint Filed Successfully!
                                    <PartyPopper className="text-gold" size={32} />
                                </h2>
                                <p className="text-gray-400 mb-8">
                                    Save this ID — you&apos;ll need it to track
                                    your complaint
                                </p>

                                {/* Tracking ID box */}
                                <div className="bg-[#0A0A0A] border-2 border-gold rounded-xl p-5 inline-flex items-center gap-4 mb-6">
                                    <span className="text-gold text-2xl sm:text-3xl font-mono font-bold tracking-wider">
                                        {success.trackingId}
                                    </span>
                                    <button
                                        onClick={copyId}
                                        className="p-2 rounded-lg bg-dark-200 hover:bg-dark-300 transition-colors"
                                        title="Copy tracking ID"
                                    >
                                        <Copy
                                            size={18}
                                            className={
                                                copied
                                                    ? "text-green-400"
                                                    : "text-gray-400"
                                            }
                                        />
                                    </button>
                                </div>
                                {copied && (
                                    <p className="text-green-400 text-sm mb-4">
                                        Copied to clipboard!
                                    </p>
                                )}

                                {/* SLA info */}
                                <div className="flex items-center justify-center gap-2 text-gray-300 mb-8">
                                    <Clock size={16} className="text-gold" />
                                    <span className="text-sm">
                                        Expected resolution:{" "}
                                        <strong className="text-white">
                                            {success.priority === "Urgent"
                                                ? "24 hours"
                                                : "72 hours"}
                                        </strong>{" "}
                                        based on{" "}
                                        {success.priority.toLowerCase()}{" "}
                                        priority
                                    </span>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        to={`/track?id=${success.trackingId}`}
                                        className="inline-flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1558b0] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
                                    >
                                        Track This Complaint
                                        <ArrowRight size={18} />
                                    </Link>
                                    <button
                                        onClick={fileAnother}
                                        className="inline-flex items-center gap-2 border border-dark-300 hover:border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
                                    >
                                        File Another
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ── COMPLAINT FORM ── */
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="bg-dark-100 border border-dark-300 rounded-2xl p-6 sm:p-8 space-y-6"
                            >
                                {errors.form && (
                                    <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                                        {errors.form}
                                    </p>
                                )}

                                {/* 1. Full Name */}
                                <Field
                                    label="Full Name"
                                    required
                                    error={errors.name}
                                >
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            set("name", e.target.value)
                                        }
                                        placeholder="Enter your full name"
                                        className={inputClass(errors.name)}
                                    />
                                </Field>

                                {/* 2. Phone Number */}
                                <Field
                                    label="Phone Number"
                                    required
                                    error={errors.phone}
                                >
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            set(
                                                "phone",
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        maxLength={10}
                                        placeholder="10-digit mobile number"
                                        className={inputClass(errors.phone)}
                                    />
                                </Field>

                                {/* 3. Select Ward */}
                                <Field
                                    label="Select Ward"
                                    required
                                    error={errors.ward}
                                >
                                    <select
                                        value={form.ward}
                                        onChange={(e) =>
                                            set("ward", e.target.value)
                                        }
                                        className={inputClass(errors.ward)}
                                    >
                                        <option value="">
                                            Select your ward
                                        </option>
                                        {WARDS.map((w) => (
                                            <option key={w} value={w}>
                                                {w}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {/* 4. Complaint Category */}
                                <Field
                                    label="Complaint Category"
                                    required
                                    error={errors.category}
                                >
                                    <select
                                        value={form.category}
                                        onChange={(e) =>
                                            set("category", e.target.value)
                                        }
                                        className={inputClass(errors.category)}
                                    >
                                        <option value="">
                                            Select category
                                        </option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {/* 5. Priority */}
                                <Field label="Priority" required>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                set("priority", "Urgent")
                                            }
                                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                                form.priority === "Urgent"
                                                    ? "border-red-500 bg-red-500/10"
                                                    : "border-dark-300 hover:border-dark-200 bg-dark-200"
                                            }`}
                                        >
                                            <p className="flex items-center gap-2 font-semibold mb-1">
                                                <AlertTriangle size={18} />
                                                Urgent
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                Resolution within 24 hours
                                            </p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                set("priority", "Standard")
                                            }
                                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                                form.priority === "Standard"
                                                    ? "border-gray-400 bg-gray-400/10"
                                                    : "border-dark-300 hover:border-dark-200 bg-dark-200"
                                            }`}
                                        >
                                            <p className="flex items-center gap-2 font-semibold mb-1">
                                                <ClipboardList size={18} />
                                                Standard
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                Resolution within 72 hours
                                            </p>
                                        </button>
                                    </div>
                                </Field>

                                {/* 6. Description */}
                                <Field
                                    label="Complaint Description"
                                    required
                                    error={errors.description}
                                >
                                    <textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            set("description", e.target.value)
                                        }
                                        onBlur={handleDescriptionBlur}
                                        maxLength={500}
                                        rows={4}
                                        placeholder="Describe the issue in detail (minimum 20 characters)"
                                        className={`${inputClass(
                                            errors.description
                                        )} resize-none`}
                                    />
                                    <p
                                        className={`text-xs mt-1 ${
                                            form.description.length >= 20
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {form.description.length} / 500
                                        characters
                                    </p>

                                    {/* AI Classifying Indicator */}
                                    {aiClassifying && (
                                        <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <Loader2
                                                size={14}
                                                className="animate-spin text-blue-400"
                                            />
                                            <span className="flex items-center gap-2 text-blue-300 text-xs font-medium">
                                                <Bot size={14} />
                                                AI is classifying your complaint...
                                            </span>
                                        </div>
                                    )}

                                    {/* AI Classification Result Banner */}
                                    {aiSuggestion && !aiClassifying && (
                                        <div className="flex items-center justify-between mt-2 px-3 py-2 rounded-lg bg-[#1A237E] border border-[#283593]">
                                            <span className="flex items-center gap-2 text-white text-xs font-medium">
                                                <Bot size={14} className="text-[#1A73E8]" />
                                                AI Classified:{" "}
                                                <span className="font-bold">
                                                    {aiSuggestion.category}
                                                </span>{" "}
                                                ·{" "}
                                                <span className="font-bold">
                                                    {aiSuggestion.priority}
                                                </span>{" "}
                                                priority
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Scroll to category field and let user override
                                                    setAiSuggestion(
                                                        (prev) => ({
                                                            ...prev,
                                                            userOverridden: true,
                                                        })
                                                    );
                                                }}
                                                className="text-blue-300 text-xs hover:text-white transition-colors ml-3 shrink-0"
                                            >
                                                ✏️ Edit
                                            </button>
                                        </div>
                                    )}
                                </Field>

                                {/* 7. Location */}
                                <Field label="Location Details">
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) =>
                                            set("location", e.target.value)
                                        }
                                        placeholder="Street name, landmark, sector number"
                                        className={inputClass()}
                                    />
                                </Field>

                                {/* 8. Photo Upload (Optional) */}
                                <Field label="Upload Photo (Optional)">
                                    <p className="text-gray-500 text-xs mb-3">Attach a photo of the issue for better context</p>
                                    {complaintPhotoPreview ? (
                                        <div className="relative">
                                            <img
                                                src={complaintPhotoPreview}
                                                alt="Preview"
                                                className="w-full max-h-[200px] object-cover rounded-xl border border-dark-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removePhoto}
                                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-dark-300 rounded-xl cursor-pointer hover:border-[#1A73E8]/50 hover:bg-dark-200/30 transition-all">
                                            <ImagePlus size={32} className="text-gray-500" />
                                            <span className="text-gray-400 text-sm">Click to upload image</span>
                                            <span className="text-gray-600 text-xs">JPG, PNG — max 10MB</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {errors.photo && (
                                        <p className="text-red-400 text-xs mt-1">{errors.photo}</p>
                                    )}
                                </Field>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting || aiClassifying}
                                    className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1558b0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Complaint
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ───────── RIGHT: Info Panel ───────── */}
                    <div className="lg:w-[40%] space-y-6">
                        {/* Why File Online? */}
                        <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4 text-gold">
                                Why File Online?
                            </h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: (
                                            <Zap
                                                size={18}
                                                className="text-[#1A73E8]"
                                            />
                                        ),
                                        title: "Instant Processing",
                                        desc: "AI classifies and routes your complaint in seconds",
                                    },
                                    {
                                        icon: (
                                            <Eye
                                                size={18}
                                                className="text-[#1A73E8]"
                                            />
                                        ),
                                        title: "Full Transparency",
                                        desc: "Track every status change with real-time updates",
                                    },
                                    {
                                        icon: (
                                            <ShieldCheck
                                                size={18}
                                                className="text-[#1A73E8]"
                                            />
                                        ),
                                        title: "Accountability",
                                        desc: "Officers are held responsible with SLA deadlines",
                                    },
                                ].map((b) => (
                                    <div
                                        key={b.title}
                                        className="flex gap-3 items-start"
                                    >
                                        <div className="mt-0.5 p-2 rounded-lg bg-[#1A73E8]/10 shrink-0">
                                            {b.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {b.title}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {b.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What Happens Next? */}
                        <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4 text-gold">
                                What Happens Next?
                            </h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        step: "1",
                                        text: "You receive a unique tracking ID",
                                    },
                                    {
                                        step: "2",
                                        text: "AI assigns complaint to the right ward officer",
                                    },
                                    {
                                        step: "3",
                                        text: "Officer acknowledges & begins resolution",
                                    },
                                    {
                                        step: "4",
                                        text: "You get notified when issue is resolved",
                                    },
                                ].map((s, idx) => (
                                    <div
                                        key={s.step}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="relative flex flex-col items-center">
                                            <div className="w-7 h-7 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] flex items-center justify-center text-xs font-bold shrink-0">
                                                {s.step}
                                            </div>
                                            {idx < 3 && (
                                                <div className="w-px h-6 bg-dark-300 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-gray-300 text-sm mt-1">
                                            {s.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Need Help? */}
                        <div className="bg-dark-100 border border-dark-300 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-3 text-gold">
                                Need Help?
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <Phone
                                        size={18}
                                        className="text-green-400"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        MCD Helpline
                                    </p>
                                    <p className="text-xl font-bold text-white tracking-wider">
                                        155305
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

/* ═══════════ Reusable sub-components ═══════════ */

/** Labelled form field wrapper */
function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-200 mb-1.5">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-red-400 text-xs mt-1.5">{error}</p>
            )}
        </div>
    );
}

/** Shared Tailwind classes for inputs */
function inputClass(error) {
    return `w-full bg-dark-200 border ${
        error ? "border-red-500" : "border-dark-300"
    } rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/50 focus:border-[#1A73E8] transition-all duration-200`;
}

export default FileComplaint;
