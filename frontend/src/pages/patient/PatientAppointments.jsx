import { useState } from 'react';
import usePatientAppointments from '../../hooks/usePatientAppointments';
import { CalendarDays, Clock, Search, Filter } from 'lucide-react';

const TABS = ['All','Upcoming','Completed','Cancelled'];

const badge = s => {
  const m = { CONFIRMED:'badge-blue', PENDING:'badge-amber', COMPLETED:'badge-green', CANCELLED:'badge-slate' };
  const l = { CONFIRMED:'Confirmed', PENDING:'Pending', COMPLETED:'Completed', CANCELLED:'Cancelled' };
  return <span className={`badge ${m[s]||'badge-slate'}`}>{l[s]||s}</span>;
};

export default function PatientAppointments() {
  const [tab, setTab]       = useState('All');
  const [search, setSearch] = useState('');
  const { appointments: all, loading } = usePatientAppointments();

  const filtered = all.filter(a => {
    const matchTab =
      tab === 'All' ||
      (tab === 'Upcoming'  && (a.status==='CONFIRMED'||a.status==='PENDING')) ||
      (tab === 'Completed' && a.status==='COMPLETED') ||
      (tab === 'Cancelled' && a.status==='CANCELLED');
    const matchSearch = a.doctorName.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
        <div className="search-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={15} />
          <input
            className="form-input search-input"
            placeholder="Search by doctor or specialty…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-outline"><Filter size={14} /> Filter</button>
      </div>

      <div style={tabBar}>
        {TABS.map(t => (
          <button key={t} style={{ ...tabBtn, ...(tab===t ? tabActive : {}) }} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.length === 0 ? (
          <div className="card"><div className="empty-state"><CalendarDays size={36} /><p>No appointments found.</p></div></div>
        ) : filtered.map(a => (
          <div className="card fade-up" key={a.id} style={{ padding:0, overflow:'hidden' }}>
            <div style={apptRow}>
              <div style={{ width:4, background: a.status==='CONFIRMED'?'#2563EB':a.status==='PENDING'?'#F59E0B':a.status==='COMPLETED'?'#16A34A':'#CBD5E1', flexShrink:0, alignSelf:'stretch' }} />

              <div className="doc-avatar" style={{ background:'#DBEAFE', color:'#1D4ED8', margin:'0 4px' }}>
                {(a.doctorName || 'DR').split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#0F172A' }}>{a.doctorName}</span>
                  {badge(a.status)}
                  <span className="badge badge-slate">{a.type}</span>
                </div>
                <div style={{ fontSize:'0.78rem', color:'#64748B', marginBottom:4 }}>{a.specialty}</div>
                <div style={{ display:'flex', gap:16, fontSize:'0.78rem', color:'#94A3B8' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><CalendarDays size={12} />{a.date}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={12} />{a.time}</span>
                  <span style={{ fontWeight:600, color:'#475569' }}>${a.fee}</span>
                </div>
                {a.notes && <div style={noteStyle}>{a.notes}</div>}
              </div>

              {(a.status==='CONFIRMED'||a.status==='PENDING') && (
                <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                  <button className="btn btn-outline btn-sm">Reschedule</button>
                  <button className="btn btn-danger btn-sm">Cancel</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const tabBar    = { display:'flex', gap:4, marginBottom:16, background:'#F1F5F9', padding:'4px', borderRadius:10, width:'fit-content' };
const tabBtn    = { padding:'6px 16px', border:'none', background:'transparent', borderRadius:8, fontSize:'0.82rem', fontWeight:500, color:'#64748B', cursor:'pointer', transition:'all 0.18s ease' };
const tabActive = { background:'white', color:'#1E293B', fontWeight:700, boxShadow:'0 1px 3px rgba(0,0,0,0.08)' };
const apptRow   = { display:'flex', alignItems:'center', gap:14, padding:'16px 18px' };
const noteStyle = { marginTop:6, background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:6, padding:'5px 10px', fontSize:'0.75rem', color:'#64748B' };