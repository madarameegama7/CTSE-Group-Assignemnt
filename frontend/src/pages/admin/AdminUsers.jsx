import { useState } from 'react';
import { USERS_LIST } from '../../utils/mockData';
import { Search, Plus, MoreHorizontal, UserCheck, Users, Shield } from 'lucide-react';

const roleBadge = r => {
  if (r==='ADMIN')   return <span className="badge badge-red">Admin</span>;
  if (r==='DOCTOR')  return <span className="badge" style={{ background:'#F0FDFA', color:'#0D9488' }}>Doctor</span>;
  return <span className="badge badge-blue">Patient</span>;
};

const statusBadge = s =>
  s==='ACTIVE'
    ? <span className="badge badge-green">Active</span>
    : <span className="badge badge-slate">Inactive</span>;

const ROLE_TABS = ['All','PATIENT','DOCTOR','ADMIN'];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleTab, setRoleTab] = useState('All');

  const filtered = USERS_LIST.filter(u => {
    const mr = roleTab==='All' || u.role===roleTab;
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return mr && ms;
  });

  const counts = { ALL:USERS_LIST.length, PATIENT:USERS_LIST.filter(u=>u.role==='PATIENT').length, DOCTOR:USERS_LIST.filter(u=>u.role==='DOCTOR').length, ADMIN:USERS_LIST.filter(u=>u.role==='ADMIN').length };

  return (
    <div>
      {/* Summary tiles */}
      <div className="stats-grid" style={{ marginBottom:24 }}>
        {[
          { label:'Total Users',  value:counts.ALL,     icon:Users,     color:'#2563EB', bg:'#EFF6FF' },
          { label:'Patients',     value:counts.PATIENT, icon:Users,     color:'#0D9488', bg:'#F0FDFA' },
          { label:'Doctors',      value:counts.DOCTOR,  icon:UserCheck, color:'#7C3AED', bg:'#F5F3FF' },
          { label:'Admins',       value:counts.ADMIN,   icon:Shield,    color:'#D97706', bg:'#FFFBEB' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div className="stat-tile fade-up" key={s.label}>
              <div className="stat-tile-top">
                <div className="stat-tile-icon" style={{ background:s.bg, color:s.color }}><Icon size={18} /></div>
              </div>
              <div className="stat-tile-value">{s.value}</div>
              <div className="stat-tile-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="card fade-up">
        {/* Toolbar */}
        <div style={{ display:'flex', gap:12, padding:'16px 20px', borderBottom:'1px solid #F1F5F9', flexWrap:'wrap', alignItems:'center' }}>
          <div className="search-wrap" style={{ flex:1, minWidth:200 }}>
            <Search size={15} />
            <input className="form-input search-input" placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div style={tabBar}>
            {ROLE_TABS.map(t => (
              <button key={t} style={{ ...tabBtn, ...(roleTab===t ? tabActive : {}) }} onClick={()=>setRoleTab(t)}>
                {t==='All'?'All':t.charAt(0)+t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Add User</button>
        </div>

        {/* Table */}
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
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="doc-avatar" style={{
                        background: u.role==='ADMIN'?'#F5F3FF':u.role==='DOCTOR'?'#F0FDFA':'#EFF6FF',
                        color: u.role==='ADMIN'?'#7C3AED':u.role==='DOCTOR'?'#0D9488':'#2563EB',
                      }}>
                        {u.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                      </div>
                      <span style={{ fontWeight:600, fontSize:'0.86rem', color:'#0F172A' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color:'#64748B', fontSize:'0.82rem' }}>{u.email}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>{statusBadge(u.status)}</td>
                  <td style={{ color:'#94A3B8', fontSize:'0.78rem' }}>{u.joined}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ padding:'4px 8px' }}>
                      <MoreHorizontal size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding:'12px 20px', borderTop:'1px solid #F1F5F9', fontSize:'0.78rem', color:'#94A3B8' }}>
          Showing {filtered.length} of {USERS_LIST.length} users
        </div>
      </div>
    </div>
  );
}

const tabBar    = { display:'flex', gap:4, background:'#F1F5F9', padding:'4px', borderRadius:8 };
const tabBtn    = { padding:'5px 12px', border:'none', background:'transparent', borderRadius:6, fontSize:'0.78rem', fontWeight:500, color:'#64748B', cursor:'pointer', transition:'all 0.18s ease' };
const tabActive = { background:'white', color:'#1E293B', fontWeight:700, boxShadow:'0 1px 3px rgba(0,0,0,0.08)' };