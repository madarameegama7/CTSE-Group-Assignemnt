import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/Authcontext';

export default function usePayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPayments() {
      if (!user?.userId) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get(`/payments/patient/${user.userId}`);
        const mapped = (data || []).map(p => ({
          id: p.paymentId,
          paymentId: p.paymentId,
          appointmentId: p.appointmentId,
          patientId: p.patientId,
          amount: p.amount,
          status: p.status,
          transactionId: p.transactionId || '',
          paymentDate: p.paymentDate,
          paymentType: p.paymentType || 'Online'
        }));
        setPayments(mapped);
      } catch (err) {
        setError(err.message);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [user?.userId]);

  return { payments, loading, error };
}
