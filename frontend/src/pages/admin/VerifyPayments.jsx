import React, { useState, useEffect } from "react";
import useAllAppointments from "../../hooks/useAllAppointments";
import useAllUsers from "../../hooks/useAllUsers";
import { api } from "../../services/api";
import { Check, X, Eye, DollarSign, CreditCard } from "lucide-react";

const badgeClass = (status) => {
  const colorMap = {
    PENDING: "badge-amber",
    VERIFIED: "badge-green",
    COMPLETED: "badge-green",
    FAILED: "badge-slate",
  };

  const labelMap = {
    PENDING: "Pending",
    VERIFIED: "Verified",
    COMPLETED: "Completed",
    FAILED: "Failed",
  };

  return (
    <span className={`badge ${colorMap[status] || "badge-slate"}`}>
      {labelMap[status] || status}
    </span>
  );
};

export default function VerifyPayments() {
  const { appointments } = useAllAppointments();
  const [payments, setPayments] = useState([]);
  const [rawPayments, setRawPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const { users } = useAllUsers();

  const formatDate = (isoString) => {
    if (!isoString) return "--";
    // accept either ISO or already-formatted date
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const data = await api.get("/payments");
        const mapped = (data || []).map((p) => ({
          id: p.paymentId,
          paymentId: p.paymentId,
          appointmentId: p.appointmentId,
          patientId: p.patientId,
          patientName: p.patientName || "",
          amount: p.amount,
          status: p.status,
          transactionId: p.transactionId || `TXN-${Date.now()}`,
          paymentDate: p.paymentDate || new Date().toISOString().split("T")[0],
          paymentType: p.paymentType || "Online",
        }));
        setRawPayments(mapped);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setRawPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPayments();
  }, []);

  // Enrich payments with appointment and user info when available
  useEffect(() => {
    if (!rawPayments) return;
    const enriched = rawPayments.map((p) => {
      const appt =
        appointments.find(
          (a) =>
            a.id === p.appointmentId || a.appointmentId === p.appointmentId,
        ) || {};
      const user = users
        ? users.find(
            (u) =>
              u.id === (p.patientId ? p.patientId.toString() : p.patientId),
          )
        : null;

      return {
        ...p,
        patientName:
          p.patientName ||
          appt.patientName ||
          (user && user.name) ||
          `Patient #${p.patientId}`,
        patientEmail: (user && user.email) || p.patientEmail || "--",
        doctorName: appt.doctorName || p.doctorName || "--",
        appointmentDate: appt.date || null,
        appointmentTime: appt.time || appt.appointmentTime || null,
        appointmentType: appt.type || appt.appointmentType || "Appointment",
        appointmentStatus: appt.status || "--",
        fee: appt.fee || p.amount,
      };
    });
    setPayments(enriched);
  }, [rawPayments, appointments, users]);

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      await api.put(`/payments/${paymentId}/status`, { status: newStatus });
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p)),
      );
    } catch (err) {
      console.error("Failed to update payment status:", err);
    }
  };

  const verify = (id) => {
    updatePaymentStatus(id, "VERIFIED");
  };

  const fail = (id) => {
    updatePaymentStatus(id, "FAILED");
  };

  const confirmAction = () => {
    if (!pendingAction) return;

    const { id, type } = pendingAction;

    if (type === "verify") verify(id);
    if (type === "reject") fail(id);

    setPendingAction(null);
  };

  const openConfirm = (id, type) => setPendingAction({ id, type });
  const closeConfirm = () => setPendingAction(null);

  const findAppointment = (appointmentId) => {
    return appointments.find(
      (a) => a.id === appointmentId || a.appointmentId === appointmentId,
    );
  };

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {(() => {
          const total = payments.length;
          return (
            <div className="stat-tile fade-up">
              <div className="stat-tile-top">
                <div
                  className="stat-tile-icon"
                  style={{ background: "#EFF6FF", color: "#2563EB" }}
                >
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="stat-tile-value">{total}</div>
              <div className="stat-tile-label">Total Payments</div>
            </div>
          );
        })()}
      </div>
      <div className="card fade-up">
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid #F1F5F9",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              fontWeight: 600,
              color: "#0F172A",
              fontSize: "1.1rem",
            }}
          >
            Payment Verification Requests
          </div>
          <span style={{ fontSize: "0.84rem", color: "#64748B" }}>
            Review incoming payments for appointments.
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Amount</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const appt = findAppointment(p.appointmentId) || {};

                return (
                  <React.Fragment key={p.id}>
                    <tr>
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          color: "#94A3B8",
                        }}
                      >
                        {p.transactionId}
                      </td>
                      <td style={{ fontWeight: 600, color: "#0F172A" }}>
                        {p.patientName}
                      </td>
                      <td style={{ color: "#64748B" }}>
                        {formatDate(appt.date || p.paymentDate)}
                      </td>
                      <td style={{ fontWeight: 700, color: "#0F172A" }}>
                        Rs. {p.amount}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() =>
                            setExpanded((current) =>
                              current === p.id ? null : p.id,
                            )
                          }
                          title="Details"
                          style={{ padding: "6px" }}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                    {expanded === p.id && (
                      <tr className="fade-up">
                        <td
                          colSpan={7}
                          style={{
                            background: "#F8FAFC",
                            padding: "16px 24px",
                            borderBottom: "1px solid #E2E8F0",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "minmax(0, 1fr) minmax(0, 1fr)",
                              gap: 16,
                              fontSize: "0.875rem",
                              textAlign: "left",
                            }}
                          >
                            <div>
                              <div style={{ marginBottom: 8, display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Patient ID:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.patientId}
                                </span>
                              </div>
                              <div style={{ marginBottom: 8, display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Patient Email:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.patientEmail}
                                </span>
                              </div>
                              <div style={{ marginBottom: 8, display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Transaction ID:
                                </strong>
                                <span
                                  style={{
                                    fontFamily: "monospace",
                                    color: "#0F172A",
                                  }}
                                >
                                  {p.transactionId}
                                </span>
                              </div>
                              <div style={{ display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Payment Type:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.paymentType}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div style={{ marginBottom: 8, display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Payment Date:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.paymentDate}
                                </span>
                              </div>
                              <div style={{ marginBottom: 8, display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Appointment ID:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.appointmentId}
                                </span>
                              </div>
                              <div style={{ marginBottom: 8, display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Appointment Type:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.appointmentType}
                                </span>
                              </div>
                              <div style={{ marginBottom: 8, display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Doctor:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.doctorName}
                                </span>
                              </div>
                              <div style={{ display: "flex" }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Fee:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  Rs. {p.fee}
                                </span>
                              </div>
                              <div style={{ display: "flex", marginTop: 8 }}>
                                <strong
                                  style={{ width: 140, color: "#475569" }}
                                >
                                  Status:
                                </strong>
                                <span style={{ color: "#0F172A" }}>
                                  {p.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#94A3B8",
                    }}
                  >
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
            Showing {payments.length} transactions
          </span>
        </div>
      </div>

      {pendingAction && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(2,6,23,0.5)",
            zIndex: 200,
          }}
          onClick={closeConfirm}
        >
          <div
            style={{
              background: "#fff",
              padding: 18,
              borderRadius: 8,
              minWidth: 320,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              {pendingAction.type === "verify"
                ? "Confirm Verify"
                : "Confirm Reject"}
            </div>

            <div style={{ color: "#475569", marginBottom: 16 }}>
              Are you sure you want to{" "}
              {pendingAction.type === "verify" ? "VERIFY" : "REJECT"} this
              payment?
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button className="btn btn-ghost" onClick={closeConfirm}>
                No
              </button>

              <button
                className={
                  pendingAction.type === "verify"
                    ? "btn btn-success"
                    : "btn btn-danger"
                }
                onClick={confirmAction}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
