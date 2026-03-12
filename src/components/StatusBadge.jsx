/**
 * StatusBadge — Color-coded badge for complaint statuses and priorities.
 *
 * Usage:
 *   <StatusBadge status="Pending" />
 *   <StatusBadge status="Urgent" type="priority" />
 */

function StatusBadge({ status, type = "status" }) {
    const getStyles = () => {
        if (type === "priority") {
            switch (status) {
                case "Urgent":
                    return "bg-red-500/15 text-red-400 border-red-500/30";
                case "Standard":
                    return "bg-gray-500/15 text-gray-400 border-gray-500/30";
                default:
                    return "bg-gray-500/15 text-gray-400 border-gray-500/30";
            }
        }

        // Status badges
        switch (status) {
            case "Pending":
                return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
            case "Assigned":
                return "bg-blue-500/15 text-blue-400 border-blue-500/30";
            case "In Progress":
                return "bg-orange-500/15 text-orange-400 border-orange-500/30";
            case "Resolved":
                return "bg-green-500/15 text-green-400 border-green-500/30";
            default:
                return "bg-gray-500/15 text-gray-400 border-gray-500/30";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}
        >
            {status}
        </span>
    );
}

export default StatusBadge;
