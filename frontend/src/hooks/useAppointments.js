import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
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
            patientId: a.patientId,
            patientName: (user ? user.name : (a.patientName || 'Unknown Patient')),
          doctorId: a.doctorId,
          doctorName: (doctor ? doctor.name : (a.doctorName || `Doctor #${a.doctorId}`)),
          specialty: (doctor ? doctor.specialization : (a.specialty || 'Specialist')),
          date: a.date,
          time: a.time || a.appointmentTime,
          status: a.status,
          type: a.appointmentType || 'Consultation',
          fee: (doctor && doctor.fee) ? doctor.fee : (a.fee || 150),
            notes: a.notes || ''
          };
        });
        
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
