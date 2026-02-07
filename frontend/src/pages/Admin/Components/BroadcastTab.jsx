import React, { useState } from "react";
import { Card, baseStyles } from "./AdminUI";
import { BASE_URL } from "../../../constants/apiPaths";
import { toast } from "react-hot-toast";

const QuickTemplates = [
    {
        label: "Maintenance",
        subject: "Scheduled Maintenance Notice",
        message: "We will be performing scheduled maintenance on [Date] from [Time] to [Time]."
    },
    {
        label: "New Feature",
        subject: "Exciting New Features Live!",
        message: "We've just launched new features to help you prepare better! Check out the new [Feature Name] in your dashboard."
    },
    {
        label: "Policy Update",
        subject: "Updates to Our Terms of Service",
        message: "We have updated our Terms of Service effective [Date]. Please review the changes here: [Link]"
    }
];

const BroadcastTab = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState(new Set());
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [sendToAll, setSendToAll] = useState(true);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    React.useEffect(() => {
        fetchUsers();
        fetchHistory();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;
            const response = await fetch(`${BASE_URL}/api/auth/users`, { headers });
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch users for broadcast", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;
            const response = await fetch(`${BASE_URL}/api/admin/broadcasts`, { headers });
            const data = await response.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch broadcast history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleUserSelect = (userId) => {
        const newSelected = new Set(selectedUserIds);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUserIds(newSelected);
        setSendToAll(false);
    };

    const applyTemplate = (template) => {
        setSubject(template.subject);
        setMessage(template.message);
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        if (!sendToAll && selectedUserIds.size === 0) {
            toast.error("Please select at least one user or choose 'Send to All'");
            return;
        }

        const targetText = sendToAll ? "ALL users" : `${selectedUserIds.size} selected users`;
        if (!window.confirm(`Are you sure you want to broadcast this message to ${targetText}?`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/admin/broadcast`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject,
                    message,
                    targetUserIds: sendToAll ? [] : Array.from(selectedUserIds)
                }),
            });

            if (!response.ok) throw new Error("Failed to send broadcast");

            toast.success("Broadcast sent successfully!");
            setSubject("");
            setMessage("");
            setSelectedUserIds(new Set());
            setSendToAll(true);
            fetchHistory(); // Refresh history
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: "2rem" }}>
            <h2 style={{
                color: "#fff",
                marginBottom: "2rem",
                fontFamily: baseStyles.fontFamily,
                fontWeight: 500,
                fontSize: "1.75rem",
                letterSpacing: "-0.5px",
                borderBottom: "1px solid #222",
                paddingBottom: "1rem"
            }}>
                System Broadcast
            </h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "2rem",
                alignItems: "start"
            }}>
                {/* Left Column: Compose */}
                <div>
                    <form onSubmit={handleBroadcast}>
                        <div style={{
                            display: "grid",
                            gap: "1.5rem",
                            backgroundColor: "#050505",
                            padding: "2rem",
                            borderRadius: "16px",
                            border: "1px solid #222"
                        }}>

                            {/* Target Selection */}
                            <div>
                                <label style={{ display: "block", color: "#666", marginBottom: "0.8rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Target Audience
                                </label>
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                                    <button
                                        type="button"
                                        onClick={() => { setSendToAll(true); setSelectedUserIds(new Set()); }}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            borderRadius: "8px",
                                            background: sendToAll ? "#fff" : "transparent",
                                            color: sendToAll ? "#000" : "#666",
                                            border: sendToAll ? "1px solid #fff" : "1px solid #333",
                                            cursor: "pointer",
                                            fontSize: "0.9rem",
                                            fontWeight: 500
                                        }}
                                    >
                                        All Users ({users.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSendToAll(false)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            borderRadius: "8px",
                                            background: !sendToAll ? "#fff" : "transparent",
                                            color: !sendToAll ? "#000" : "#666",
                                            border: !sendToAll ? "1px solid #fff" : "1px solid #333",
                                            cursor: "pointer",
                                            fontSize: "0.9rem",
                                            fontWeight: 500
                                        }}
                                    >
                                        Select Users
                                    </button>
                                </div>

                                {!sendToAll && (
                                    <div style={{
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        backgroundColor: "#0a0a0a",
                                        border: "1px solid #222",
                                        borderRadius: "8px",
                                        padding: "0.5rem"
                                    }}>
                                        {users.map(user => (
                                            <label key={user._id} style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                padding: "0.5rem",
                                                cursor: "pointer",
                                                transition: "background 0.2s"
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUserIds.has(user._id)}
                                                    onChange={() => handleUserSelect(user._id)}
                                                    style={{ accentColor: "#fff" }}
                                                />
                                                <span style={{ color: selectedUserIds.has(user._id) ? "#fff" : "#888" }}>
                                                    {user.name} <span style={{ color: "#444", fontSize: "0.8em" }}>({user.email})</span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Subject */}
                            <div>
                                <label style={{ display: "block", color: "#666", marginBottom: "0.8rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Subject Line
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Scheduled Maintenance Notice"
                                    style={{
                                        width: "100%",
                                        padding: "1rem",
                                        backgroundColor: "#0a0a0a",
                                        border: "1px solid #333",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        fontSize: "1rem",
                                        fontFamily: baseStyles.fontFamily,
                                        outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#666"}
                                    onBlur={e => e.target.style.borderColor = "#333"}
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label style={{ display: "block", color: "#666", marginBottom: "0.8rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Message Body
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Compose your global update..."
                                    rows="10"
                                    style={{
                                        width: "100%",
                                        padding: "1rem",
                                        backgroundColor: "#0a0a0a",
                                        border: "1px solid #333",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        fontSize: "1rem",
                                        fontFamily: baseStyles.fontFamily,
                                        resize: "vertical",
                                        outline: "none",
                                        transition: "border-color 0.2s",
                                        lineHeight: "1.6"
                                    }}
                                    onFocus={e => e.target.style.borderColor = "#666"}
                                    onBlur={e => e.target.style.borderColor = "#333"}
                                    required
                                />
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "1rem" }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: "0.9rem 2rem",
                                        backgroundColor: loading ? "#222" : "#fff",
                                        color: "#000",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        cursor: loading ? "not-allowed" : "pointer",
                                        transition: "transform 0.1s, opacity 0.2s",
                                        opacity: loading ? 0.7 : 1
                                    }}
                                    onMouseEnter={e => !loading && (e.currentTarget.style.opacity = "0.9")}
                                    onMouseLeave={e => !loading && (e.currentTarget.style.opacity = "1")}
                                    onMouseDown={e => !loading && (e.currentTarget.style.transform = "scale(0.98)")}
                                    onMouseUp={e => !loading && (e.currentTarget.style.transform = "scale(1)")}
                                >
                                    {loading ? "Broadcasting..." : "Send Broadcast"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Templates & History */}
                <div style={{ display: "grid", gap: "2rem", alignContent: "start" }}>

                    {/* Quick Templates */}
                    <div style={{
                        backgroundColor: "#050505",
                        border: "1px solid #222",
                        borderRadius: "16px",
                        padding: "1.5rem"
                    }}>
                        <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            Quick Templates
                        </h3>
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                            {QuickTemplates.map((t, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => applyTemplate(t)}
                                    style={{
                                        textAlign: "left",
                                        backgroundColor: "#0a0a0a",
                                        border: "1px solid #333",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "8px",
                                        color: "#ccc",
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = "#666";
                                        e.currentTarget.style.backgroundColor = "#111";
                                        e.currentTarget.style.color = "#fff";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = "#333";
                                        e.currentTarget.style.backgroundColor = "#0a0a0a";
                                        e.currentTarget.style.color = "#ccc";
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* History */}
                    <div style={{
                        backgroundColor: "#050505",
                        border: "1px solid #222",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        maxHeight: "500px",
                        overflowY: "auto"
                    }}>
                        <h3 style={{ color: "#fff", fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            Recent Broadcasts
                        </h3>

                        {loadingHistory ? (
                            <div style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>Loading...</div>
                        ) : history.length === 0 ? (
                            <div style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>No broadcasts sent yet.</div>
                        ) : (
                            <div style={{ display: "grid", gap: "1rem" }}>
                                {history.map((item) => (
                                    <div key={item._id} style={{
                                        borderBottom: "1px solid #1a1a1a",
                                        paddingBottom: "1rem"
                                    }}>
                                        <div style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.25rem" }}>
                                            {item.subject}
                                        </div>
                                        <div style={{ color: "#666", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            <span>
                                                {item.targetAudience === "ALL" ? "All Users" : `${item.recipientCount} Users`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BroadcastTab;
