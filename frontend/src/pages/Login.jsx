import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import { Activity, Eye, EyeOff } from 'lucide-react';

const REDIRECT = { PATIENT:'/patient/dashboard', DOCTOR:'/doctor/dashboard', ADMIN:'/admin/dashboard' };

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      navigate(REDIRECT[user.role] || '/');
    } catch {}
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
            <div style={styles.heroTag}>Trusted by 2,800+ patients</div>
            <h1 style={styles.heroTitle}>Your health,<br />beautifully organised.</h1>
            <p style={styles.heroSub}>
              Book appointments with top specialists, manage your health records, and receive real‑time updates — all in one secure platform.
            </p>
          </div>

          <div style={styles.pills}>
            {['HIPAA Compliant','256-bit Encryption','24/7 Support','AWS Secured'].map(t => (
              <span key={t} style={styles.pill}>{t}</span>
            ))}
          </div>

          <div style={styles.leftPattern} aria-hidden />
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign in to MediBook</h2>
            <p style={styles.formSub}>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.pwWrap}>
                <input
                  style={{ ...styles.input, paddingRight:'44px' }}
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
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

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, background: '#2563EB' }}
            >
              {loading
                ? <span style={styles.btnSpinner} />
                : 'Sign in'
              }
            </button>


            <p style={styles.demoHint}>
              Don't have an account? <Link to="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
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

  heroBlock: { marginTop:'auto' },
  heroTag:   { display:'inline-block', background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.9)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', padding:'4px 12px', borderRadius:20, marginBottom:20 },
  heroTitle: { fontFamily:"'Lexend',sans-serif", fontSize:'2.6rem', fontWeight:700, color:'white', lineHeight:1.15, letterSpacing:'-0.03em', marginBottom:16 },
  heroSub:   { color:'rgba(255,255,255,0.72)', fontSize:'0.92rem', lineHeight:1.65, maxWidth:360 },

  pills: { marginTop:36, display:'flex', flexWrap:'wrap', gap:8, marginBottom:8 },
  pill:  { background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.85)', fontSize:'0.72rem', fontWeight:500, padding:'5px 12px', borderRadius:20, backdropFilter:'blur(4px)' },

  leftPattern: {
    position:'absolute', bottom:-120, right:-120, width:400, height:400,
    borderRadius:'50%', border:'1px solid rgba(255,255,255,0.1)',
    boxShadow:'inset 0 0 0 60px rgba(255,255,255,0.04)',
    pointerEvents:'none',
  },

  right: { flex:1, background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' },

  formCard: { width:'100%', maxWidth:460, background:'white', borderRadius:20, boxShadow:'0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)', padding:'32px' },

  formHeader: { marginBottom:24 },
  formTitle:  { fontFamily:"'Lexend',sans-serif", fontSize:'1.4rem', fontWeight:700, color:'#0F172A', letterSpacing:'-0.02em', marginBottom:4 },
  formSub:    { fontSize:'0.85rem', color:'#64748B' },

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
    padding:'11px 20px', border:'none', borderRadius:10,
    color:'white', fontSize:'0.9rem', fontWeight:700, fontFamily:"'Lexend',sans-serif",
    cursor:'pointer', transition:'all 0.18s ease',
    display:'flex', alignItems:'center', justifyContent:'center',
    letterSpacing:'-0.01em',
  },

  btnSpinner: { width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' },

  demoHint: { textAlign:'center', fontSize:'0.76rem', color:'#94A3B8' },
};