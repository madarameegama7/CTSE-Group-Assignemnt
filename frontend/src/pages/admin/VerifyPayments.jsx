import React, { useState, useEffect } from "react";
import useAllAppointments from "../../hooks/useAllAppointments";
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
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const data = await api.get('/payments');
        const mapped = (data || []).map(p => ({
          id: p.paymentId,
          paymentId: p.paymentId,
          appointmentId: p.appointmentId,
          patientId: p.patientId,
          patientName: p.patientName || `Patient #${p.patientId}`,
          amount: p.amount,
          status: p.status,
          transactionId: p.transactionId || `TXN-${Date.now()}`,
          paymentDate: p.paymentDate || new Date().toISOString().split('T')[0],
          paymentType: p.paymentType || 'Online'
        }));
        setPayments(mapped);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
        setPayments([]);
        setLoading(false);
      }
    };
    fetchAllPayments();
  }, []);

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      await api.put(`/payments/${paymentId}/status`, { status: newStatus });
      setPayments(prev =>
        prev.map(p => p.id === paymentId ? { ...p, status: newStatus } : p)
      );
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  const verify = (id) => {
    updatePaymentStatus(id, 'VERIFIED');
  };

  const fail = (id) => {
    updatePaymentStatus(id, 'FAILED');
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
    return appointments.find(a => a.id === appointmentId || a.appointmentId === appointmentId);
  };

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {(() => {
          const total = payments.length;
          const pending = payments.filter((p) => p.status === "PENDING").length;
          const verified = payments.filter(
            (p) => p.status === "VERIFIED",
          ).length;
          const failed = payments.filter((p) => p.status === "FAILED").length;
          const tiles = [
            {
              label: "Total Payments",
              value: total,
              icon: DollarSign,
              color: "#2563EB",
              bg: "#EFF6FF",
            },
            {
              label: "Pending",
              value: pending,
              icon: CreditCard,
              color: "#F59E0B",
              bg: "#FFFBEB",
            },
            {
              label: "Verified",
              value: verified,
              icon: Check,
              color: "#16A34A",
              bg: "#F0FDFA",
            },
            {
              label: "Failed",
              value: failed,
              icon: X,
              color: "#EF4444",
              bg: "#FEF2F2",
            },
          ];
          return tiles.map((s) => {
            const Icon = s.icon;
            return (
              <div className="stat-tile fade-up" key={s.label}>
                <div className="stat-tile-top">
                  <div
                    className="stat-tile-icon"
                    style={{ background: s.bg, color: s.color }}
                  >
                    <Icon size={18} />
                  </div>
                </div>
                <div className="stat-tile-value">{s.value}</div>
                <div className="stat-tile-label">{s.label}</div>
              </div>
            );
          });
        })()}
      </div>
      <div className="card fade-up">
        <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, fontWeight: 600, color: '#0F172A', fontSize: '1.1rem' }}>Payment Verification Requests</div>
          <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
            Review incoming payments for appointments.
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Patient</th>
                <th>Appointment Details</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const appt = findAppointment(p.appointmentId) || {};

                return (
                  <React.Fragment key={p.id}>
                    <tr>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94A3B8' }}>{p.transactionId}</td>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{p.patientName}</td>
                      <td style={{ color: '#64748B' }}>
                        {appt.type || "Appointment"}
                        {appt.doctorName ? ` • ${appt.doctorName}` : ""}
                      </td>
                      <td style={{ color: '#64748B' }}>
                        {appt.date ? `${appt.date} • ${appt.time}` : p.paymentDate}
                      </td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>${p.amount}</td>
                      <td>{badgeClass(p.status)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => openConfirm(p.id, "verify")}
                            disabled={p.status === "VERIFIED" || p.status === "COMPLETED"}
                            title="Verify"
                            style={{ padding: '6px' }}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openConfirm(p.id, "reject")}
                            disabled={p.status === "FAILED"}
                            title="Reject"
                            style={{ padding: '6px' }}
                          >
                            <X size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() =>
                              setExpanded(current =>
                                current === p.id ? null : p.id
                              )
                            }
                            title="Details"
                            style={{ padding: '6px' }}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === p.id && (
                      <tr className="fade-up">
                        <td colSpan={7} style={{ background: '#F8FAFC', padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, fontSize: '0.875rem', textAlign: 'left' }}>
                            <div>
                              <div style={{ marginBottom: 8, display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Patient ID:</strong>
                                <span style={{ color: '#0F172A' }}>{p.patientId}</span>
                              </div>
                              <div style={{ marginBottom: 8, display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Transaction ID:</strong>
                                <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>{p.transactionId}</span>
                              </div>
                              <div style={{ display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Payment Type:</strong>
                                <span style={{ color: '#0F172A' }}>{p.paymentType}</span>
                              </div>
                            </div>
                            <div>
                              <div style={{ marginBottom: 8, display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Payment Date:</strong>
                                <span style={{ color: '#0F172A' }}>{p.paymentDate}</span>
                              </div>
                              <div style={{ marginBottom: 8, display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Appointment ID:</strong>
                                <span style={{ color: '#0F172A' }}>{p.appointmentId}</span>
                              </div>
                              <div style={{ display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Status:</strong>
                                <span style={{ color: '#0F172A' }}>{p.status}</span>
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
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Showing {payments.length} transactions</span>
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
