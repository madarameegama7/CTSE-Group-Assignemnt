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
        const [data, doctorsData] = await Promise.all([
          api.get(`/appointments/patient/${user.userId}`),
          api.get('/doctors').catch(() => [])
        ]);

        const mapped = (data || []).map(a => {
          const doctor = doctorsData.find(d => d.doctorId == a.doctorId || d.id == a.doctorId);
          return {
            id: a.appointmentId || a.id, 
            patientId: a.patientId,
            patientName: 'Me', 
            doctorId: a.doctorId,
            doctorName: (doctor ? doctor.name : (a.doctorName || `Doctor #${a.doctorId}`)), 
            specialty: (doctor ? doctor.specialization : (a.specialty || 'Specialist')), 
            date: a.date,
            time: a.time,
            status: a.status,
            type: a.appointmentType || 'Consultation',
            fee: (doctor && doctor.fee) ? doctor.fee : (a.fee || 150), 
            notes: a.notes || ''
          };
        });
        
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
