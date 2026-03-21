import React, { useState } from 'react';
import { APPOINTMENTS } from '../../utils/mockData';
import { CalendarDays, Clock, DollarSign, CreditCard, Banknote, CheckCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MakePayments() {
  const { user } = useAuth();
  // using Mock data for patient 'p1' if user doesn't have an ID yet, though useAuth provides user
  const patientAppointments = APPOINTMENTS.filter(a => a.patientId === (user?.id || 'p1') && (a.status === 'CONFIRMED' || a.status === 'PENDING'));
  
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [method, setMethod] = useState('CARD');
  const [paidAppts, setPaidAppts] = useState([]); // track local mock payments
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const availableAppts = patientAppointments.filter(a => !paidAppts.includes(a.id));

  const handlePayment = (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    
    setIsProcessing(true);
    // Mock processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaidAppts([...paidAppts, selectedAppt.id]);
      setShowPopup(true);
    }, 800);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAppt(null);
  };

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Left Column: Appointments List */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#0F172A', fontWeight: 600 }}>Select an Appointment</h2>
        {availableAppts.length === 0 ? (
          <div className="card fade-up" style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
            <div style={{ display: 'inline-flex', background: '#F0FDFA', color: '#16A34A', padding: 16, borderRadius: '50%', marginBottom: 16 }}>
              <CheckCircle size={32} />
            </div>
            <p style={{ margin: 0, fontWeight: 500, color: '#475569' }}>You have no pending payments!</p>
          </div>
        ) : (
          availableAppts.map(a => (
            <div 
              key={a.id} 
              className="card fade-up"
              onClick={() => setSelectedAppt(a)}
              style={{ 
                padding: '16px', 
                cursor: 'pointer', 
                border: selectedAppt?.id === a.id ? '2px solid #2563EB' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.2s ease',
                boxShadow: selectedAppt?.id === a.id ? '0 4px 6px -1px rgba(37, 99, 235, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '1.05rem' }}>{a.doctorName}</span>
                  <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '1.1rem' }}>${a.fee}</span>
                </div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: 12 }}>{a.specialty} • {a.type}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: '#94A3B8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalendarDays size={14} color="#64748B" />{a.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} color="#64748B" />{a.time}</span>
                </div>
              </div>
              <ChevronRight size={20} color={selectedAppt?.id === a.id ? "#2563EB" : "#CBD5E1"} style={{ transition: 'color 0.2s ease' }} />
            </div>
          ))
        )}
      </div>

      {/* Right Column: Payment Details Form */}
      <div className="card fade-up" style={{ flex: '1 1 350px', position: 'sticky', top: 24, padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 20px', color: '#0F172A', fontWeight: 600 }}>Payment Details</h2>
        
        {selectedAppt ? (
          <form onSubmit={handlePayment} style={{ animation: 'fadeIn 0.3s ease' }}>
             <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 24, border: '1px solid #E2E8F0' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                 <div style={{ color: '#64748B', fontSize: '0.85rem' }}>Paying for</div>
                 <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.85rem' }}>#{selectedAppt.id.toUpperCase()}</div>
               </div>
               <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '1rem', marginBottom: 4 }}>Appointment with {selectedAppt.doctorName}</div>
               <div style={{ color: '#64748B', fontSize: '0.85rem' }}>{selectedAppt.date} at {selectedAppt.time}</div>
             </div>

             <div className="form-group" style={{ marginBottom: 20 }}>
               <label className="form-label" style={{ fontWeight: 500, color: '#475569', marginBottom: 8 }}>Payment Amount</label>
               <div className="search-wrap" style={{ background: '#F1F5F9', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                 <DollarSign size={18} color="#64748B" />
                 <input 
                   type="text" 
                   className="form-input" 
                   value={selectedAppt.fee}
                   disabled
                   style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', outline: 'none', width: '100%' }}
                 />
               </div>
             </div>

             <div className="form-group" style={{ marginBottom: 32 }}>
               <label className="form-label" style={{ fontWeight: 500, color: '#475569', marginBottom: 8 }}>Payment Method</label>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                 <div 
                   onClick={() => setMethod('CARD')}
                   style={{ 
                     border: method === 'CARD' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                     background: method === 'CARD' ? '#EFF6FF' : '#fff',
                     padding: '16px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                     fontWeight: 600, color: method === 'CARD' ? '#1D4ED8' : '#64748B',
                     display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                     transition: 'all 0.2s ease'
                   }}
                 >
                   <CreditCard size={24} color={method === 'CARD' ? '#2563EB' : '#94A3B8'} />
                   Credit/Debit Card
                 </div>
                 <div 
                   onClick={() => setMethod('CASH')}
                   style={{ 
                     border: method === 'CASH' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                     background: method === 'CASH' ? '#EFF6FF' : '#fff',
                     padding: '16px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                     fontWeight: 600, color: method === 'CASH' ? '#1D4ED8' : '#64748B',
                     display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                     transition: 'all 0.2s ease'
                   }}
                 >
                   <Banknote size={24} color={method === 'CASH' ? '#2563EB' : '#94A3B8'} />
                   Cash / Pay at Clinic
                 </div>
               </div>
             </div>

             <button type="submit" className="btn btn-primary" disabled={isProcessing} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 600 }}>
               {isProcessing ? 'Processing Payment...' : `Confirm Payment of $${selectedAppt.fee}`}
             </button>
             
             <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: '#94A3B8' }}>
                Secure payment processing.
             </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', color: '#94A3B8', padding: '40px 20px', background: '#F8FAFC', borderRadius: 8, border: '1px dashed #E2E8F0' }}>
            <DollarSign size={48} color="#CBD5E1" style={{ marginBottom: 16, margin: '0 auto' }} />
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Select an appointment from the list<br/>to view payment details.</p>
          </div>
        )}
      </div>

      {/* User Friendly Success Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2, 6, 23, 0.5)', zIndex: 1000, backdropFilter: 'blur(2px)', animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '32px 24px', maxWidth: 400, width: '90%',
            textAlign: 'center', margin: 20, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ background: '#ECFDF5', color: '#10B981', padding: 16, borderRadius: '50%' }}>
                <CheckCircle size={48} strokeWidth={2.5} />
              </div>
            </div>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem', color: '#0F172A', fontWeight: 700 }}>Payment Successful!</h3>
            <p style={{ margin: '0 0 24px', color: '#64748B', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Your payment of <strong style={{ color: '#0F172A' }}>${selectedAppt?.fee}</strong> via {method} has been processed successfully. Your appointment is confirmed.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={closePopup}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
