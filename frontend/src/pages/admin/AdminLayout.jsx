import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarDays,
  BarChart2,
  Settings,
  Shield,
  DollarSign,
} from "lucide-react";

const NAV = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/doctors", icon: UserCheck, label: "Doctors" },
  { to: "/admin/appointments", icon: CalendarDays, label: "Appointments" },
  { to: "/admin/verify-payments", icon: DollarSign, label: "Payments" },
];

const PAGE_TITLES = {
  "/admin/dashboard": { title: "Admin Dashboard", sub: "System overview" },
  "/admin/users": { title: "User Management", sub: "Manage all users" },
  "/admin/doctors": {
    title: "Doctor Management",
    sub: "Manage doctors & departments",
  },
  "/admin/appointments": {
    title: "All Appointments",
    sub: "Platform-wide appointment log",
  },
  "/admin/reports": { title: "Reports", sub: "Analytics & insights" },
  "/admin/verify-payments": {
    title: "Verify Payments",
    sub: "Review incoming payments",
  },
};

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const pathname = window.location.pathname;
  const meta = PAGE_TITLES[pathname] || { title: "Admin", sub: "" };

  return (
    <div className="shell">
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
          onClick={() => setOpen(false)}
        />
      )}
      <div className={open ? "sidebar open" : "sidebar"}>
        <Sidebar navItems={NAV} role="ADMIN" />
      </div>
      <div className="main-area">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                display: "flex",
                cursor: "pointer",
              }}
              onClick={() => setOpen((o) => !o)}
            >
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
