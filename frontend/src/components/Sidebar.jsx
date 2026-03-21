import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut } from 'lucide-react';

export default function Sidebar({ navItems, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleColors = {
    PATIENT: { bg: '#2563EB', light: '#EFF6FF' },
    DOCTOR:  { bg: '#0D9488', light: '#F0FDFA' },
    ADMIN:   { bg: '#7C3AED', light: '#F5F3FF' },
  };
  const c = roleColors[role] || roleColors.PATIENT;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon" style={{ background: c.bg }}>
          <Activity size={16} />
        </div>
        MediBook
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar" style={{ background: c.bg }}>
          {user?.avatar}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role">
            {role.charAt(0) + role.slice(1).toLowerCase()}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          if (item.type === 'section') {
            return (
              <div key={item.label} className="nav-section-label">
                {item.label}
              </div>
            );
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) =>
                isActive ? { color: c.bg, background: c.light } : {}
              }
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={handleLogout}>
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
