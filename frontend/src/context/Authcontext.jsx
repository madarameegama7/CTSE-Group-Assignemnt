import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);



export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        // If the backend is completely down, Vite proxy might return an HTML error page or empty response
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

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

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