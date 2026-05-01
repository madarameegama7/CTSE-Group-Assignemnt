import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await api.get('/appointments');
        
        const mapped = (data || []).map(a => ({
          id: a.appointmentId || a.id,
          patientId: a.patientId,
          patientName: a.patientName || 'Unknown Patient',
          doctorId: a.doctorId,
          doctorName: a.doctorName || `Doctor #${a.doctorId}`,
          specialty: a.specialty || 'Specialist',
          date: a.date,
          time: a.time || a.appointmentTime,
          status: a.status,
          type: a.appointmentType || 'Consultation',
          fee: a.fee || 150,
          notes: a.notes || ''
        }));
        
        setAppointments(mapped);
      } catch (err) {
        setError(err.message);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  return { appointments, loading, error };
}
