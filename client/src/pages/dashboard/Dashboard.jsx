import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { FaTachometerAlt, FaChartLine, FaClipboardList, FaUsers, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom'; 
import logo2 from '../../assets/logo2.png';

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate(); 

  //se obtiene el rol del usuario
  useEffect(() => {
    const role = localStorage.getItem('role');
    console.log('User role from localStorage:', role);  
    setUserRole(role);  
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prevState => !prevState);
  };

  //cerrar sesion
  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("role");   
    window.location.href = "http://localhost:5173";  //rediriger al login
  };

  return (
    <div className={`dashboard-container ${isCollapsed ? 'collapsed' : ''}`}>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <header className="sidebar-header">
          <a href="#" className="header-logo">
            <img src={logo2} alt="Logo" />
          </a>
          <button className="toggler sidebar-toggler" onClick={toggleSidebar}>
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </header>

        <nav className="sidebar-nav">
          <ul className="nav-list primary-nav">
            {userRole === 'user' && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard/report" className="nav-link">
                    <span className="nav-icon"><FaTachometerAlt /></span>
                    <span className="nav-label">Crear nuevo</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/myreports" className="nav-link">
                    <span className="nav-icon"><FaChartLine /></span>
                    <span className="nav-label">Mis reportes</span>
                  </Link>
                </li>
              </>
            )}

            {userRole === 'admin' && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard/visualize" className="nav-link">
                    <span className="nav-icon"><FaClipboardList /></span>
                    <span className="nav-label">Incidencias</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/users" className="nav-link">
                    <span className="nav-icon"><FaUsers /></span>
                    <span className="nav-label">Usuarios</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard/assign" className="nav-link">
                    <span className="nav-icon"><FaUsers /></span>
                    <span className="nav-label">Asignaciones</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="nav-list secondary-nav">
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={handleLogout}>
                <span className="nav-icon"><FaSignOutAlt /></span>
                <span className="nav-label">Cerrar sesión</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
