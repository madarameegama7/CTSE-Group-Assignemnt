import { useState, useEffect } from 'react';
import useDoctors from '../../hooks/useDoctors';
import useDoctorSlots from '../../hooks/useDoctorSlots';
import { api } from '../../services/api';
import { Search, Plus, Star, MoreHorizontal, CheckCircle2, XCircle, X, Clock, Trash2 } from 'lucide-react';

const SPECIALTIES = ['Cardiologist','Neurologist','Orthopedic','Dermatologist','Pediatrician','Psychiatrist'];
const DEPARTMENTS  = ['Cardiology','Neurology','Orthopedics','Dermatology','Pediatrics','Psychiatry'];
const EMPTY_FORM   = { name:'', email:'', password:'', specialty:'Cardiologist', department:'Cardiology', experience:'', fee:'', available:true };

export default function AdminDoctors() {
  const { doctors: doctorsData } = useDoctors();
  const [doctors, setDoctors]   = useState([]);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const { slots, loading: slotsLoading, createSlot, deleteSlot } = useDoctorSlots(selectedDocId);
  const [slotForm, setSlotForm] = useState({ date: '', startTime: '', endTime: '' });
  const [slotErrors, setSlotErrors] = useState({});

  useEffect(() => {
    setDoctors(doctorsData);
  }, [doctorsData]);

  const DEPTS = ['All', ...new Set(doctors.map(d => d.department))];

  const filtered = doctors.filter(d => {
    const md = filter === 'All' || d.department === filter;
    const ms = d.name.toLowerCase().includes(search.toLowerCase()) ||
               d.specialty.toLowerCase().includes(search.toLowerCase());
    return md && ms;
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Doctor name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (doctors.find(d => d.email === form.email)) e.email = 'Email already exists';
    if (!form.password.trim()) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Must be 8+ chars and strong';
    if (!form.experience.trim()) e.experience = 'Experience is required';
    if (!form.fee || isNaN(form.fee) || Number(form.fee) <= 0) e.fee = 'Enter a valid fee';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    try {
      // 1. Create the Authentication Account so the Doctor can log in
      const authPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'DOCTOR',
        address: form.department,
        phone: ''
      };
      await api.post('/auth/register', authPayload);

      // 2. Create the Doctor Profile in the Doctor microservice
      const initials = form.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
      
      const payload = {
        name: form.name.trim(),
        specialization: form.specialty,
        hospital: form.department,
        email: form.email.trim(),
        phone: ''
      };
      
      const res = await api.post('/doctors', payload);

      const newDoc = {
        id:         res.doctorId?.toString() || 'd'+Date.now(),
        name:       res.name,
        email:      res.email,
        specialty:  res.specialization,
        department: res.hospital,
        experience: form.experience.trim(),
        fee:        Number(form.fee),
        available:  form.available,
        rating:     0,
        reviews:    0,
        avatar:     initials,
        nextSlot:   'Not set',
      };
      
      setDoctors(prev => [newDoc, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      setErrors({});
      setSuccessMsg(`Dr. ${newDoc.name} added successfully as a System User and Doctor!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error adding doctor:', error);
      setErrors({ submit: error.message || 'Failed to add doctor to both systems' });
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setErrors({}); };

  const openSlotsModal = (docId) => {
    setSelectedDocId(docId);
    setShowSlotsModal(true);
    setSlotForm({ date: '', startTime: '', endTime: '' });
    setSlotErrors({});
  };

  const closeSlotsModal = () => {
    setShowSlotsModal(false);
    setSelectedDocId(null);
    setSlotForm({ date: '', startTime: '', endTime: '' });
    setSlotErrors({});
  };

  const validateSlot = () => {
    const e = {};
    if (!slotForm.date) e.date = 'Date is required';
    if (!slotForm.startTime) e.startTime = 'Start time is required';
    if (!slotForm.endTime) e.endTime = 'End time is required';
    if (slotForm.startTime && slotForm.endTime && slotForm.startTime >= slotForm.endTime) {
      e.endTime = 'End time must be after start time';
    }
    return e;
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    const e2 = validateSlot();
    if (Object.keys(e2).length) { setSlotErrors(e2); return; }
    
    try {
      await createSlot(slotForm.date, slotForm.startTime, slotForm.endTime);
      setSlotForm({ date: '', startTime: '', endTime: '' });
      setSlotErrors({});
      setSuccessMsg('Slot added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setSlotErrors({ submit: err.message || 'Failed to add slot' });
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await deleteSlot(slotId);
      setSuccessMsg('Slot deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to delete slot:', err);
    }
  };

  return (
    <div>
      {successMsg && (
        <div style={toast}>✓ {successMsg}</div>
      )}

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Doctors',   value: doctors.length },
          { label: 'Available Today', value: doctors.filter(d => d.available).length },
          { label: 'Departments',     value: new Set(doctors.map(d => d.department)).size },
          { label: 'Avg Rating',      value: doctors.filter(d=>d.rating>0).length ? (doctors.filter(d=>d.rating>0).reduce((s,d)=>s+d.rating,0)/doctors.filter(d=>d.rating>0).length).toFixed(1) : '—' },
        ].map(s => (
          <div className="stat-tile fade-up" key={s.label}>
            <div className="stat-tile-value">{s.value}</div>
            <div className="stat-tile-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card fade-up">
        <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search size={15} />
            <input className="form-input search-input" placeholder="Search doctors…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Add Doctor
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Doctor</th><th>Specialty</th><th>Department</th>
                <th>Experience</th><th>Rating</th><th>Fee</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="doc-avatar" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{doc.avatar}</div>
                      <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B' }}>{doc.specialty}</td>
                  <td><span className="badge badge-slate">{doc.department}</span></td>
                  <td style={{ color: '#64748B', fontSize: '0.82rem' }}>{doc.experience}</td>
                  <td>
                    {doc.rating > 0
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', fontWeight: 600, color: '#D97706' }}>
                          <Star size={12} fill="#F59E0B" color="#F59E0B" /> {doc.rating}
                          <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: '0.75rem' }}>({doc.reviews})</span>
                        </span>
                      : <span style={{ color: '#CBD5E1', fontSize: '0.78rem' }}>No ratings yet</span>
                    }
                  </td>
                  <td style={{ fontWeight: 700, color: '#0F172A' }}>${doc.fee}</td>
                  <td>
                    {doc.available
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#16A34A', fontWeight: 600 }}>
                          <CheckCircle2 size={13} /> Available
                        </span>
                      : <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                          <XCircle size={13} /> Unavailable
                        </span>
                    }
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} onClick={() => openSlotsModal(doc.id)}>
                      <Clock size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', fontSize: '0.78rem', color: '#94A3B8' }}>
          Showing {filtered.length} of {doctors.length} doctors
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <span className="modal-title">Add New Doctor</span>
              <button className="icon-btn" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Dr. Jane Smith"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    {errors.name && <span style={errText}>{errors.name}</span>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                    {errors.email && <span style={errText}>{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0, marginTop: 8, paddingBottom: 8 }}>
                  <label className="form-label">Temporary Account Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Must be 8+ chars (e.g. Doctor@1234)"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  {errors.password && <span style={errText}>{errors.password}</span>}
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Specialty *</label>
                    <select
                      className="form-select"
                      value={form.specialty}
                      onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                    >
                      {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Department *</label>
                    <select
                      className="form-select"
                      value={form.department}
                      onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                    >
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Experience *</label>
                    <input
                      className="form-input"
                      placeholder="e.g. 5 years"
                      value={form.experience}
                      onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                    />
                    {errors.experience && <span style={errText}>{errors.experience}</span>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Consultation Fee ($) *</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 150"
                      min="0"
                      value={form.fee}
                      onChange={e => setForm(f => ({ ...f, fee: e.target.value }))}
                    />
                    {errors.fee && <span style={errText}>{errors.fee}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                  <label className="form-label" style={{ margin: 0 }}>Available for Appointments</label>
                  <div
                    style={{ width: 42, height: 24, borderRadius: 12, background: form.available ? '#2563EB' : '#E2E8F0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s ease', flexShrink: 0 }}
                    onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                  >
                    <div style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s ease', transform: form.available ? 'translateX(20px)' : 'translateX(2px)' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: form.available ? '#16A34A' : '#94A3B8', fontWeight: 600 }}>
                    {form.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner" /> : <><Plus size={14} /> Add Doctor</>}
                  </button>
                  {errors.submit && <span style={errText}>{errors.submit}</span>}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSlotsModal && selectedDocId && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeSlotsModal(); }}>
          <div className="modal" style={{ maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <span className="modal-title">
                Manage Slots - {doctors.find(d => d.id === selectedDocId)?.name || 'Doctor'}
              </span>
              <button className="icon-btn" onClick={closeSlotsModal}><X size={16} /></button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: '16px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>Add New Slot</h3>
                <form onSubmit={handleAddSlot} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 120px' }}>
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={slotForm.date}
                      onChange={e => setSlotForm(f => ({ ...f, date: e.target.value }))}
                    />
                    {slotErrors.date && <span style={errText}>{slotErrors.date}</span>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 100px' }}>
                    <label className="form-label">Start Time *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={slotForm.startTime}
                      onChange={e => setSlotForm(f => ({ ...f, startTime: e.target.value }))}
                    />
                    {slotErrors.startTime && <span style={errText}>{slotErrors.startTime}</span>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 100px' }}>
                    <label className="form-label">End Time *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={slotForm.endTime}
                      onChange={e => setSlotForm(f => ({ ...f, endTime: e.target.value }))}
                    />
                    {slotErrors.endTime && <span style={errText}>{slotErrors.endTime}</span>}
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ marginBottom: 0 }}>
                    <Plus size={13} /> Add
                  </button>
                </form>
                {slotErrors.submit && <span style={{ ...errText, display: 'block', marginTop: 8 }}>{slotErrors.submit}</span>}
              </div>

              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>
                  Available Slots ({slots.length})
                </h3>
                {slotsLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>Loading slots...</div>
                ) : slots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No slots available. Add one above.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    {slots.map(slot => (
                      <div
                        key={slot.slotId}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          background: slot.available ? '#F0FDFA' : '#F1F5F9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 8
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
                            {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div style={{ color: '#64748B', fontSize: '0.78rem' }}>
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div style={{
                            marginTop: 4,
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: slot.available ? '#16A34A' : '#94A3B8',
                            background: slot.available ? '#DCFCE7' : '#F1F5F9'
                          }}>
                            {slot.available ? 'Available' : 'Booked'}
                          </div>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px', color: '#EF4444' }}
                          onClick={() => handleDeleteSlot(slot.slotId)}
                          title="Delete slot"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={closeSlotsModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const errText = { fontSize: '0.75rem', color: '#EF4444', marginTop: 3 };
const toast   = { position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#16A34A', color: 'white', padding: '12px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'fadeUp 0.3s ease' };