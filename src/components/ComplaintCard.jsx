import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { MapPin, Clock, Tag } from "lucide-react";

/**
 * ComplaintCard — Displays a complaint summary in card format.
 * Used on citizen-facing pages (tracking, home).
 */
function ComplaintCard({ complaint }) {
    const {
        trackingId,
        name,
        category,
        ward,
        priority,
        status,
        description,
        createdAt,
    } = complaint;

    const formattedDate = createdAt?.toDate
        ? format(createdAt.toDate(), "dd MMM yyyy, hh:mm a")
        : "—";

    return (
        <div className="card-hover animate-fade-in-up">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <p className="text-xs text-gray-500 font-mono">{trackingId}</p>
                    <h3 className="text-white font-semibold mt-0.5">{name}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={priority} type="priority" />
                    <StatusBadge status={status} />
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                {description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <Tag size={12} />
                    {category}
                </span>
                <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {ward}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formattedDate}
                </span>
            </div>
        </div>
    );
}

export default ComplaintCard;
