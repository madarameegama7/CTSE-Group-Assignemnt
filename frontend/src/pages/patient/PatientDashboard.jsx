import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';
import usePatientAppointments from '../../hooks/usePatientAppointments';
import useDoctors from '../../hooks/useDoctors';
import {
  CalendarDays, Clock, CheckCircle2, Search,
  ChevronRight, Star, MapPin, ArrowRight, Plus
} from 'lucide-react';

const statusBadge = s => {
  if (s === 'CONFIRMED') return <span className="badge badge-blue">Confirmed</span>;
  if (s === 'PENDING') return <span className="badge badge-amber">Pending</span>;
  if (s === 'COMPLETED') return <span className="badge badge-green">Completed</span>;
  if (s === 'CANCELLED') return <span className="badge badge-slate">Cancelled</span>;
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { doctors: docsData } = useDoctors();
  const { appointments: myAppts, loading } = usePatientAppointments();
  const upcoming = loading ? [] : myAppts.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING');
  const next = upcoming[0];

  const stats = [
    { label: 'Upcoming', value: upcoming.length, icon: CalendarDays, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Completed', value: myAppts.filter(a => a.status === 'COMPLETED').length, icon: CheckCircle2, color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Pending', value: myAppts.filter(a => a.status === 'PENDING').length, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div>
      <div style={banner}>
        <div>
          <h2 style={bannerTitle}>Good morning, {user?.name?.split(' ')[0]} 👋</h2>
          <p style={bannerSub}>You have <strong>{upcoming.length} upcoming</strong> appointment{upcoming.length !== 1 ? 's' : ''} scheduled.</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 6 }} onClick={() => navigate('/patient/find-doctors')}>
          <Plus size={15} /> Book Appointment
        </button>
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
              <div className="stat-tile-label">{s.label} Appointments</div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card fade-up">
          <div className="card-header">
            <span className="card-title">Next Appointment</span>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem' }} onClick={() => navigate('/patient/appointments')}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="card-body">
            {next ? (
              <div style={apptCard}>
                <div style={apptCardTop}>
                  <div className="doc-avatar" style={{ width: 44, height: 44, fontSize: '0.8rem', background: '#DBEAFE', color: '#1D4ED8' }}>
                    {next.doctorName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{next.doctorName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{next.specialty}</div>
                  </div>
                  {statusBadge(next.status)}
                </div>
                <div style={apptMeta}>
                  <span><CalendarDays size={13} /> {next.date}</span>
                  <span><Clock size={13} /> {next.time}</span>
                </div>
                {next.notes && <div style={apptNote}>{next.notes}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-outline btn-sm w-full">Reschedule</button>
                  <button className="btn btn-danger btn-sm w-full">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <CalendarDays size={36} />
                <p>No upcoming appointments</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/patient/find-doctors')}>Book Now</button>
              </div>
            )}
          </div>
        </div>

        <div className="card fade-up">
          <div className="card-header">
            <span className="card-title">Recent History</span>
          </div>
          <div className="card-body" style={{ padding: '0 0 8px' }}>
            {loading ? <p style={{padding: '12px 20px', color: '#64748B', fontSize: '0.85rem'}}>Loading...</p> : myAppts.slice(0, 4).map(a => (
              <div key={a.id} style={historyItem}>
                <div className="doc-avatar" style={{ background: '#F1F5F9', color: '#475569' }}>
                  {(a.doctorName || 'DR').split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.doctorName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{a.date} · {a.type}</div>
                </div>
                {statusBadge(a.status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card fade-up" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Recommended Doctors</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patient/find-doctors')}>
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
            {docsData.filter(d => d.available).slice(0, 4).map(doc => (
              <div key={doc.id} style={docCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div className="doc-avatar" style={{ width: 40, height: 40, background: '#DBEAFE', color: '#1D4ED8' }}>{doc.avatar}</div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{doc.specialty}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.75rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                    <Star size={12} fill="#F59E0B" /> {doc.rating}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Rs. {doc.fee} / visit</span>
                </div>
                <button className="btn btn-primary btn-sm w-full" onClick={() => navigate('/patient/find-doctors')}>Book</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const banner = {
  background: 'linear-gradient(135deg,#1D4ED8,#2563EB)',
  borderRadius: 14, padding: '24px 28px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  marginBottom: 24, color: 'white',
};
const bannerTitle = { fontFamily: "'Lexend',sans-serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' };
const bannerSub = { fontSize: '0.875rem', opacity: 0.85 };

const apptCard = { display: 'flex', flexDirection: 'column', gap: 0 };
const apptCardTop = { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 };
const apptMeta = { display: 'flex', gap: 16, fontSize: '0.8rem', color: '#64748B', alignItems: 'center' };
apptMeta['& span'] = { display: 'flex', alignItems: 'center', gap: 4 };
const apptNote = { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem', color: '#475569', marginTop: 10 };

const historyItem = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #F1F5F9' };

const docCard = {
  background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12,
  padding: '14px', transition: 'all 0.18s ease',
};