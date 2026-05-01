import { useState, useEffect } from 'react';
import useAllUsers from '../../hooks/useAllUsers';
import useDoctors from '../../hooks/useDoctors';
import { api } from '../../services/api';
import { Search, Plus, MoreHorizontal, UserCheck, Users, Shield, X } from 'lucide-react';

const roleBadge = r => {
  if (r === 'ADMIN')  return <span className="badge badge-red">Admin</span>;
  if (r === 'DOCTOR') return <span className="badge" style={{ background: '#F0FDFA', color: '#0D9488' }}>Doctor</span>;
  return <span className="badge badge-blue">Patient</span>;
};

const statusBadge = s =>
  s === 'ACTIVE'
    ? <span className="badge badge-green">Active</span>
    : <span className="badge badge-slate">Inactive</span>;

const ROLE_TABS = ['All', 'PATIENT', 'DOCTOR', 'ADMIN'];

const EMPTY_FORM = { name: '', email: '', role: 'PATIENT', status: 'ACTIVE', password: '' };

export default function AdminUsers() {
  const { users: usersData } = useAllUsers();
  const { doctors: doctorsData } = useDoctors();
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [roleTab, setRoleTab]   = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const combined = [...usersData];
    if (doctorsData && doctorsData.length > 0) {
      doctorsData.forEach(doc => {
        const exists = combined.find(u => 
          (u.email && u.email !== 'N/A' && doc.email && doc.email !== 'N/A' && u.email.toLowerCase() === doc.email.toLowerCase()) || 
          u.name.toLowerCase() === doc.name.toLowerCase()
        );
        if (!exists) {
          combined.push({
            id: 'doc_' + doc.id,
            name: doc.name,
            email: doc.email || 'N/A',
            role: 'DOCTOR',
            status: 'ACTIVE',
            joined: 'Unknown'
          });
        }
      });
    }
    setUsers(combined);
  }, [usersData, doctorsData]);

  const filtered = users.filter(u => {
    const mr = roleTab === 'All' || u.role === roleTab;
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) ||
               u.email.toLowerCase().includes(search.toLowerCase());
    return mr && ms;
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (users.find(u => u.email === form.email)) e.email = 'Email already exists';
    if (!form.password.trim()) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        address: "Hospital",
        phone: ""
      };
      
      const res = await api.post('/auth/register', payload);

      const newUser = {
        id:     res.userId ? res.userId.toString() : 'u' + Date.now(),
        name:   form.name.trim(),
        email:  form.email.trim(),
        role:   form.role,
        status: form.status,
        joined: new Date().toISOString().slice(0, 10),
      };
      // If the admin is creating a DOCTOR from the general User Tab, 
      // automatically provision a default Medical Profile in the Doctor microservice!
      if (form.role === 'DOCTOR') {
        try {
          const docPayload = {
            name: form.name.trim(),
            specialization: 'General',
            hospital: 'System Default',
            email: form.email.trim(),
            phone: ''
          };
          await api.post('/doctors', docPayload);
        } catch (doctorErr) {
          console.error("Warning: Could not provision default doctor profile", doctorErr);
        }
      }

      setUsers(prev => [newUser, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      setErrors({});
      setSuccessMsg(`User "${newUser.name}" added successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error adding user:', error);
      setErrors({ submit: error.message || 'Failed to add user' });
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setErrors({}); };

  return (
    <div>
      {successMsg && (
        <div style={toast}>
          ✓ {successMsg}
        </div>
      )}

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: users.length,                              icon: Users,     color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Patients',    value: users.filter(u=>u.role==='PATIENT').length, icon: Users,     color: '#0D9488', bg: '#F0FDFA' },
          { label: 'Doctors',     value: users.filter(u=>u.role==='DOCTOR').length,  icon: UserCheck, color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Admins',      value: users.filter(u=>u.role==='ADMIN').length,   icon: Shield,    color: '#D97706', bg: '#FFFBEB' },
        ].map(s => {
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

      <div className="card fade-up">
        <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search size={15} />
            <input className="form-input search-input" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={tabBar}>
            {ROLE_TABS.map(t => (
              <button key={t} style={{ ...tabBtn, ...(roleTab === t ? tabActive : {}) }} onClick={() => setRoleTab(t)}>
                {t === 'All' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Add User
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="doc-avatar" style={{
                        background: u.role==='ADMIN'?'#F5F3FF':u.role==='DOCTOR'?'#F0FDFA':'#EFF6FF',
                        color: u.role==='ADMIN'?'#7C3AED':u.role==='DOCTOR'?'#0D9488':'#2563EB',
                      }}>
                        {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B', fontSize: '0.82rem' }}>{u.email}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>{statusBadge(u.status)}</td>
                  <td style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{u.joined}</td>
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
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Add New User</span>
              <button className="icon-btn" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. John Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name && <span style={errText}>{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <span style={errText}>{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  {errors.password && <span style={errText}>{errors.password}</span>}
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    >
                      <option value="PATIENT">Patient</option>
                      <option value="DOCTOR">Doctor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner" /> : <><Plus size={14} /> Add User</>}
                  </button>
                  {errors.submit && <span style={errText}>{errors.submit}</span>}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const tabBar    = { display: 'flex', gap: 4, background: '#F1F5F9', padding: '4px', borderRadius: 8 };
const tabBtn    = { padding: '5px 12px', border: 'none', background: 'transparent', borderRadius: 6, fontSize: '0.78rem', fontWeight: 500, color: '#64748B', cursor: 'pointer', transition: 'all 0.18s ease' };
const tabActive = { background: 'white', color: '#1E293B', fontWeight: 700, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
const errText   = { fontSize: '0.75rem', color: '#EF4444', marginTop: 3 };
const toast     = { position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#16A34A', color: 'white', padding: '12px 20px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'fadeUp 0.3s ease' };