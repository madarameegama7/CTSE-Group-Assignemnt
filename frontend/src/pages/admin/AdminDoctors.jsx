import { useState } from 'react';
import { DOCTORS } from '../../utils/mockData';
import { Search, Plus, Star, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminDoctors() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const DEPTS = ['All', ...new Set(DOCTORS.map(d => d.department))];

  const filtered = DOCTORS.filter(d => {
    const md = filter === 'All' || d.department === filter;
    const ms =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    return md && ms;
  });

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Doctors',   value: DOCTORS.length },
          { label: 'Available Today', value: DOCTORS.filter(d => d.available).length },
          { label: 'Departments',     value: new Set(DOCTORS.map(d => d.department)).size },
          { label: 'Avg Rating',      value: (DOCTORS.reduce((s, d) => s + d.rating, 0) / DOCTORS.length).toFixed(1) },
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
            <input
              className="form-input search-input"
              placeholder="Search doctors…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 180 }}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <button className="btn btn-primary btn-sm">
            <Plus size={13} /> Add Doctor
          </button>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Rating</th>
                <th>Fee</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="doc-avatar" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                        {doc.avatar}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B' }}>{doc.specialty}</td>
                  <td><span className="badge badge-slate">{doc.department}</span></td>
                  <td style={{ color: '#64748B', fontSize: '0.82rem' }}>{doc.experience}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', fontWeight: 600, color: '#D97706' }}>
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      {doc.rating}
                      <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: '0.75rem' }}>
                        ({doc.reviews})
                      </span>
                    </span>
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
          Showing {filtered.length} of {DOCTORS.length} doctors
        </div>
      </div>
    </div>
  );
}