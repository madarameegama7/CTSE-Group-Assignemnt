import useAppointments from '../../hooks/useAppointments';
import useDoctors from '../../hooks/useDoctors';
import { Users, UserCheck, CalendarDays, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const PIE_DATA = [
  { name:'Confirmed', value:45, color:'#2563EB' },
  { name:'Completed', value:32, color:'#16A34A' },
  { name:'Pending',   value:15, color:'#F59E0B' },
  { name:'Cancelled', value:8,  color:'#EF4444' },
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

const badge = s => {
  const m = { CONFIRMED:'badge-blue', PENDING:'badge-amber', COMPLETED:'badge-green', CANCELLED:'badge-slate' };
  const l = { CONFIRMED:'Confirmed', PENDING:'Pending', COMPLETED:'Completed', CANCELLED:'Cancelled' };
  return <span className={`badge ${m[s]||'badge-slate'}`}>{l[s]||s}</span>;
};

export default function AdminDashboard() {
  const { appointments } = useAppointments();
  const { doctors } = useDoctors();
  
  const totalRevenue = appointments.reduce((s,a)=>s+(a.fee||0),0);

  const stats = [
    { label:'Total Patients', value:'2,847', change:'+15.2%', icon:Users,       color:'#2563EB', bg:'#EFF6FF' },
    { label:'Active Doctors', value:doctors.length,     change:'+2',     icon:UserCheck,  color:'#0D9488', bg:'#F0FDFA' },
    { label:'Appointments',   value:appointments.length, change:'+8.7%',  icon:CalendarDays,color:'#7C3AED', bg:'#F5F3FF' },
    { label:'Revenue (Mo.)',  value:`Rs. ${(totalRevenue*12).toLocaleString()}`, change:'+12.4%', icon:DollarSign, color:'#D97706', bg:'#FFFBEB' },
  ];

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom:24 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div className="stat-tile fade-up" key={s.label}>
              <div className="stat-tile-top">
                <div className="stat-tile-icon" style={{ background:s.bg, color:s.color }}><Icon size={18} /></div>
                <span className="stat-tile-change up"><TrendingUp size={11} /> {s.change}</span>
              </div>
              <div className="stat-tile-value">{s.value}</div>
              <div className="stat-tile-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ gap:20, marginBottom:20 }}>
        <div className="card fade-up">
          <div className="card-header"><span className="card-title">Monthly Appointments</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #E2E8F0', fontSize:'0.82rem' }} />
                <Bar dataKey="appointments" fill="#2563EB" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card fade-up">
          <div className="card-header"><span className="card-title">Appointment Status</span></div>
          <div className="card-body" style={{ display:'flex', alignItems:'center', gap:20 }}>
            <PieChart width={160} height={160}>
              <Pie data={PIE_DATA} cx={75} cy={75} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
              {PIE_DATA.map(p => (
                <div key={p.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:p.color }} />
                    <span style={{ fontSize:'0.8rem', color:'#475569' }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#0F172A' }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card fade-up" style={{ marginBottom:20 }}>
        <div className="card-header"><span className="card-title">Revenue Trend</span></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v=>`Rs. ${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #E2E8F0', fontSize:'0.82rem' }} formatter={v=>[`Rs. ${v.toLocaleString()}`,'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill:'#7C3AED', strokeWidth:2, r:4 }} activeDot={{ r:6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card fade-up">
        <div className="card-header"><span className="card-title">Recent Appointments</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Patient</th><th>Doctor</th><th>Date</th><th>Type</th><th>Status</th><th>Fee</th>
            </tr></thead>
            <tbody>
              {appointments.slice(0,6).map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight:600 }}>{a.patientName}</td>
                  <td style={{ color:'#64748B' }}>{a.doctorName}</td>
                  <td style={{ color:'#64748B' }}>{a.date}</td>
                  <td><span className="badge badge-slate">{a.type}</span></td>
                  <td>{badge(a.status)}</td>
                  <td style={{ fontWeight:700 }}>Rs. ${a.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}