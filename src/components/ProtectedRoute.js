// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const role = localStorage.getItem('role'); // ou ton auth check

  // Si pas connecté → on redirige vers /login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Sinon on affiche la page demandée
  return children;
}
