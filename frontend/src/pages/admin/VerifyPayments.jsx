import { useState } from "react";
import { APPOINTMENTS, USERS_LIST } from "../../utils/mockData";
import { Check, X, Eye } from "lucide-react";

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
    notes: "Annual cardiac screening",
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
    notes: "Card declined",
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
    notes: "Routine ECG",
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
      <div className="card">
        <div className="card-header">
          <span className="card-title">Verify Payments</span>
        </div>

        <div className="card-body">
          <p style={{ marginTop: 0, color: "#64748B" }}>
            Review and verify incoming payments for appointments. Click{" "}
            <strong>Verify</strong> to mark as verified or{" "}
            <strong>Reject</strong> to mark as failed.
          </p>

          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {payments.map((p) => {
              const appt = findAppointment(p.appointmentId) || {};
              const patientEmail =
                USERS_LIST.find((u) => u.name === p.patientName)?.email || "—";

              return (
                <div
                  key={p.id}
                  className="card"
                  style={{ padding: 12, borderRadius: 8 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                            {p.patientName}
                          </div>
                          <div style={{ color: "#64748B", fontSize: "0.9rem" }}>
                            {appt.type || "Appointment"}
                            {appt.doctorName || p.doctorName
                              ? ` • ${appt.doctorName || p.doctorName}`
                              : ""}
                          </div>
                          <div
                            style={{
                              color: "#94A3B8",
                              fontSize: "0.82rem",
                              marginTop: 6,
                            }}
                          >
                            {p.date} • {p.time}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800, fontSize: "1rem" }}>
                            ${p.amount}
                          </div>
                          <div style={{ marginTop: 6 }}>
                            {badgeClass(p.status)}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 10, color: "#0F172A" }}>
                        <strong>Notes:</strong> {p.notes || "—"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginLeft: 12,
                      }}
                    >
                      <button
                        className="btn btn-success"
                        onClick={() => openConfirm(p.id, "verify")}
                      >
                        <Check size={14} /> Verify
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => openConfirm(p.id, "reject")}
                      >
                        <X size={14} /> Reject
                      </button>

                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setExpanded((current) =>
                            current === p.id ? null : p.id,
                          )
                        }
                      >
                        <Eye size={14} /> Details
                      </button>
                    </div>
                  </div>

                  {expanded === p.id && (
                    <div
                      style={{
                        marginTop: 12,
                        background: "#F8FAFC",
                        padding: 10,
                        borderRadius: 6,
                      }}
                    >
                      <div>
                        <strong>Patient:</strong> {p.patientName} (
                        {patientEmail})
                      </div>
                      <div>
                        <strong>Appointment:</strong> {appt.type || "—"} with{" "}
                        {appt.doctorName || p.doctorName} on {p.date} at{" "}
                        {p.time}
                      </div>
                      <div>
                        <strong>Transaction ID:</strong> {p.txId}
                      </div>
                      <div>
                        <strong>Method:</strong> {p.method}
                      </div>
                      <div>
                        <strong>Paid At:</strong> {p.paidAt}
                      </div>
                      <div>
                        <strong>Invoice:</strong> {p.invoice}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
