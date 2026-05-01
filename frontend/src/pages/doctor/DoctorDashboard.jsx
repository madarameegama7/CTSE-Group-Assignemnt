import { useAuth } from '../../context/Authcontext';
import useAppointments from '../../hooks/useAppointments';
import { CalendarDays, Users, CheckCircle2, Clock, ArrowRight, Circle } from 'lucide-react';

const badge = s => {
  const m = { CONFIRMED: 'badge-blue', PENDING: 'badge-amber', COMPLETED: 'badge-green', CANCELLED: 'badge-slate' };
  const l = { CONFIRMED: 'Confirmed', PENDING: 'Pending', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
  return <span className={`badge ${m[s] || 'badge-slate'}`}>{l[s] || s}</span>;
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments, loading } = useAppointments();
  const mine = appointments.filter(a => a.doctorId === user?.userId);
  const today = mine.filter(a => a.date === getTodayDate());
  const pending = mine.filter(a => a.status === 'PENDING');
  const done = mine.filter(a => a.status === 'COMPLETED');

  const stats = [
    { label: "Today's Appointments", value: today.length, icon: CalendarDays, color: '#0D9488', bg: '#F0FDFA' },
    { label: 'Pending Review', value: pending.length, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Completed Total', value: done.length, icon: CheckCircle2, color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Total Patients', value: mine.length, icon: Users, color: '#2563EB', bg: '#EFF6FF' },
  ];

  return (
    <div>
      <div style={{ ...banner, background: 'linear-gradient(135deg,#0D7377,#0D9488)' }}>
        <div>
          <h2 style={bannerTitle}>Good Afternoon, {user?.name} 👨‍⚕️</h2>
          <p style={bannerSub}>You have <strong>{today.length} appointments</strong> scheduled for today.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Today</div>
          <div style={{ fontFamily: "'Lexend',sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div className="stat-tile fade-up" key={s.label}>
              <div className="stat-tile-top">
                <div className="stat-tile-icon" style={{ background: s.bg, color: s.color }}><Icon size={18} /></div>
              </div>
              <div className="stat-tile-value">{s.value}</div>
              <div className="stat-tile-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card fade-up">
          <div className="card-header">
            <span className="card-title">Today's Schedule</span>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{today.length} appointments</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {today.length === 0 ? (
              <div className="empty-state"><CalendarDays size={32} /><p>No appointments today</p></div>
            ) : today.map((a, i) => (
              <div key={a.id} style={schedItem}>
                <div style={timePill}>{a.time}</div>
                <div style={{ position: 'relative' }}>
                  {i < today.length - 1 && <div style={timeLine} />}
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.status === 'CONFIRMED' ? '#0D9488' : '#F59E0B', border: '2px solid white', position: 'relative', zIndex: 1 }} />
                </div>
                <div style={schedCard}>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>{a.patientName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{a.type}</div>
                  {badge(a.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card fade-up">
          <div className="card-header">
            <span className="card-title">Pending Requests</span>
            <span className="badge badge-amber">{pending.length}</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {pending.length === 0 ? (
              <div className="empty-state"><CheckCircle2 size={32} /><p>All caught up!</p></div>
            ) : pending.map(a => (
              <div key={a.id} style={pendItem}>
                <div className="doc-avatar" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                  {a.patientName.split(' ').map(w => w[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>{a.patientName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{a.date} · {a.time} · {a.type}</div>
                  {a.notes && <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: 3 }}>{a.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-primary btn-sm">Accept</button>
                  <button className="btn btn-danger btn-sm">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card fade-up" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">All Appointments</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Patient</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Fee</th><th>Action</th>
            </tr></thead>
            <tbody>
              {mine.slice(0, 6).map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div className="doc-avatar" style={{ background: '#F1F5F9', color: '#475569' }}>{a.patientName.split(' ').map(w => w[0]).join('')}</div>
                      <span style={{ fontWeight: 600 }}>{a.patientName}</span>
                    </div>
                  </td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td><span className="badge badge-slate">{a.type}</span></td>
                  <td>{badge(a.status)}</td>
                  <td style={{ fontWeight: 600 }}>Rs. {a.fee}</td>
                  <td><button className="btn btn-ghost btn-sm">View <ArrowRight size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const banner = { borderRadius: 14, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, color: 'white' };
const bannerTitle = { fontFamily: "'Lexend',sans-serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' };
const bannerSub = { fontSize: '0.875rem', opacity: 0.85 };

const schedItem = { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 20px' };
const timePill = { fontSize: '0.72rem', fontWeight: 600, color: '#64748B', width: 72, flexShrink: 0, paddingTop: 2, fontFamily: "'JetBrains Mono',monospace" };
const timeLine = { position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 10, bottom: -20, width: 1, background: '#E2E8F0' };
const schedCard = { flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 };
const pendItem = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #F1F5F9' };