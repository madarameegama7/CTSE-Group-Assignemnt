import { FileText, Download, Eye, Plus, Activity, Pill, TestTube } from 'lucide-react';

const RECORDS = [
  { id:'r1', title:'ECG Report',           doctor:'Dr. James Harlow',  date:'2026-03-11', type:'Test Report',    size:'1.2 MB' },
  { id:'r2', title:'Blood Test Results',   doctor:'Dr. Priya Nair',    date:'2026-02-18', type:'Lab Report',     size:'0.8 MB' },
  { id:'r3', title:'Prescription — Q1',    doctor:'Dr. Elena Vasquez', date:'2026-01-05', type:'Prescription',   size:'0.3 MB' },
  { id:'r4', title:'MRI Brain Scan',       doctor:'Dr. Priya Nair',    date:'2025-12-20', type:'Imaging',        size:'24 MB'  },
  { id:'r5', title:'Annual Health Check',  doctor:'Dr. Marcus Webb',   date:'2025-11-10', type:'Check-up Report',size:'2.1 MB' },
];

const VITALS = [
  { label:'Blood Pressure', value:'118/76', unit:'mmHg', status:'Normal',  color:'#16A34A' },
  { label:'Heart Rate',     value:'72',     unit:'bpm',  status:'Normal',  color:'#16A34A' },
  { label:'Blood Sugar',    value:'98',     unit:'mg/dL',status:'Normal',  color:'#16A34A' },
  { label:'BMI',            value:'23.4',   unit:'',     status:'Healthy', color:'#16A34A' },
];

const typeIcon = t => {
  if (t.includes('Lab') || t.includes('Test')) return <TestTube size={16} />;
  if (t.includes('Prescription')) return <Pill size={16} />;
  return <FileText size={16} />;
};

const typeColor = t => {
  if (t.includes('Lab') || t.includes('Test')) return { bg:'#EFF6FF', color:'#1D4ED8' };
  if (t.includes('Prescription')) return { bg:'#F0FDF4', color:'#16A34A' };
  if (t.includes('Imaging')) return { bg:'#FDF4FF', color:'#7C3AED' };
  return { bg:'#FFFBEB', color:'#D97706' };
};

export default function MedicalRecords() {
  return (
    <div>
      {/* Vitals */}
      <div className="stats-grid" style={{ marginBottom:24 }}>
        {VITALS.map(v => (
          <div className="stat-tile fade-up" key={v.label}>
            <div className="stat-tile-top">
              <div className="stat-tile-icon" style={{ background:'#F0FDF4', color:v.color }}><Activity size={16} /></div>
              <span className="badge badge-green" style={{ fontSize:'0.68rem' }}>{v.status}</span>
            </div>
            <div className="stat-tile-value" style={{ fontSize:'1.4rem' }}>{v.value} <span style={{ fontSize:'0.75rem', color:'#94A3B8', fontWeight:400 }}>{v.unit}</span></div>
            <div className="stat-tile-label">{v.label}</div>
          </div>
        ))}
      </div>

      {/* Records */}
      <div className="card fade-up">
        <div className="card-header">
          <span className="card-title">Documents & Reports</span>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Upload</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Type</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECORDS.map(r => {
                const c = typeColor(r.type);
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:8, background:c.bg, color:c.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {typeIcon(r.type)}
                        </div>
                        <span style={{ fontWeight:600, fontSize:'0.84rem', color:'#0F172A' }}>{r.title}</span>
                      </div>
                    </td>
                    <td style={{ color:'#64748B' }}>{r.doctor}</td>
                    <td style={{ color:'#64748B' }}>{r.date}</td>
                    <td><span className="badge" style={{ background:c.bg, color:c.color }}>{r.type}</span></td>
                    <td style={{ color:'#94A3B8', fontSize:'0.78rem' }}>{r.size}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding:'4px 8px' }}><Eye size={14} /></button>
                        <button className="btn btn-outline btn-sm" style={{ padding:'4px 8px' }}><Download size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}