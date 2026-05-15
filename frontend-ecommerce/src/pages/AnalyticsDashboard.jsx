import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API = "http://localhost:9090/api/analytics";
const COLORS = ["#FF5E00", "#FF7A2E", "#4CAF50", "#E24B4A", "#06b6d4"];

async function fetchWithTimeout(url, options, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try { const response = await fetch(url, { ...options, signal: controller.signal }); clearTimeout(id); if (!response.ok) return []; return await response.json(); }
    catch (error) { clearTimeout(id); return []; }
}

function KpiCard({ title, value, subtitle, color }) {
    return (
        <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.04)", padding: "20px 24px", borderLeft: `4px solid ${color}` }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#6B6B6B", marginBottom: 6 }}>{title}</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600, color: "#fff" }}>{value}</div>
            {subtitle && <div style={{ fontSize: 11, color: "#6B6B6B", marginTop: 4 }}>{subtitle}</div>}
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 500, color: "#fff", margin: "28px 0 14px", paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{children}</h2>
    );
}

export default function AnalyticsDashboard() {
    const [sales, setSales] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [rtSales, setRtSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        const options = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
        Promise.all([
            fetchWithTimeout(`${API}/sales-by-category`, options),
            fetchWithTimeout(`${API}/reviews-by-category`, options),
            fetchWithTimeout(`${API}/revenue-by-month`, options),
        ]).then(([s, r, rev]) => {
            const allSales = Array.isArray(s) ? s : [];
            setSales(allSales.filter(d => d.source === "historical"));
            setRtSales(allSales.filter(d => d.source === "realtime"));
            const reviewData = Array.isArray(r) ? r : [];
            setReviews(reviewData.filter(d => d.rowKey && d.rowKey.startsWith("hist_score_")).sort((a, b) => a.rowKey?.localeCompare(b.rowKey)));
            setRevenue(Array.isArray(rev) ? rev.sort((a, b) => (a.month || "").localeCompare(b.month || "")) : []);
            setLoading(false);
        });
    }, []);

    const totalRevenue = sales.reduce((acc, d) => acc + parseFloat(d.total_revenue || 0), 0);
    const totalOrders = sales.reduce((acc, d) => acc + parseInt(d.total_orders || 0), 0);
    const totalProducts = sales.length;
    const totalReviews = reviews.reduce((acc, d) => acc + parseInt(d.total_reviews || 0), 0);
    const avgRating = totalReviews > 0 ? (reviews.reduce((acc, d) => acc + parseFloat(d.avg_rating || 0) * parseInt(d.total_reviews || 0), 0) / totalReviews).toFixed(2) : "—";

    const top10Products = [...sales].sort((a, b) => parseFloat(b.total_revenue || 0) - parseFloat(a.total_revenue || 0)).slice(0, 10).map(d => ({
        name: (d.product_id || d.rowKey?.replace("hist_product_", "") || "—").slice(0, 10),
        revenue: parseFloat(d.total_revenue || 0),
        orders: parseInt(d.total_orders || 0),
    }));

    const top10ByOrders = [...sales].sort((a, b) => parseInt(b.total_orders || 0) - parseInt(a.total_orders || 0)).slice(0, 10).map(d => ({
        name: (d.product_id || d.rowKey?.replace("hist_product_", "") || "—").slice(0, 10),
        orders: parseInt(d.total_orders || 0),
    }));

    const revenueData = revenue.map(d => ({ month: d.month || d.rowKey?.replace("hist_", "") || "—", orders: parseInt(d.total_orders || 0) }));
    const reviewsPieData = reviews.map(d => ({ name: `Note ${d.rowKey?.replace("hist_score_", "") || "?"}`, value: parseInt(d.total_reviews || 0), score: parseInt(d.rowKey?.replace("hist_score_", "") || 0) }));

    const rtData = rtSales.sort((a, b) => parseFloat(b.total_revenue || 0) - parseFloat(a.total_revenue || 0)).map(d => ({
        name: d.category || d.rowKey?.replace("rt_", "") || "—",
        revenue: parseFloat(d.total_revenue || 0),
        orders: parseInt(d.total_orders || 0),
    }));

    if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#6B6B6B", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>Chargement des analytics...</div>;

    return (
        <>
            <style>{`
                .fa-root { font-family: 'Inter', sans-serif; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: #FF5E00; border-radius: 2px; }
                .fa-table { width: 100%; border-collapse: collapse; font-size: 13px; }
                .fa-table th { padding: 12px 16px; text-align: left; font-weight: 500; color: #6B6B6B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); }
                .fa-table td { padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.03); }
            `}</style>
            <div className="fa-root" style={{ padding: "0", margin: "0 auto" }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, fontWeight: 500, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                        Dashboard <span style={{ color: "#FF5E00" }}>Analytics</span>
                    </h1>
                    <div style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>
                        Données historiques Olist (99k commandes) + données temps réel Spring Boot
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                    <KpiCard title="Revenu total (hist.)" value={`$${(totalRevenue/1000000).toFixed(2)}M`} subtitle={`${totalProducts} produits`} color="#FF5E00"/>
                    <KpiCard title="Commandes totales" value={totalOrders.toLocaleString()} subtitle="Données Olist" color="#4CAF50"/>
                    <KpiCard title="Note moyenne" value={`${avgRating} / 5`} subtitle={`${totalReviews.toLocaleString()} avis`} color="#FF7A2E"/>
                    <KpiCard title="Données temps réel" value={rtSales.length} subtitle="Catégories actives" color="#06b6d4"/>
                </div>

                <SectionTitle>Évolution des commandes par mois (Olist)</SectionTitle>
                <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.04)", padding: 20 }}>
                    {revenueData.length === 0 ? <div style={{ textAlign: "center", color: "#6B6B6B", padding: 40 }}>Aucune donnée</div> :
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
                                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} />
                                <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Line type="monotone" dataKey="orders" stroke="#FF5E00" strokeWidth={2} dot={false} name="Commandes" />
                            </LineChart>
                        </ResponsiveContainer>
                    }
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
                    <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.04)", padding: 20 }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 500, marginBottom: 14, color: "#fff", textTransform: "uppercase" }}>Top 10 produits — Revenu</div>
                        {top10Products.length === 0 ? <div style={{ textAlign: "center", color: "#6B6B6B", padding: 40 }}>Aucune donnée</div> :
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={top10Products} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis type="number" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
                                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: "#6B6B6B" }} />
                                    <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, fontSize: 12 }} formatter={(v) => [`$${v.toFixed(2)}`, "Revenu"]} />
                                    <Bar dataKey="revenue" fill="#FF5E00" radius={[0, 4, 4, 0]} name="Revenu ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    </div>

                    <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.04)", padding: 20 }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, fontWeight: 500, marginBottom: 14, color: "#fff", textTransform: "uppercase" }}>Distribution des notes clients</div>
                        {reviewsPieData.length === 0 ? <div style={{ textAlign: "center", color: "#6B6B6B", padding: 40 }}>Aucune donnée</div> :
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={reviewsPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent*100).toFixed(1)}%)`} labelLine={false}>
                                        {reviewsPieData.map((entry, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                                    </Pie>
                                    <Tooltip formatter={(v) => [v.toLocaleString(), "Avis"]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        }
                    </div>
                </div>

                <SectionTitle>Top 10 produits — Nombre de commandes</SectionTitle>
                <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.04)", padding: 20 }}>
                    {top10ByOrders.length === 0 ? <div style={{ textAlign: "center", color: "#6B6B6B", padding: 40 }}>Aucune donnée</div> :
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={top10ByOrders}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
                                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} />
                                <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, fontSize: 12 }} />
                                <Bar dataKey="orders" fill="#4CAF50" radius={[4, 4, 0, 0]} name="Commandes" />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>

                <SectionTitle>Données temps réel — Commandes Spring Boot</SectionTitle>
                <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.04)", padding: 20 }}>
                    {rtData.length === 0 ? <div style={{ textAlign: "center", color: "#6B6B6B", padding: 40 }}>Aucune donnée temps réel</div> :
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={rtData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B6B6B" }} />
                                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} />
                                <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="revenue" fill="#FF5E00" radius={[4, 4, 0, 0]} name="Revenu ($)" />
                                <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Commandes" />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                </div>

                <SectionTitle>Récapitulatif satisfaction clients</SectionTitle>
                <div style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>
                    {reviews.length === 0 ? <div style={{ textAlign: "center", color: "#6B6B6B", padding: 40 }}>Aucune donnée disponible</div> :
                        <table className="fa-table">
                            <thead>
                                <tr>{["Note", "Nombre d'avis", "% du total", "Positifs", "Négatifs", "Satisfaction"].map(h => <th key={h}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {[...reviews].sort((a, b) => parseInt(b.rowKey?.replace("hist_score_","") || 0) - parseInt(a.rowKey?.replace("hist_score_","") || 0)).map((row, i) => {
                                    const score = parseInt(row.rowKey?.replace("hist_score_","") || 0);
                                    const total = parseInt(row.total_reviews || 0);
                                    const pct = totalReviews > 0 ? ((total / totalReviews) * 100).toFixed(1) : 0;
                                    const satPct = parseFloat(row.satisfaction_pct || 0);
                                    return (
                                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                                            <td style={{ padding: "10px 16px", fontWeight: 500 }}>
                                                <span style={{ color: score >= 4 ? "#4CAF50" : score >= 3 ? "#FF7A2E" : "#E24B4A" }}>{"★".repeat(score)}{"☆".repeat(5 - score)} ({score}/5)</span>
                                            </td>
                                            <td style={{ padding: "10px 16px", color: "#D4D4D4" }}>{total.toLocaleString()}</td>
                                            <td style={{ padding: "10px 16px", color: "#6B6B6B" }}>{pct}%</td>
                                            <td style={{ padding: "10px 16px", color: "#4CAF50" }}>{parseInt(row.positive_reviews || 0).toLocaleString()}</td>
                                            <td style={{ padding: "10px 16px", color: "#E24B4A" }}>{parseInt(row.negative_reviews || 0).toLocaleString()}</td>
                                            <td style={{ padding: "10px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                                                        <div style={{ width: `${Math.min(satPct, 100)}%`, height: "100%", borderRadius: 3, background: satPct >= 70 ? "#4CAF50" : "#FF7A2E" }} />
                                                    </div>
                                                    <span style={{ fontSize: 11, color: "#6B6B6B", minWidth: 36 }}>{satPct.toFixed(1)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    );
}
