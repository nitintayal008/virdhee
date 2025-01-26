import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/api/placeholder/50/50" alt="Logo" />
      </div>

      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
        <i className="search-icon">🔍</i>
      </div>

      <div className="navbar-icons">
        <div className="icon-group">
          <span>🏠</span>
          <span>💬</span>
          <span>📅</span>
          <span>👥</span>
          <span>⚙️</span>
        </div>

        <div className="profile-container">
          <div 
            className="profile-icon" 
            onClick={toggleProfile}
          >
            👤
          </div>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <p>John Doe</p>
                <p>john.doe@example.com</p>
              </div>
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li className="logout">Logout</li>
              </ul>
            </div>
          )}
        </div>
        <div className="notification-icon">
            <span>🔔</span>
            <div className="notification-badge">3</div>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;