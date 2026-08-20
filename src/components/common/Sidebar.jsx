import React from 'react';
import { JpmLogo } from './JpmLogo';
import { LayoutDashboard, BookOpen, Layers, ShieldCheck, Bell, HelpCircle, LogOut, Users, Crown, PieChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, onSelectTab, role = 'EMPLOYEE' }) => {
  const { logout } = useAuth();

  const isEmployee = role === 'EMPLOYEE';
  const isHR = role === 'HR';
  const isMD = role === 'MD';

  const employeeNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-works', label: 'My Works', icon: BookOpen },
    { id: 'abcd-progress', label: 'ABCD Progress', icon: Layers },
  ];

  const hrNav = [
    { id: 'work-master', label: 'Work Master', icon: BookOpen },
    { id: 'abcd-verification', label: 'ABCD Verification', icon: ShieldCheck },
    { id: 'employee-progress', label: 'Employee Progress', icon: Users },
  ];

  const mdNav = [
    { id: 'dashboard', label: 'Executive Overview', icon: Crown },
    { id: 'compliance', label: 'Compliance Oversight', icon: ShieldCheck },
    { id: 'abcd-oversight', label: 'ABCD Analytics', icon: Layers },
    { id: 'reports', label: 'Executive Reports', icon: PieChart },
  ];

  const navItems = isEmployee ? employeeNav : isHR ? hrNav : mdNav;

  return (
    <aside className="jpm-sidebar">
      <div className="sidebar-brand">
        <JpmLogo size={36} />
        <div className="sidebar-brand-text">
          JPM <span>LMS</span>
        </div>
      </div>

      <div className="sidebar-section-label">GENERAL</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`sidebar-nav-btn ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-section-label" style={{ marginTop: 'auto' }}>OTHER</div>
      <div className="sidebar-footer-nav">
        <button className="sidebar-nav-btn" onClick={() => alert('Notifications: All clear.')}>
          <Bell size={18} className="nav-icon" />
          <span>Notifications</span>
        </button>
        <button className="sidebar-nav-btn" onClick={() => alert('JPM LMS Help Center & Support')}>
          <HelpCircle size={18} className="nav-icon" />
          <span>Help Center</span>
        </button>
        <button className="sidebar-nav-btn logout-nav-btn" onClick={logout}>
          <LogOut size={18} className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
