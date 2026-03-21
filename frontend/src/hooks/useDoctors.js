import { useState, useEffect } from 'react';

export default function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch('/api/doctors');
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const data = await res.json();
        
        // Map backend DoctorResponse to frontend DOCTORS format
        const mapped = data.map(d => ({
          id: d.doctorId.toString(),
          name: d.name,
          specialty: d.specialization,
          department: d.hospital || 'General',
          experience: '10 yrs', // Fallback for UI
          rating: 4.8, // Fallback for UI
          reviews: 120, // Fallback for UI
          fee: 150, // Fallback for UI
          avatar: d.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
          available: true,
          nextSlot: 'Tomorrow 10:00 AM' // Fallback for UI
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
