import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { LayoutDashboard, CalendarDays, Users, Clock, Settings, User } from 'lucide-react';

const NAV = [
  { to:'/doctor/dashboard',    icon:LayoutDashboard, label:'Dashboard'      },
  { to:'/doctor/appointments', icon:CalendarDays,    label:'Appointments'   },
  { to:'/doctor/patients',     icon:Users,           label:'My Patients'    },
  { to:'/doctor/schedule',     icon:Clock,           label:'My Schedule'    },
  { type:'section', label:'Account' },
  { to:'/doctor/profile',      icon:User,            label:'Profile'        },
];

const PAGE_TITLES = {
  '/doctor/dashboard':    { title:'Dashboard' },
  '/doctor/appointments': { title:'Appointments' },
  '/doctor/patients':     { title:'My Patients' },
  '/doctor/schedule':     { title:'My Schedule' },
  '/doctor/profile':      { title:'Profile' },
};

export default function DoctorLayout() {
  const [open, setOpen] = useState(false);
  const pathname = window.location.pathname;
  const meta = PAGE_TITLES[pathname] || { title:'MediBook' };

  return (
    <div className="shell">
      {open && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:99 }} onClick={() => setOpen(false)} />}
      <div className={open ? 'sidebar open' : 'sidebar'}>
        <Sidebar navItems={NAV} role="DOCTOR" />
      </div>
      <div className="main-area">
        <header className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ background:'transparent', border:'none', display:'flex', cursor:'pointer' }} onClick={() => setOpen(o => !o)}>
              <Menu size={18} color="#475569" />
            </button>
            <div>
              <div className="topbar-title">{meta.title}</div>
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn"><Bell size={16} /><span className="notif-dot" /></button>
          </div>
        </header>
        <div className="page-body"><Outlet /></div>
      </div>
    </div>
  );
}