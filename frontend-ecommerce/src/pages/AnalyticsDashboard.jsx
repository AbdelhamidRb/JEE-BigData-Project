import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const API = "http://localhost:9090/api/analytics";
const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#06b6d4", "#10b981"];

async function fetchWithTimeout(url, options, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    console.error("Erreur Fetch:", url, error);
    return [];
  }
}

function KpiCard({ title, value, subtitle, color }) {
  return (
    <div style={{
      background: "var(--color-background-secondary)",
      border: "1px solid var(--color-border-tertiary)",
      borderRadius: 12, padding: "20px 24px",
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 500, color: "var(--color-text-primary)" }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)",
      margin: "32px 0 16px", paddingBottom: 8,
      borderBottom: "1px solid var(--color-border-tertiary)"
    }}>{children}</h2>
  );
}

export default function AnalyticsDashboard() {
  const [sales,   setSales]   = useState([]);
  const [reviews, setReviews] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [rtSales, setRtSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    Promise.all([
      fetchWithTimeout(`${API}/sales-by-category`, options),
      fetchWithTimeout(`${API}/reviews-by-category`, options),
      fetchWithTimeout(`${API}/revenue-by-month`, options),
    ]).then(([s, r, rev]) => {
      const allSales = Array.isArray(s) ? s : [];

      // Séparer historique et temps réel
      setSales(allSales.filter(d => d.source === "historical"));
      setRtSales(allSales.filter(d => d.source === "realtime"));

      // Reviews : filtrer uniquement les 5 lignes score_1 à score_5
      const reviewData = Array.isArray(r) ? r : [];
      setReviews(reviewData.filter(d =>
        d.rowKey && d.rowKey.startsWith("hist_score_")
      ).sort((a, b) => a.rowKey?.localeCompare(b.rowKey)));

      setRevenue(Array.isArray(rev)
        ? rev.sort((a, b) => (a.month || "").localeCompare(b.month || ""))
        : []);

      setLoading(false);
    });
  }, []);

  // ─── KPIs ────────────────────────────────────────────────────────────────
  const totalRevenue  = sales.reduce((acc, d) => acc + parseFloat(d.total_revenue || 0), 0);
  const totalOrders   = sales.reduce((acc, d) => acc + parseInt(d.total_orders || 0), 0);
  const totalProducts = sales.length;

  const totalReviews  = reviews.reduce((acc, d) => acc + parseInt(d.total_reviews || 0), 0);
  const avgRating     = totalReviews > 0
    ? (reviews.reduce((acc, d) =>
        acc + parseFloat(d.avg_rating || 0) * parseInt(d.total_reviews || 0), 0) / totalReviews
      ).toFixed(2)
    : "—";

  // ─── Top 10 produits par revenu ──────────────────────────────────────────
  const top10Products = [...sales]
    .sort((a, b) => parseFloat(b.total_revenue || 0) - parseFloat(a.total_revenue || 0))
    .slice(0, 10)
    .map(d => ({
      name:    (d.product_id || d.rowKey?.replace("hist_product_", "") || "—").slice(0, 8) + "…",
      revenue: parseFloat(d.total_revenue || 0),
      orders:  parseInt(d.total_orders || 0),
    }));

  // ─── Top 10 produits par commandes ──────────────────────────────────────
  const top10ByOrders = [...sales]
    .sort((a, b) => parseInt(b.total_orders || 0) - parseInt(a.total_orders || 0))
    .slice(0, 10)
    .map(d => ({
      name:   (d.product_id || d.rowKey?.replace("hist_product_", "") || "—").slice(0, 8) + "…",
      orders: parseInt(d.total_orders || 0),
    }));

  // ─── Commandes par mois ──────────────────────────────────────────────────
  const revenueData = revenue.map(d => ({
    month:  d.month || d.rowKey?.replace("hist_", "") || "—",
    orders: parseInt(d.total_orders || 0),
  }));

  // ─── Reviews par score (PieChart) ────────────────────────────────────────
  const reviewsPieData = reviews.map(d => ({
    name:  `Note ${d.rowKey?.replace("hist_score_", "") || "?"}`,
    value: parseInt(d.total_reviews || 0),
    score: parseInt(d.rowKey?.replace("hist_score_", "") || 0),
  }));

  // ─── Temps réel ──────────────────────────────────────────────────────────
  const rtData = rtSales
    .sort((a, b) => parseFloat(b.total_revenue || 0) - parseFloat(a.total_revenue || 0))
    .map(d => ({
      name:    d.category || d.rowKey?.replace("rt_", "") || "—",
      revenue: parseFloat(d.total_revenue || 0),
      orders:  parseInt(d.total_orders || 0),
    }));

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <div style={{ color: "var(--color-text-secondary)", fontSize: 15 }}>Chargement des analytics…</div>
    </div>
  );

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
          Dashboard Analytics
        </h1>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
          Données historiques Olist (99k commandes) + données temps réel Spring Boot
        </div>
      </div>

      {/* ── KPIs ───────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KpiCard title="Revenu total (hist.)"   value={`$${(totalRevenue/1000000).toFixed(2)}M`} subtitle={`${totalProducts} produits`} color="#6366f1"/>
        <KpiCard title="Commandes totales"       value={totalOrders.toLocaleString()}              subtitle="Données Olist"              color="#06b6d4"/>
        <KpiCard title="Note moyenne"            value={`${avgRating} / 5`}                        subtitle={`${totalReviews.toLocaleString()} avis`} color="#f59e0b"/>
        <KpiCard title="Données temps réel"      value={rtSales.length}                            subtitle="Catégories actives"         color="#10b981"/>
      </div>

      {/* ── Commandes par mois ─────────────────────────────────────────── */}
      <SectionTitle>📈 Évolution des commandes par mois (Olist)</SectionTitle>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 20, border: "1px solid var(--color-border-tertiary)" }}>
        {revenueData.length === 0
          ? <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: 40 }}>Aucune donnée</div>
          : <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                <Tooltip contentStyle={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={false} name="Commandes" />
              </LineChart>
            </ResponsiveContainer>
        }
      </div>

      {/* ── Top produits + Reviews ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>

        {/* Top 10 par revenu */}
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 20, border: "1px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16, color: "var(--color-text-primary)" }}>
            🏆 Top 10 produits — Revenu
          </div>
          {top10Products.length === 0
            ? <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: 40 }}>Aucune donnée</div>
            : <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top10Products} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} />
                  <Tooltip contentStyle={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`$${v.toFixed(2)}`, "Revenu"]} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} name="Revenu ($)" />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Distribution des notes */}
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 20, border: "1px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16, color: "var(--color-text-primary)" }}>
            ⭐ Distribution des notes clients
          </div>
          {reviewsPieData.length === 0
            ? <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: 40 }}>Aucune donnée</div>
            : <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={reviewsPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent*100).toFixed(1)}%)`} labelLine={false}>
                    {reviewsPieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[entry.score - 1] || "#8b5cf6"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v.toLocaleString(), "Avis"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      {/* ── Top produits par commandes ─────────────────────────────────── */}
      <SectionTitle>📦 Top 10 produits — Nombre de commandes</SectionTitle>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 20, border: "1px solid var(--color-border-tertiary)" }}>
        {top10ByOrders.length === 0
          ? <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: 40 }}>Aucune donnée</div>
          : <ResponsiveContainer width="100%" height={220}>
              <BarChart data={top10ByOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                <Tooltip contentStyle={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
        }
      </div>

      {/* ── Données temps réel ─────────────────────────────────────────── */}
      <SectionTitle>⚡ Données temps réel — Commandes Spring Boot</SectionTitle>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: 20, border: "1px solid var(--color-border-tertiary)" }}>
        {rtData.length === 0
          ? <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: 40 }}>
              Aucune donnée temps réel — Passez des commandes dans l'application pour voir les analytics apparaître ici
            </div>
          : <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                <Tooltip contentStyle={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenu ($)" />
                <Bar dataKey="orders"  fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
        }
      </div>

      {/* ── Tableau récapitulatif reviews ──────────────────────────────── */}
      <SectionTitle>📊 Récapitulatif satisfaction clients</SectionTitle>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--color-border-tertiary)" }}>
        {reviews.length === 0
          ? <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: 40 }}>Aucune donnée disponible</div>
          : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--color-background-tertiary)" }}>
                  {["Note", "Nombre d'avis", "% du total", "Positifs", "Négatifs", "Satisfaction"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "var(--color-text-secondary)", fontSize: 12, borderBottom: "1px solid var(--color-border-tertiary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...reviews].sort((a, b) =>
                  parseInt(b.rowKey?.replace("hist_score_","") || 0) -
                  parseInt(a.rowKey?.replace("hist_score_","") || 0)
                ).map((row, i) => {
                  const score   = parseInt(row.rowKey?.replace("hist_score_","") || 0);
                  const total   = parseInt(row.total_reviews || 0);
                  const pct     = totalReviews > 0 ? ((total / totalReviews) * 100).toFixed(1) : 0;
                  const satPct  = parseFloat(row.satisfaction_pct || 0);
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid var(--color-border-tertiary)", background: i % 2 === 0 ? "transparent" : "var(--color-background-tertiary)" }}>
                      <td style={{ padding: "10px 16px", fontWeight: 500 }}>
                        <span style={{ color: score >= 4 ? "#10b981" : score >= 3 ? "#f59e0b" : "#ef4444" }}>
                          {"★".repeat(score)}{"☆".repeat(5 - score)} ({score}/5)
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", color: "var(--color-text-primary)" }}>{total.toLocaleString()}</td>
                      <td style={{ padding: "10px 16px", color: "var(--color-text-secondary)" }}>{pct}%</td>
                      <td style={{ padding: "10px 16px", color: "#10b981" }}>{parseInt(row.positive_reviews || 0).toLocaleString()}</td>
                      <td style={{ padding: "10px 16px", color: "#ef4444" }}>{parseInt(row.negative_reviews || 0).toLocaleString()}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "var(--color-border-tertiary)", borderRadius: 3 }}>
                            <div style={{ width: `${Math.min(satPct, 100)}%`, height: "100%", borderRadius: 3, background: satPct >= 70 ? "#10b981" : "#f59e0b" }} />
                          </div>
                          <span style={{ fontSize: 12, color: "var(--color-text-secondary)", minWidth: 36 }}>{satPct.toFixed(1)}%</span>
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
  );
}