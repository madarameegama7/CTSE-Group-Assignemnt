import { Outlet } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/Authcontext';
import {
  LayoutDashboard, CalendarDays, Search,
  FileText, Settings, User, CreditCard
} from 'lucide-react';

const NAV = [
  { to:'/patient/dashboard',    icon:LayoutDashboard, label:'Dashboard'       },
  { to:'/patient/appointments', icon:CalendarDays,    label:'My Appointments' },
  { to:'/patient/find-doctors', icon:Search,          label:'Find Doctors'    },
  { to:'/patient/records',      icon:FileText,        label:'Medical Records' },
  { type:'section', label:'Account' },
  { to:'/patient/profile',      icon:User,            label:'Profile'         },
  { to:'/patient/settings',     icon:Settings,        label:'Settings'        },
];

const PAGE_TITLES = {
  '/patient/dashboard':    { title:'Dashboard',         sub:'Welcome back, Sarah' },
  '/patient/appointments': { title:'My Appointments',   sub:'View and manage your bookings' },
  '/patient/find-doctors': { title:'Find Doctors',      sub:'Search and book specialists' },
  '/patient/records':      { title:'Medical Records',   sub:'Your health history' },
  '/patient/profile':      { title:'Profile',           sub:'Manage your personal info' },
};

export default function PatientLayout() {
  const [open, setOpen] = useState(false);
  const pathname = window.location.pathname;
  const meta = PAGE_TITLES[pathname] || { title:'MediBook', sub:'' };

  return (
    <div className="shell">
      {open && <div style={overlayStyle} onClick={() => setOpen(false)} />}
      <div className={open ? 'sidebar open' : 'sidebar'}>
        <Sidebar navItems={NAV} role="PATIENT" />
      </div>

      <div className="main-area">
        <header className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="icon-btn" style={{ border:'none', background:'transparent', display:'flex' }} onClick={() => setOpen(o => !o)}>
              <Menu size={18} color="#475569" />
            </button>
            <div>
              <div className="topbar-title">{meta.title}</div>
              {meta.sub && <div className="topbar-sub">{meta.sub}</div>}
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={16} />
              <span className="notif-dot" />
            </button>
          </div>
        </header>

        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:99, cursor:'pointer' };