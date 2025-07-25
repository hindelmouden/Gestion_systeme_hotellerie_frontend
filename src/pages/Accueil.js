import React from 'react';

export default function Accueil() {
  return (
    <div>
      <h1>Bienvenue chez LuxuryHotel</h1>

      <section>
        <h2>Nos Séjours</h2>

        <div style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10 }}>
          <h3>Chambre Deluxe</h3>
          <p>Élégante et spacieuse</p>
        </div>

        <div style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10 }}>
          <h3>Suite Présidentielle</h3>
          <p>Confort absolu</p>
        </div>

        <div style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10 }}>
          <h3>Chambre Standard</h3>
          <p>Simple et cosy</p>
        </div>
      </section>

      <footer>
  <p>© 2025 LuxuryHotel - Tous droits réservés</p>
</footer>
    </div>
  );
}



  
