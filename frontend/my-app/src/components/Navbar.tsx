// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => (
  <nav className="navbar">
    <ul>
      <li>
        <Link to="/">Table</Link>
      </li>
      <li>
        <Link to="/prediction">Prediction</Link>
      </li>
      <li><Link to="/head-to-head">Head to Head</Link></li>
    </ul>
  </nav>
);

export default Navbar;
