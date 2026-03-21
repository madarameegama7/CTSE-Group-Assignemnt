import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useDoctorSlots(doctorId) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const data = await api.get(`/doctors/${doctorId}/slots`);
      setSlots(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [doctorId]);

  const createSlot = async (date, startTime, endTime) => {
    try {
      const newSlot = await api.post(`/doctors/${doctorId}/slots`, {
        date,
        startTime,
        endTime,
        available: true
      });
      setSlots(prev => [...prev, newSlot]);
      return newSlot;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      await api.delete(`/doctors/${doctorId}/slots/${slotId}`);
      setSlots(prev => prev.filter(s => s.slotId !== slotId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refetch = () => {
    fetchSlots();
  };

  return { slots, loading, error, createSlot, deleteSlot, refetch };
}
