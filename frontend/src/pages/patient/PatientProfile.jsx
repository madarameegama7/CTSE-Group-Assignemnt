import React from 'react';
import { useAuth } from '../../context/Authcontext';
import { User, Mail, Phone, MapPin, Calendar, Shield, Activity } from 'lucide-react';

export default function PatientProfile() {
  const { user } = useAuth();

  return (
    <div className="fade-up" style={{ maxWidth: 800, margin: '0 auto', padding: '20px 0' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ height: 140, background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)' }}></div>
        <div style={{ padding: '0 30px 30px', position: 'relative' }}>
          <div style={{ 
            width: 100, height: 100, borderRadius: '50%', background: '#fff', 
            padding: 4, position: 'absolute', top: -50, left: 30, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              width: '100%', height: '100%', borderRadius: '50%', background: '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8',
              fontSize: '2.5rem', fontWeight: 700
            }}>
              {user?.name?.charAt(0) || 'P'}
            </div>
          </div>
          
          <div style={{ marginLeft: 120, paddingTop: 16, marginBottom: 40 }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#0F172A', fontWeight: 700 }}>{user?.name || 'Patient Name'}</h2>
            <p style={{ margin: '6px 0 0', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={16} color="#10B981" /> Verified Patient
            </p>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#1E293B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="#2563EB" /> Personal Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <Mail size={14}/> Email Address
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.email || 'Not provided'}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <Phone size={14}/> Phone Number
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.phone || '+94 77 123 4567'}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <Calendar size={14}/> Date of Birth
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.dob || 'January 1, 1990'}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <MapPin size={14}/> Address
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.address || 'Colombo, Sri Lanka'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, borderTop: '1px solid #F1F5F9', paddingTop: 30 }}>
             <h3 style={{ fontSize: '1.1rem', color: '#1E293B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} color="#2563EB" /> Medical Profile
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your medical profile is currently synced with your active records. Any updates to your personal health history or ongoing treatments will reflect directly in your Medical Records tab.
              </p>
          </div>

          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 8 }}>Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}
