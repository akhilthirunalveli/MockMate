import React, { useState, useEffect } from "react";
import { Card, baseStyles } from "./AdminUI";
import { BASE_URL } from "../../../constants/apiPaths";
import { toast } from "react-hot-toast";

const ToastTab = () => {
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [message, setMessage] = useState("");
    const [order, setOrder] = useState(0);
    const [delay, setDelay] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchToasts();
    }, []);

    const fetchToasts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;
            const response = await fetch(`${BASE_URL}/api/admin/toasts`, { headers });
            const data = await response.json();
            setToasts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch toasts", error);
            toast.error("Failed to load toasts");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;

            const url = editingId
                ? `${BASE_URL}/api/admin/toasts/${editingId}`
                : `${BASE_URL}/api/admin/toasts`;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify({ message, order, delay, isActive }),
            });

            if (!response.ok) throw new Error("Failed to save toast");

            toast.success(editingId ? "Toast updated!" : "Toast added!");
            resetForm();
            fetchToasts();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (t) => {
        setMessage(t.message);
        setOrder(t.order);
        setDelay(t.delay);
        setIsActive(t.isActive);
        setEditingId(t._id);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this toast?")) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await fetch(`${BASE_URL}/api/admin/toasts/${id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) throw new Error("Failed to delete toast");

            toast.success("Toast deleted");
            fetchToasts();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setMessage("");
        setOrder(toasts.length);
        setDelay(0);
        setIsActive(true);
        setEditingId(null);
        setIsAdding(false);
    };

    return (
        <div style={{ paddingBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
                <h2 style={{
                    color: "#fff",
                    margin: 0,
                    fontFamily: baseStyles.fontFamily,
                    fontWeight: 500,
                    fontSize: "1.75rem",
                    letterSpacing: "-0.5px"
                }}>
                    Toast Management
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        padding: "0.6rem 1.2rem",
                        backgroundColor: isAdding ? "#333" : "#fff",
                        color: isAdding ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    {isAdding ? "Cancel" : "Add New Toast"}
                </button>
            </div>

            {isAdding && (
                <Card style={{ marginBottom: "2rem", backgroundColor: "#050505", border: "1px solid #222" }}>
                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
                        <div>
                            <label style={{ display: "block", color: "#666", marginBottom: "0.5rem", fontSize: "0.8rem", textTransform: "uppercase" }}>Toast Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter toast message..."
                                rows="3"
                                style={{ width: "100%", padding: "1rem", backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "8px", color: "#fff", outline: "none" }}
                                required
                            />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", color: "#666", marginBottom: "0.5rem", fontSize: "0.8rem", textTransform: "uppercase" }}>Sequence Order</label>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(parseInt(e.target.value))}
                                    style={{ width: "100%", padding: "0.8rem", backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "8px", color: "#fff", outline: "none" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", color: "#666", marginBottom: "0.5rem", fontSize: "0.8rem", textTransform: "uppercase" }}>Delay (ms)</label>
                                <input
                                    type="number"
                                    value={delay}
                                    onChange={(e) => setDelay(parseInt(e.target.value))}
                                    style={{ width: "100%", padding: "0.8rem", backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "8px", color: "#fff", outline: "none" }}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.5rem" }}>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    style={{ width: "20px", height: "20px", accentColor: "#fff" }}
                                />
                                <span style={{ color: "#fff" }}>Active</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ padding: "0.8rem 2rem", backgroundColor: "#fff", color: "#000", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
                            >
                                {loading ? "Saving..." : (editingId ? "Update Toast" : "Create Toast")}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <div style={{ display: "grid", gap: "1rem" }}>
                {toasts.length === 0 ? (
                    <div style={{ color: "#666", textAlign: "center", padding: "3rem" }}>No toasts configured yet.</div>
                ) : (
                    toasts.map((t) => (
                        <Card key={t._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#050505", border: "1px solid #222", padding: "1.2rem" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                                    <span style={{ backgroundColor: "#222", color: "#888", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>#{t.order}</span>
                                    <span style={{ backgroundColor: "#222", color: "#888", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>{t.delay}ms delay</span>
                                    {!t.isActive && <span style={{ backgroundColor: "#dc3545", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>INACTIVE</span>}
                                </div>
                                <p style={{ color: "#fff", margin: 0, fontSize: "1rem", lineHeight: "1.4" }}>{t.message}</p>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", marginLeft: "2rem" }}>
                                <button
                                    onClick={() => handleEdit(t)}
                                    style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#888", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#888"}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(t._id)}
                                    style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#dc3545", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#dc3545"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#333"}
                                >
                                    Delete
                                </button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ToastTab;
