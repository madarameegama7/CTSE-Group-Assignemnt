import useAppointments from '../../hooks/useAppointments';
import useDoctors from '../../hooks/useDoctors';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const DEPT_DATA = [
  { dept: 'Cardiology',  patients: 312 },
  { dept: 'Neurology',   patients: 198 },
  { dept: 'Orthopedics', patients: 245 },
  { dept: 'Dermatology', patients: 167 },
  { dept: 'Pediatrics',  patients: 289 },
  { dept: 'Psychiatry',  patients: 143 },
];

const MONTHLY_DATA = [
  { month:'Jan', appointments:312, revenue:46800 },
  { month:'Feb', appointments:285, revenue:42750 },
  { month:'Mar', appointments:398, revenue:59700 },
  { month:'Apr', appointments:356, revenue:53400 },
  { month:'May', appointments:421, revenue:63150 },
  { month:'Jun', appointments:389, revenue:58350 },
  { month:'Jul', appointments:445, revenue:66750 },
  { month:'Aug', appointments:412, revenue:61800 },
];

const tooltipStyle = {
  borderRadius: 8, border: '1px solid #E2E8F0',
  fontSize: '0.82rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

export default function AdminReports() {
  const { appointments } = useAppointments();
  const { doctors } = useDoctors();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card fade-up">
          <div className="card-header">
            <span className="card-title">Appointments Over Time</span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Last 8 months</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={MONTHLY_DATA}>
                <defs>
                  <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="appointments" stroke="#2563EB" strokeWidth={2.5} fill="url(#apptGrad)" dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card fade-up">
          <div className="card-header">
            <span className="card-title">Revenue Trend</span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Last 8 months</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2.5} dot={{ fill: '#0D9488', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card fade-up">
        <div className="card-header">
          <span className="card-title">Patients by Department</span>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT_DATA} barSize={28} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="patients" fill="#7C3AED" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card fade-up">
        <div className="card-header">
          <span className="card-title">Top Performing Doctors</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Est. Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[...DOCTORS].sort((a, b) => b.rating - a.rating).map((doc, i) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: 700, color: i < 3 ? '#2563EB' : '#94A3B8' }}>#{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="doc-avatar" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{doc.avatar}</div>
                      <span style={{ fontWeight: 600, fontSize: '0.86rem' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B' }}>{doc.specialty}</td>
                  <td style={{ fontWeight: 700, color: '#D97706' }}>⭐ {doc.rating}</td>
                  <td style={{ color: '#64748B' }}>{doc.reviews}</td>
                  <td style={{ fontWeight: 700 }}>${(doc.fee * doc.reviews * 0.6).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}