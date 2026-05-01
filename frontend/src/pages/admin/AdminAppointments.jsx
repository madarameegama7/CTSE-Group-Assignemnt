import { useState } from 'react';
import useAllAppointments from '../../hooks/useAllAppointments';
import { Search, Download } from 'lucide-react';

const badge = s => {
  const m = { CONFIRMED: 'badge-blue', PENDING: 'badge-amber', COMPLETED: 'badge-green', CANCELLED: 'badge-slate' };
  const l = { CONFIRMED: 'Confirmed', PENDING: 'Pending', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
  return <span className={`badge ${m[s] || 'badge-slate'}`}>{l[s] || s}</span>;
};

const STATUSES = ['All', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'];

export default function AdminAppointments() {
  const { appointments, loading } = useAllAppointments();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = appointments.filter(a => {
    const ms = status === 'All' || a.status === status;
    const mq = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
               a.doctorName.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const totalRevenue = filtered.reduce((s, a) => s + a.fee, 0);

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {STATUSES.filter(s => s !== 'All').map(s => (
          <div
            className="stat-tile fade-up"
            key={s}
            style={{ cursor: 'pointer', borderColor: status === s ? '#2563EB' : 'transparent' }}
            onClick={() => setStatus(s)}
          >
            <div className="stat-tile-value" style={{ fontSize: '1.5rem' }}>
              {{CONFIRMED: 45, PENDING: 12, COMPLETED: 128, CANCELLED: 8}[s] || 0}
            </div>
            <div className="stat-tile-label">{s.charAt(0) + s.slice(1).toLowerCase()}</div>
          </div>
        ))}
      </div>

      <div className="card fade-up">
        <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search size={15} />
            <input
              className="form-input search-input"
              placeholder="Search patient or doctor…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ width: 160 }} value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
          <button className="btn btn-outline btn-sm"><Download size={13} /> Export</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94A3B8' }}>#{a.id}</td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{a.patientName}</td>
                  <td style={{ color: '#64748B' }}>{a.doctorName}</td>
                  <td style={{ color: '#64748B' }}>{a.date}</td>
                  <td style={{ color: '#64748B' }}>{a.time}</td>
                  <td><span className="badge badge-slate">{a.type}</span></td>
                  <td>{badge(a.status)}</td>
                  <td style={{ fontWeight: 700, color: '#0F172A' }}>Rs. {a.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Showing {filtered.length} appointments</span>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>Total: Rs. {totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}