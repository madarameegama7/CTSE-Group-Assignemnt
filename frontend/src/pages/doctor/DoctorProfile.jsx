import React from 'react';
import { useAuth } from '../../context/Authcontext';
import { User, Mail, Phone, MapPin, Star, Award, ShieldCheck } from 'lucide-react';

export default function DoctorProfile() {
  const { user } = useAuth();

  return (
    <div className="fade-up" style={{ maxWidth: 800, margin: '0 auto', padding: '20px 0' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ height: 140, background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' }}></div>
        <div style={{ padding: '0 30px 30px', position: 'relative' }}>
          <div style={{ 
            width: 100, height: 100, borderRadius: '50%', background: '#fff', 
            padding: 4, position: 'absolute', top: -50, left: 30, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              width: '100%', height: '100%', borderRadius: '50%', background: '#F0FDFA',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F766E',
              fontSize: '2.5rem', fontWeight: 700
            }}>
              {user?.name?.charAt(0) || 'D'}
            </div>
          </div>
          
          <div style={{ marginLeft: 120, paddingTop: 16, marginBottom: 40 }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#0F172A', fontWeight: 700 }}>{user?.name || 'Dr. Name'}</h2>
            <p style={{ margin: '6px 0 0', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="#0D9488" /> Certified Medical Professional
            </p>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#1E293B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} color="#0D9488" /> Professional Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <Mail size={14}/> Contact Email
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.email || 'Not provided'}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <Phone size={14}/> Contact Phone
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.phone || '+94 77 987 6543'}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <Star size={14}/> Specialty
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.specialty || 'General Practitioner'}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
                <MapPin size={14}/> Medical Center
              </label>
              <div className="form-input" style={{ background: '#F8FAFC', color: '#0F172A', fontWeight: 500, display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                {user?.hospital || 'MediBook Central Hospital'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 8, background: '#0D9488' }}>Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}
