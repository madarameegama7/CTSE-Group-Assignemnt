import { useState } from 'react';

import useDoctors from '../../hooks/useDoctors';
import useAllUsers from '../../hooks/useAllUsers';
import { useAuth } from '../../context/Authcontext';
import { api } from '../../services/api';
import { Search, Star, Filter, X, CalendarDays, Clock, CheckCircle2 } from 'lucide-react';

const SPECIALTIES = ['All','Cardiologist','Neurologist','Orthopedic','Dermatologist','Pediatrician','Psychiatrist'];

  const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function FindDoctors() {
  const [search, setSearch]     = useState('');
  const [spec, setSpec]         = useState('All');
  const [booking, setBooking]   = useState(null); 
  const [step, setStep]         = useState(1);    
  const [selSlot, setSelSlot]   = useState(null);
  const [selDate, setSelDate]   = useState(getTodayDate());
  const [apptType, setApptType] = useState('Consultation');

  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const { doctors: docsData, loading } = useDoctors();
  const { users: usersData } = useAllUsers();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const combined = [...docsData];
    if (usersData && usersData.length > 0) {
      usersData.filter(u => u.role === 'DOCTOR').forEach(userDoc => {
        const exists = combined.find(d => 
          (d.email && d.email !== 'N/A' && userDoc.email && userDoc.email !== 'N/A' && d.email.toLowerCase() === userDoc.email.toLowerCase()) || 
          (d.name && userDoc.name && d.name.toLowerCase() === userDoc.name.toLowerCase())
        );
        if (!exists) {
          combined.push({
            id: 'usr_' + userDoc.id,
            name: userDoc.name || 'Unknown Doctor',
            email: userDoc.email || 'N/A',
            specialty: 'General',
            department: 'General',
            experience: 'Unknown',
            fee: 150,
            available: true,
            rating: 0,
            reviews: 0,
            avatar: (userDoc.name || 'Unknown Doctor').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase(),
            nextSlot: 'Not set'
          });
        }
      });
    }
    setDoctors(combined);
  }, [docsData, usersData]);

  const docs = doctors.filter(d => {
    const ms = spec === 'All' || d.specialty === spec;
    const name = d.name || '';
    const specialty = d.specialty || '';
    const mq = name.toLowerCase().includes(search.toLowerCase()) || specialty.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const loadSlots = async (docId, d) => {
    setSlotsLoading(true); setSelSlot(null);
    try {
      const resp = await api.get(`/doctors/${docId}/slots`);
      const filtered = resp.filter(s => s.date === d);
      setAvailableSlots(filtered.map(s => ({
        id: s.slotId,
        time: s.startTime.substring(0, 5),
        available: s.available
      })));
    } catch(err) {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const openBooking = doc => { 
    setBooking(doc); setStep(1); setSelSlot(null); setErrorMsg(''); 
    loadSlots(doc.id, selDate);
  };
  const closeBooking = () => { setBooking(null); setStep(1); setErrorMsg(''); };

  const handleDateChange = (e) => {
    const d = e.target.value;
    setSelDate(d);
    if (booking) loadSlots(booking.id, d);
  };

  const handleBook = async () => {
    if (step === 1 && selSlot) setStep(2);
    else if (step === 2) {
      if (!user) {
        setErrorMsg('Please log in to confirm booking.');
        return;
      }
      setIsProcessing(true);
      setErrorMsg('');
      try {
        const apptData = await api.post('/appointments', {
            patientId: user.userId,
            doctorId: parseInt(booking.id),
            date: selDate,
            time: selSlot.time + ":00"
        });
        
        setStep(3);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div className="search-wrap" style={{ flex:1, minWidth:220 }}>
          <Search size={15} />
          <input className="form-input search-input" placeholder="Search doctors…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width:180 }} value={spec} onChange={e=>setSpec(e.target.value)}>
          {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-outline"><Filter size={14} /> Filter</button>
      </div>

      <p style={{ fontSize:'0.8rem', color:'#94A3B8', marginBottom:16 }}>
        {loading ? 'Loading doctors...' : `${docs.length} doctors found`}
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {docs.map(doc => (
          <div className="card fade-up" key={doc.id}>
            <div style={{ padding:'20px 20px 16px' }}>
              <div style={{ display:'flex', gap:14, marginBottom:14 }}>
                <div className="doc-avatar" style={{ width:52, height:52, fontSize:'0.85rem', background:'#DBEAFE', color:'#1D4ED8', flexShrink:0 }}>{doc.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#0F172A', marginBottom:2 }}>{doc.name}</div>
                  <div style={{ fontSize:'0.78rem', color:'#64748B' }}>{doc.specialty} · {doc.experience}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5 }}>
                    <span style={{ fontSize:'0.75rem', color:'#F59E0B', display:'flex', alignItems:'center', gap:3, fontWeight:600 }}>
                      <Star size={11} fill="#F59E0B" />{doc.rating}
                    </span>
                    <span style={{ fontSize:'0.72rem', color:'#CBD5E1' }}>·</span>
                    <span style={{ fontSize:'0.72rem', color:'#94A3B8' }}>{doc.reviews} reviews</span>
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #F1F5F9', paddingTop:12 }}>
                <div>
                  <div style={{ fontSize:'0.78rem', color:'#94A3B8' }}>Consultation fee</div>
                  <div style={{ fontWeight:700, fontSize:'1rem', color:'#0F172A' }}>Rs. {doc.fee}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'0.72rem', color:'#94A3B8', marginBottom:2 }}>Availability</div>
                  <span className={`badge ${doc.available ? 'badge-green' : 'badge-slate'}`} style={{ fontSize:'0.7rem' }}>{doc.nextSlot}</span>
                </div>
              </div>
            </div>
            <div style={{ padding:'0 20px 16px' }}>
              <button
                className="btn btn-primary w-full"
                disabled={!doc.available}
                onClick={() => openBooking(doc)}
                style={{ justifyContent:'center' }}
              >
                {doc.available ? 'Book Appointment' : 'Not Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {booking && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeBooking(); }}>
          <div className="modal" style={{ maxWidth: step===3 ? 400 : 520 }}>
            {step < 3 && (
              <div className="modal-header">
                <div>
                  <div className="modal-title">{step===1 ? 'Select a Slot' : 'Confirm Booking'}</div>
                  <div style={{ fontSize:'0.78rem', color:'#94A3B8', marginTop:2 }}>{booking.name} · {booking.specialty}</div>
                </div>
                <button className="icon-btn" onClick={closeBooking}><X size={16} /></button>
              </div>
            )}
            <div className="modal-body">
              {step === 1 && (
                <>
                  <div className="grid-2" style={{ marginBottom:16 }}>
                    <div className="form-group" style={{ marginBottom:0 }}>
                      <label className="form-label">Date</label>
                      <input type="date" className="form-input" value={selDate} onChange={handleDateChange} />
                    </div>
                    <div className="form-group" style={{ marginBottom:0 }}>
                      <label className="form-label">Type</label>
                      <select className="form-select" value={apptType} onChange={e=>setApptType(e.target.value)}>
                        {['Consultation','Check-up','Follow-up'].map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <label className="form-label">Available Slots</label>
                  
                  {slotsLoading ? <p style={{fontSize:'0.8rem', color:'#64748B'}}>Loading slots...</p> : 
                    availableSlots.length === 0 ? <p style={{fontSize:'0.8rem', color:'#EF4444'}}>No time slots found for this date.</p> :
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                    {availableSlots.map(s => (
                      <button
                        key={s.id}
                        disabled={!s.available}
                        onClick={() => setSelSlot(s)}
                        style={{
                          ...slotBtn,
                          ...(selSlot?.id===s.id ? slotActive : {}),
                          ...(s.available ? {} : slotDisabled),
                        }}
                      >
                        <Clock size={12} />
                        {s.time}
                      </button>
                    ))}
                  </div>}
                </>
              )}

              {step === 2 && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={confirmRow}><span>Doctor</span><strong>{booking.name}</strong></div>
                  <div style={confirmRow}><span>Specialty</span><strong>{booking.specialty}</strong></div>
                  <div style={confirmRow}><span>Date</span><strong>{selDate}</strong></div>
                  <div style={confirmRow}><span>Time</span><strong>{selSlot?.time}</strong></div>
                  <div style={confirmRow}><span>Type</span><strong>{apptType}</strong></div>
                  <div style={confirmRow}><span>Fee</span><strong>Rs. {booking.fee}</strong></div>
                  {errorMsg && <div style={{ color:'#EF4444', fontSize:'0.85rem', textAlign:'center', marginTop:10, padding:'8px', background:'#FEF2F2', borderRadius:'6px' }}>{errorMsg}</div>}
                </div>
              )}

              {step === 3 && (
                <div style={{ textAlign:'center', padding:'20px 0' }}>
                  <div style={{ width:64, height:64, background:'#F0FDF4', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                    <CheckCircle2 size={32} color="#16A34A" />
                  </div>
                  <h3 style={{ fontFamily:"'Lexend',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#0F172A', marginBottom:8 }}>Appointment Booked!</h3>
                  <p style={{ fontSize:'0.85rem', color:'#64748B', marginBottom:20 }}>
                    Your appointment with <strong>{booking.name}</strong> is confirmed for <strong>{selDate}</strong> at <strong>{selSlot?.time}</strong>.
                  </p>
                  <button className="btn btn-primary" onClick={closeBooking} style={{ margin:'0 auto' }}>Done</button>
                </div>
              )}
            </div>

            {step < 3 && (
              <div className="modal-footer">
                <button className="btn btn-outline" disabled={isProcessing} onClick={step===1 ? closeBooking : ()=>setStep(1)}>
                  {step===1 ? 'Cancel' : 'Back'}
                </button>
                <button className="btn btn-primary" onClick={handleBook} disabled={(step===1&&!selSlot) || isProcessing}>
                  {isProcessing ? 'Processing...' : (step===1 ? 'Continue' : 'Confirm Booking')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const slotBtn = {
  display:'flex', alignItems:'center', justifyContent:'center', gap:5,
  padding:'8px 6px', border:'1.5px solid #E2E8F0', borderRadius:8,
  background:'white', fontSize:'0.78rem', fontWeight:500, color:'#334155',
  cursor:'pointer', transition:'all 0.18s ease',
};
const slotActive   = { borderColor:'#2563EB', background:'#EFF6FF', color:'#1D4ED8', fontWeight:700 };
const slotDisabled = { opacity:0.4, cursor:'not-allowed', background:'#F8FAFC' };
const confirmRow   = { display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F1F5F9', fontSize:'0.85rem', color:'#64748B' };