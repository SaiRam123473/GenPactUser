import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return <div className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">UD</span><span>User Directory</span></div>
      <nav aria-label="Main navigation"><NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>List users</NavLink><NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add user</NavLink></nav>
    </header>
    <main className="main-content"><Outlet /></main>
    <footer className="footer">User Directory <span>•</span> Full-stack coding assignment</footer>
  </div>;
}
