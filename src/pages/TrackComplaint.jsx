import { useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ComplaintCard from "../components/ComplaintCard";
import { Search, ArrowLeft, FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

function TrackComplaint() {
    const [searchId, setSearchId] = useState("");
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoading(true);
        setSearched(true);
        setComplaint(null);

        try {
            const q = query(
                collection(db, "complaints"),
                where("trackingId", "==", searchId.trim().toUpperCase())
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                setComplaint({ id: doc.id, ...doc.data() });
            }
        } catch (error) {
            console.error("Error tracking complaint:", error);
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-bold text-white">Track Complaint</h1>
                    <p className="text-gray-500 mt-1">
                        Enter your tracking ID to check the current status of your
                        complaint.
                    </p>
                </div>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className="card mb-6 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Tracking ID
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="e.g. JS-20260312-4752"
                            className="input-dark flex-1 font-mono"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 px-6"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                            ) : (
                                <Search size={18} />
                            )}
                            Search
                        </button>
                    </div>
                </form>

                {/* Result */}
                {searched && !loading && (
                    <div className="animate-fade-in-up">
                        {complaint ? (
                            <ComplaintCard complaint={complaint} />
                        ) : (
                            <div className="card text-center py-12">
                                <FileQuestion className="text-gray-600 mx-auto mb-3" size={48} />
                                <p className="text-gray-400 font-medium">No complaint found</p>
                                <p className="text-gray-600 text-sm mt-1">
                                    Double-check your tracking ID and try again.
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

export default TrackComplaint;
