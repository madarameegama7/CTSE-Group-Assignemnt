import { useState } from 'react';
import { APPOINTMENTS } from '../../utils/mockData';
import { Search, FileText, CalendarDays } from 'lucide-react';

const getPatients = () => {
  const seen = new Set();
  const patients = [];
  APPOINTMENTS.filter(a => a.doctorId === 'd1').forEach(a => {
    if (!seen.has(a.patientId)) {
      seen.add(a.patientId);
      const appts = APPOINTMENTS.filter(x => x.patientId === a.patientId && x.doctorId === 'd1');
      const last  = appts.sort((x, y) => y.date.localeCompare(x.date))[0];
      patients.push({
        id:         a.patientId,
        name:       a.patientName,
        initials:   a.patientName.split(' ').map(w => w[0]).join(''),
        visits:     appts.length,
        lastVisit:  last.date,
        lastType:   last.type,
        lastStatus: last.status,
      });
    }
  });
  return patients;
};

export default function DoctorPatients() {
  const [search, setSearch] = useState('');
  const patients = getPatients().filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrap" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={15} />
          <input
            className="form-input search-input"
            placeholder="Search patients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card fade-up">
        <div className="card-header">
          <span className="card-title">Patient Directory</span>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{patients.length} patients</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Total Visits</th>
                <th>Last Visit</th>
                <th>Last Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="doc-avatar" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                        {p.initials}
                      </div>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B' }}>{p.visits} visit{p.visits !== 1 ? 's' : ''}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem', color: '#64748B' }}>
                      <CalendarDays size={13} /> {p.lastVisit}
                    </span>
                  </td>
                  <td><span className="badge badge-slate">{p.lastType}</span></td>
                  <td>
                    {p.lastStatus === 'COMPLETED'
                      ? <span className="badge badge-green">Completed</span>
                      : p.lastStatus === 'CONFIRMED'
                        ? <span className="badge badge-blue">Active</span>
                        : <span className="badge badge-slate">{p.lastStatus}</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm"><FileText size={13} /> Records</button>
                      <button className="btn btn-primary btn-sm"><CalendarDays size={13} /> Book</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}