import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      const [data, usersData, doctorsData] = await Promise.all([
        api.get('/appointments'),
        api.get('/auth/users').catch(() => []),
        api.get('/doctors').catch(() => [])
      ]);
      const mapped = (data || []).map(a => {
        const user = usersData.find(u => u.userId == a.patientId || u.id == a.patientId);
        const doctor = doctorsData.find(d => d.doctorId == a.doctorId || d.id == a.doctorId);
        return {
          id: a.appointmentId || a.id,
          appointmentId: a.appointmentId || a.id,
          patientId: a.patientId,
          patientName: a.patientName || (user ? user.name : 'Unknown Patient'),
        doctorId: a.doctorId,
        doctorName: a.doctorName || (doctor ? doctor.name : `Doctor #${a.doctorId}`),
        specialty: a.specialty || (doctor ? doctor.specialization : 'Specialist'),
        date: a.date,
        time: a.time || a.appointmentTime,
        status: a.status,
        type: a.appointmentType || 'Consultation',
        fee: (doctor && doctor.fee) ? doctor.fee : (a.fee || 150),
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
