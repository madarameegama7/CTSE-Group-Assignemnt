import { useState } from 'react';
import { SLOTS } from '../../utils/mockData';
import { Clock, Save } from 'lucide-react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const DEFAULT_HOURS = {
  Monday:    { active:true,  from:'09:00', to:'17:00' },
  Tuesday:   { active:true,  from:'09:00', to:'17:00' },
  Wednesday: { active:true,  from:'10:00', to:'18:00' },
  Thursday:  { active:true,  from:'09:00', to:'17:00' },
  Friday:    { active:true,  from:'09:00', to:'15:00' },
  Saturday:  { active:false, from:'10:00', to:'14:00' },
};

export default function DoctorSchedule() {
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [slots, setSlots] = useState(SLOTS);
  const [saved, setSaved] = useState(false);

  const toggleDay  = d => setHours(h => ({ ...h, [d]: { ...h[d], active: !h[d].active } }));
  const changeFrom = (d,v) => setHours(h => ({ ...h, [d]: { ...h[d], from: v } }));
  const changeTo   = (d,v) => setHours(h => ({ ...h, [d]: { ...h[d], to: v }   }));
  const toggleSlot = id => setSlots(s => s.map(sl => sl.id===id ? { ...sl, available:!sl.available } : sl));

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Weekly hours */}
      <div className="card fade-up">
        <div className="card-header">
          <span className="card-title">Weekly Working Hours</span>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={13} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
        <div className="card-body">
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {DAYS.map(d => {
              const h = hours[d];
              return (
                <div key={d} style={dayRow}>
                  <label style={dayToggle}>
                    <div
                      style={{ ...toggle, background: h.active ? '#0D9488' : '#E2E8F0' }}
                      onClick={() => toggleDay(d)}
                    >
                      <div style={{ ...toggleThumb, transform: h.active ? 'translateX(20px)' : 'translateX(2px)' }} />
                    </div>
                    <span style={{ width:96, fontWeight: h.active ? 600 : 400, color: h.active ? '#0F172A' : '#94A3B8', fontSize:'0.875rem' }}>{d}</span>
                  </label>

                  {h.active ? (
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <input type="time" value={h.from} onChange={e=>changeFrom(d,e.target.value)} style={timeInput} />
                      <span style={{ color:'#94A3B8', fontSize:'0.82rem' }}>to</span>
                      <input type="time" value={h.to}   onChange={e=>changeTo(d,e.target.value)}   style={timeInput} />
                    </div>
                  ) : (
                    <span style={{ fontSize:'0.82rem', color:'#CBD5E1' }}>Day Off</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slot management */}
      <div className="card fade-up">
        <div className="card-header">
          <span className="card-title">Today's Slot Availability</span>
          <div style={{ fontSize:'0.78rem', color:'#94A3B8' }}>Click to toggle availability</div>
        </div>
        <div className="card-body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10 }}>
            {slots.map(s => (
              <button
                key={s.id}
                onClick={() => toggleSlot(s.id)}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                  padding:'10px 12px', borderRadius:9, border:'1.5px solid',
                  cursor:'pointer', fontSize:'0.82rem', fontWeight:600, transition:'all 0.18s ease',
                  borderColor: s.available ? '#0D9488' : '#E2E8F0',
                  background:  s.available ? '#F0FDFA' : '#F8FAFC',
                  color:       s.available ? '#0D9488' : '#CBD5E1',
                }}
              >
                <Clock size={13} />
                {s.time}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:16, marginTop:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.75rem', color:'#64748B' }}>
              <div style={{ width:12, height:12, borderRadius:3, background:'#0D9488' }} /> Available
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.75rem', color:'#94A3B8' }}>
              <div style={{ width:12, height:12, borderRadius:3, background:'#E2E8F0' }} /> Blocked
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const dayRow    = { display:'flex', alignItems:'center', gap:20, padding:'10px 0', borderBottom:'1px solid #F1F5F9' };
const dayToggle = { display:'flex', alignItems:'center', gap:10, cursor:'pointer', userSelect:'none' };
const toggle    = { width:42, height:24, borderRadius:12, position:'relative', cursor:'pointer', transition:'background 0.2s ease', flexShrink:0 };
const toggleThumb = { position:'absolute', top:2, width:20, height:20, borderRadius:'50%', background:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.2)', transition:'transform 0.2s ease' };
const timeInput = { padding:'6px 10px', border:'1px solid #E2E8F0', borderRadius:7, fontSize:'0.82rem', fontFamily:'inherit', color:'#334155', outline:'none' };