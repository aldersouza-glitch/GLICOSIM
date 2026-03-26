import { NavLink } from 'react-router-dom';
import { Activity, Clock3, Plus, Utensils, Droplet, LogOut } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Droplet size={20} fill="currentColor" />
        </div>
        <span className="logo-text">GlicoTrack</span>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Activity size={20} />
          <span>Painel</span>
        </NavLink>
        
        <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Clock3 size={20} />
          <span>Histórico</span>
        </NavLink>
        
        <NavLink to="/glucose/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Plus size={20} />
          <span>Nova Glicose</span>
        </NavLink>
        
        <NavLink to="/meal/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Utensils size={20} />
          <span>Nova Refeição</span>
        </NavLink>
      </nav>

      <div className="auth-user">
        <div className="user-avatar">U</div>
        <div className="user-info">
          <span className="user-name">Perfil Principal</span>
          <span className="user-email">Acompanhamento</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
