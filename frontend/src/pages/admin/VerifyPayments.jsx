import React, { useState } from "react";
import { APPOINTMENTS, USERS_LIST } from "../../utils/mockData";
import { Check, X, Eye, DollarSign, CreditCard } from "lucide-react";

const badgeClass = (status) => {
  const colorMap = {
    PENDING: "badge-amber",
    VERIFIED: "badge-green",
    FAILED: "badge-slate",
  };

  const labelMap = {
    PENDING: "Pending",
    VERIFIED: "Verified",
    FAILED: "Failed",
  };

  return (
    <span className={`badge ${colorMap[status] || "badge-slate"}`}>
      {labelMap[status] || status}
    </span>
  );
};

const SAMPLE_PAYMENTS = [
  {
    id: "pay1",
    appointmentId: "a1",
    patientName: "Sarah Mitchell",
    doctorName: "Dr. James Harlow",
    date: "2026-03-22",
    time: "10:00 AM",
    amount: 150,
    method: "Card (Visa)",
    status: "PENDING",
    txId: "TXN-20260322-001",
    paidAt: "2026-03-20 14:12",
    invoice: "INV-1001",
  },
  {
    id: "pay3",
    appointmentId: "a6",
    patientName: "David Kim",
    doctorName: "Dr. James Harlow",
    date: "2026-03-23",
    time: "3:00 PM",
    amount: 150,
    method: "Cash",
    status: "FAILED",
    txId: "TXN-20260323-100",
    paidAt: "2026-03-22 11:02",
    invoice: "INV-1003",
  },
  {
    id: "pay4",
    appointmentId: "a8",
    patientName: "Michael Brown",
    doctorName: "Dr. James Harlow",
    date: "2026-03-20",
    time: "2:00 PM",
    amount: 150,
    method: "Card (Mastercard)",
    status: "PENDING",
    txId: "TXN-20260320-077",
    paidAt: "2026-03-19 16:40",
    invoice: "INV-1004",
  },
];

export default function VerifyPayments() {
  const [payments, setPayments] = useState(SAMPLE_PAYMENTS);
  const [expanded, setExpanded] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const verify = (id) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, status: "VERIFIED" } : payment,
      ),
    );
  };

  const fail = (id) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, status: "FAILED" } : payment,
      ),
    );
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

  const findAppointment = (appointmentId) =>
    APPOINTMENTS.find((appointment) => appointment.id === appointmentId);

  return (
    <div>
      {/* Summary tiles */}
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
              {payments.map((p) => {
                const appt = findAppointment(p.appointmentId) || {};
                const patientEmail =
                  USERS_LIST.find((u) => u.name === p.patientName)?.email || "—";

                return (
                  <React.Fragment key={p.id}>
                    <tr>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94A3B8' }}>{p.txId}</td>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{p.patientName}</td>
                      <td style={{ color: '#64748B' }}>
                        {appt.type || "Appointment"}
                        {appt.doctorName || p.doctorName
                          ? ` • ${appt.doctorName || p.doctorName}`
                          : ""}
                      </td>
                      <td style={{ color: '#64748B' }}>
                        {p.date} • {p.time}
                      </td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>${p.amount}</td>
                      <td>{badgeClass(p.status)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => openConfirm(p.id, "verify")}
                            disabled={p.status === "VERIFIED"}
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
                              setExpanded((current) =>
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
                                <strong style={{ width: 140, color: '#475569' }}>Patient Email:</strong>
                                <span style={{ color: '#0F172A' }}>{patientEmail}</span>
                              </div>
                              <div style={{ marginBottom: 8, display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Transaction ID:</strong>
                                <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>{p.txId}</span>
                              </div>
                              <div style={{ display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Payment Method:</strong>
                                <span style={{ color: '#0F172A' }}>{p.method}</span>
                              </div>
                            </div>
                            <div>
                              <div style={{ marginBottom: 8, display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Paid At:</strong>
                                <span style={{ color: '#0F172A' }}>{p.paidAt}</span>
                              </div>
                              <div style={{ marginBottom: 8, display: 'flex' }}>
                                <strong style={{ width: 140, color: '#475569' }}>Invoice Number:</strong>
                                <span style={{ color: '#0F172A' }}>{p.invoice}</span>
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
