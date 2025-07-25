import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Sejours from './pages/Sejours';
import Paiements from './pages/Paiements';
import Rapports from './pages/Rapports';
import Clients from './pages/Clients';
import SejourList from './pages/SejourList';
import AddSejour from './pages/AddSejour';
import FactureList from './pages/FacturesList';

function App() {
  // Exemple: clientId statique (à remplacer par un client sélectionné ou connecté)
  const clientId = '00000000-0000-0000-0000-000000000000'; // UUID valide à adapter

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">

        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">LuxuryHotel</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><Link className="nav-link" to="/">Accueil</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/sejours">Séjours</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/paiements">Paiements</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/rapports">Rapports</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/clients">Clients</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/factures">Factures</Link></li>              </ul>
            </div>
          </div>
        </nav>

        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sejours" element={<Sejours />} />
            <Route path="/sejours/ajouter" element={<AddSejour />} />
            <Route path="/sejours/liste" element={<SejourList />} />
            <Route path="/paiements" element={<Paiements />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/factures" element={<FactureList />} />
          </Routes>
        </div>

        <footer className="bg-primary text-white text-center py-3 mt-auto">
          © 2025 LuxuryHotel - Tous droits réservés
        </footer>

      </div>
    </Router>
  );
}

export default App;
