import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.get('/auth/users');
        const mapped = (data || []).map(u => ({
          id: u.userId ? u.userId.toString() : 'U'+Math.random(),
          name: u.name,
          email: u.email,
          role: u.role,
          status: 'ACTIVE', // Fallback for UI
          joined: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '2026-03-24'
        }));
        setUsers(mapped);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return { users, loading, error };
}
