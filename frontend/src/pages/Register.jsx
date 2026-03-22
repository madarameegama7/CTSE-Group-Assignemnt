import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import { Activity, Shield, Heart, Stethoscope, Eye, EyeOff } from 'lucide-react';

const ACCOUNT_TYPES = [
  { role:'PATIENT', icon:Heart,       color:'#2563EB', label:'Patient',  desc:'Book & manage appointments' },
  { role:'DOCTOR',  icon:Stethoscope, color:'#0D9488', label:'Doctor',   desc:'Manage schedule & patients'  },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: 'PATIENT'
  });
  const [showPw, setShowPw] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}><Activity size={18} color="white" /></div>
            <span style={styles.brandText}>MediBook</span>
          </div>

          <div style={styles.heroBlock}>
            <div style={styles.heroTag}>Join 2,800+ patients</div>
            <h1 style={styles.heroTitle}>Your health journey starts here.</h1>
            <p style={styles.heroSub}>
              Create a free account to book appointments with top specialists and manage your health records in one secure platform.
            </p>
          </div>
          <div style={styles.leftPattern} aria-hidden />
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create an account</h2>
            <p style={styles.formSub}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Role</label>
              <div style={styles.tileRow}>
                {ACCOUNT_TYPES.map(acc => {
                  const Icon = acc.icon;
                  const active = formData.role === acc.role;
                  return (
                    <button
                      type="button"
                      key={acc.role}
                      onClick={() => setFormData({ ...formData, role: acc.role })}
                      style={{
                        ...styles.tile,
                        borderColor: active ? acc.color : '#E2E8F0',
                        background:  active ? `${acc.color}0D` : '#fff',
                        boxShadow:   active ? `0 0 0 2px ${acc.color}33` : 'none',
                      }}
                    >
                      <div style={{ ...styles.tileIcon, background: active ? `${acc.color}20` : '#F1F5F9', color: active ? acc.color : '#94A3B8' }}>
                        <Icon size={17} />
                      </div>
                      <span style={{ ...styles.tileLabel, color: active ? acc.color : '#334155' }}>{acc.label}</span>
                      <span style={styles.tileDesc}>{acc.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Phone Number</label>
                <input style={styles.input} name="phone" value={formData.phone} onChange={handleChange} placeholder="0771234567" required />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Address</label>
              <input style={styles.input} name="address" value={formData.address} onChange={handleChange} placeholder="City, Country" required />
            </div>



            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.pwWrap}>
                <input
                  style={{ ...styles.input, paddingRight:'44px' }}
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Must be at least 8 characters"
                  required
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPw(p => !p)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? <span style={styles.btnSpinner} /> : 'Sign Up'}
            </button>
            
            <p style={styles.demoHint}>
              Already have an account? <Link to="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Log in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: { display:'flex', minHeight:'100vh', fontFamily:"'Inter', sans-serif" },

  left: {
    width:'44%', background:'linear-gradient(150deg,#1E3A8A 0%,#1D4ED8 55%,#2563EB 100%)',
    position:'relative', overflow:'hidden', display:'flex', alignItems:'stretch',
  },
  leftInner: { position:'relative', zIndex:2, padding:'52px 48px', display:'flex', flexDirection:'column', width:'100%' },

  brand: { display:'flex', alignItems:'center', gap:10 },
  brandIcon: { width:34, height:34, background:'rgba(255,255,255,0.18)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' },
  brandText: { color:'white', fontFamily:"'Lexend',sans-serif", fontWeight:700, fontSize:'1.15rem', letterSpacing:'-0.02em' },

  heroBlock: { marginTop:'auto', marginBottom: 60 },
  heroTag:   { display:'inline-block', background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.9)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', padding:'4px 12px', borderRadius:20, marginBottom:20 },
  heroTitle: { fontFamily:"'Lexend',sans-serif", fontSize:'2.6rem', fontWeight:700, color:'white', lineHeight:1.15, letterSpacing:'-0.03em', marginBottom:16 },
  heroSub:   { color:'rgba(255,255,255,0.72)', fontSize:'0.92rem', lineHeight:1.65, maxWidth:360 },

  leftPattern: {
    position:'absolute', bottom:-120, right:-120, width:400, height:400,
    borderRadius:'50%', border:'1px solid rgba(255,255,255,0.1)',
    boxShadow:'inset 0 0 0 60px rgba(255,255,255,0.04)',
    pointerEvents:'none',
  },

  right: { flex:1, background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' },

  formCard: { width:'100%', maxWidth:500, background:'white', borderRadius:20, boxShadow:'0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)', padding:'32px' },

  formHeader: { marginBottom:24 },
  formTitle:  { fontFamily:"'Lexend',sans-serif", fontSize:'1.4rem', fontWeight:700, color:'#0F172A', letterSpacing:'-0.02em', marginBottom:4 },
  formSub:    { fontSize:'0.85rem', color:'#64748B' },

  tileRow: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 },
  tile: {
    display:'flex', flexDirection:'column', alignItems:'center', gap:6,
    padding:'14px 8px', borderRadius:12, border:'1.5px solid #E2E8F0',
    cursor:'pointer', transition:'all 0.18s ease', background:'white', textAlign:'center',
  },
  tileIcon:  { width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s ease' },
  tileLabel: { fontSize:'0.8rem', fontWeight:700, transition:'color 0.18s ease' },
  tileDesc:  { fontSize:'0.68rem', color:'#94A3B8', lineHeight:1.3 },

  form: { display:'flex', flexDirection:'column', gap:14 },

  fieldGroup: { display:'flex', flexDirection:'column', gap:5 },
  label: { fontSize:'0.78rem', fontWeight:600, color:'#334155' },
  input: {
    padding:'10px 12px', border:'1px solid #CBD5E1', borderRadius:8,
    fontSize:'0.875rem', color:'#1E293B', outline:'none', width:'100%',
    transition:'border-color 0.18s, box-shadow 0.18s', fontFamily:'inherit',
    boxSizing:'border-box',
  },

  pwWrap: { position:'relative' },
  eyeBtn: { position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex', alignItems:'center' },

  errorBox: { background:'#FEF2F2', border:'1px solid #FECACA', color:'#B91C1C', borderRadius:8, padding:'9px 13px', fontSize:'0.82rem' },

  submitBtn: {
    padding:'11px 20px', border:'none', borderRadius:10, background: '#2563EB',
    color:'white', fontSize:'0.9rem', fontWeight:700, fontFamily:"'Lexend',sans-serif",
    cursor:'pointer', transition:'all 0.18s ease',
    display:'flex', alignItems:'center', justifyContent:'center',
    letterSpacing:'-0.01em', marginTop: 10
  },

  btnSpinner: { width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' },

  demoHint: { textAlign:'center', fontSize:'0.86rem', color:'#64748B', marginTop: 10 },
};
