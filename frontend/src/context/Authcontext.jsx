import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const USERS = {
  'patient@demo.com':  { id:'p1', role:'PATIENT', name:'Sarah Mitchell',   email:'patient@demo.com',  avatar:'SM', phone:'+1 555-234-5678', dob:'1990-03-15', bloodType:'A+',       password:'demo123' },
  'doctor@demo.com':   { id:'d1', role:'DOCTOR',  name:'Dr. James Harlow', email:'doctor@demo.com',   avatar:'JH', specialty:'Cardiologist', department:'Cardiology', experience:'12 years', license:'MD-2024-0091', password:'demo123' },
  'admin@demo.com':    { id:'a1', role:'ADMIN',   name:'Alex Chen',        email:'admin@demo.com',    avatar:'AC', password:'demo123' },
};

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 900));
    const found = USERS[email.toLowerCase()];
    if (found && found.password === password) {
      const { password: _, ...safe } = found;
      setUser(safe); setLoading(false);
      return safe;
    }
    setError('Invalid email or password');
    setLoading(false);
    throw new Error('Invalid credentials');
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};