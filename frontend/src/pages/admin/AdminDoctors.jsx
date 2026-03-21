import { useState } from 'react';
import { DOCTORS } from '../../utils/mockData';
import { Search, Plus, Star, MoreHorizontal, CheckCircle2, XCircle, X } from 'lucide-react';

const SPECIALTIES = ['Cardiologist','Neurologist','Orthopedic','Dermatologist','Pediatrician','Psychiatrist'];
const DEPARTMENTS  = ['Cardiology','Neurology','Orthopedics','Dermatology','Pediatrics','Psychiatry'];
const EMPTY_FORM   = { name:'', email:'', specialty:'Cardiologist', department:'Cardiology', experience:'', fee:'', available:true };

export default function AdminDoctors() {
  const [doctors, setDoctors]   = useState(DOCTORS);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
    if (!form.experience.trim()) e.experience = 'Experience is required';
    if (!form.fee || isNaN(form.fee) || Number(form.fee) <= 0) e.fee = 'Enter a valid fee';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    const initials = form.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const newDoc = {
      id:         'd' + Date.now(),
      name:       form.name.trim(),
      email:      form.email.trim(),
      specialty:  form.specialty,
      department: form.department,
      experience: form.experience.trim(),
      fee:        Number(form.fee),
      available:  form.available,
      rating:     0,
      reviews:    0,
      avatar:     initials,
      nextSlot:   'Not set',
    };
    setDoctors(prev => [newDoc, ...prev]);
    setSaving(false);
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccessMsg(`Dr. ${newDoc.name} added successfully!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setErrors({}); };

  return (
    <div>
      {/* Toast */}
      {successMsg && (
        <div style={toast}>✓ {successMsg}</div>
      )}

      {/* Stats */}
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
        {/* Toolbar */}
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

        {/* Table */}
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
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>
                      <MoreHorizontal size={15} />
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

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <span className="modal-title">Add New Doctor</span>
              <button className="icon-btn" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Name + Email */}
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

                {/* Specialty + Department */}
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

                {/* Experience + Fee */}
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

                {/* Availability toggle */}
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
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : <><Plus size={14} /> Add Doctor</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const errText = { fontSize: '0.75rem', color: '#EF4444', marginTop: 3 };
const toast   = { position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#16A34A', color: 'white', padding: '12px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'fadeUp 0.3s ease' };