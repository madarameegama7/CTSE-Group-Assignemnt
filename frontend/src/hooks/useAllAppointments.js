import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      const [data, usersData] = await Promise.all([
        api.get('/appointments'),
        api.get('/auth/users').catch(() => [])
      ]);
      const mapped = (data || []).map(a => {
        const user = usersData.find(u => u.userId == a.patientId || u.id == a.patientId);
        return {
          id: a.appointmentId || a.id,
          appointmentId: a.appointmentId || a.id,
          patientId: a.patientId,
          patientName: a.patientName || (user ? user.name : 'Unknown Patient'),
        doctorId: a.doctorId,
        doctorName: a.doctorName || `Doctor #${a.doctorId}`,
        specialty: a.specialty || 'Specialist',
        date: a.date,
        time: a.time || a.appointmentTime,
        status: a.status,
        type: a.appointmentType || 'Consultation',
        fee: a.fee || 150,
          notes: a.notes || ''
        };
      });
      setAppointments(mapped);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchAppointments();
  };

  return { appointments, loading, error, refetch };
}
