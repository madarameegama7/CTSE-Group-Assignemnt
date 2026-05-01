import { useState, useEffect } from 'react';
import { api } from '../services/api';

const DUMMY_APPOINTMENTS = [
  { id: 'A001', appointmentId: 'A001', patientId: 'p1', patientName: 'Jane Doe', doctorId: 'd1', doctorName: 'Dr. John Smith', specialty: 'Cardiology', date: '2026-05-10', time: '10:00 AM', status: 'CONFIRMED', type: 'Consultation', fee: 150, notes: 'Regular checkup' },
  { id: 'A002', appointmentId: 'A002', patientId: 'p2', patientName: 'Robert Johnson', doctorId: 'd2', doctorName: 'Dr. Emily Chen', specialty: 'Dermatology', date: '2026-05-11', time: '02:30 PM', status: 'PENDING', type: 'Follow-up', fee: 120, notes: 'Skin rash review' },
  { id: 'A003', appointmentId: 'A003', patientId: 'p3', patientName: 'Michael Brown', doctorId: 'd3', doctorName: 'Dr. Sarah Williams', specialty: 'Neurology', date: '2026-05-09', time: '11:15 AM', status: 'COMPLETED', type: 'Consultation', fee: 200, notes: 'Headache diagnosis' },
  { id: 'A004', appointmentId: 'A004', patientId: 'p4', patientName: 'Lisa Anderson', doctorId: 'd1', doctorName: 'Dr. John Smith', specialty: 'Cardiology', date: '2026-05-12', time: '09:00 AM', status: 'CANCELLED', type: 'Consultation', fee: 150, notes: 'Patient requested cancellation' }
];

export default function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const [data, usersData, doctorsData] = await Promise.all([
          api.get('/appointments').catch(() => []),
          api.get('/auth/users').catch(() => []),
          api.get('/doctors').catch(() => [])
        ]);

        const activeData = (data && data.length > 0) ? data : DUMMY_APPOINTMENTS;
        const mapped = activeData.map(a => {
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
