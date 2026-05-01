import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await api.get('/doctors');

        const mapped = data.map(d => ({
          id: d.doctorId.toString(),
          name: d.name,
          specialty: d.specialization,
          department: d.hospital || 'General',
          experience: '10 yrs', 
          rating: 4.8, 
          reviews: 120, 
          fee: 150, 
          avatar: d.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
          available: true,
          nextSlot: 'View Calendar' 
        }));
        
        setDoctors(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDoctors();
  }, []);

  return { doctors, loading, error };
}
