import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.get('/auth/users');
        // Map backend User model to frontend format
        const mapped = (data || []).map(u => ({
          id: u.userId.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone || '--',
          status: 'Active',
          lastActive: 'Today'
        }));
        setUsers(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return { users, loading, error };
}
