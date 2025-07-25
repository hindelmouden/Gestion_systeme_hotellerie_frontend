import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold text-warning" to="/">LuxuryHotel</NavLink>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/">Accueil</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sejours">Séjours</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/paiements">Paiements</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/factures">Factures</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/rapports">Rapports</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/clients">Clients</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
