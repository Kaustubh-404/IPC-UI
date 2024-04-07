import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav style={{ backgroundColor: '#333', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/">
          <img src="/path/to/your/logo.png" alt="Logo" style={{ height: '40px', width: 'auto' }} />
        </Link>
      </div>
      <div>
        <Link to="/a" style={{ color: '#fff', marginRight: '20px' }}>
          Setup
        </Link>
        <Link to="/b" style={{ color: '#fff' }}>
          Deployment
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
