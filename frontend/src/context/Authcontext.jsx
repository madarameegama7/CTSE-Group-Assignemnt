import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('http://16.16.115.241:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Unable to connect to the backend server. Please ensure the api-gateway and auth-service are running.');
      }

      if (!res.ok) {
        const errorMsg = data?.message || data?.error || `Server responded with status ${res.status}`;
        throw new Error(errorMsg);
      }

      const { token, role, userId } = data;

      localStorage.setItem('token', token);

      const loggedInUser = { email, role, userId };
      setUser(loggedInUser);
      setLoading(false);
      return loggedInUser;

    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('http://16.16.115.241:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      try { data = await res.json(); } catch(e) {}

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `Server error: ${res.status}`);
      }

      setLoading(false);
      return data;

    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};