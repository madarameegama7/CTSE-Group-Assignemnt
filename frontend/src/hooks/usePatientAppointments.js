import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/Authcontext';

export default function usePatientAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      if (!user || !user.userId) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get(`/appointments/patient/${user.userId}`);

        const mapped = (data || []).map(a => ({
          id: a.appointmentId || a.id, 
          patientId: a.patientId,
          patientName: 'Me', 
          doctorId: a.doctorId,
          doctorName: `Doctor #${a.doctorId}`, 
          specialty: 'Specialist', 
          date: a.date,
          time: a.time,
          status: a.status,
          type: 'Consultation',
          fee: 150, 
          notes: ''
        }));
        
        setAppointments(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [user]);

  const refresh = () => {
     setLoading(true);
  };

  return { appointments, loading, error, refresh };
}
