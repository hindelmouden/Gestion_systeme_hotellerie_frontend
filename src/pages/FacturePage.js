import React from 'react';

function FacturePage({ clientId }) {
  const [factures, setFactures] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/factures?clientId=${clientId}`)
      .then(res => res.json())
      .then(data => {
        console.log('factures data:', data);
        // adapte ici selon la vraie structure
        setFactures(Array.isArray(data) ? data : data.factures || []);
      })
      .catch(err => console.error(err));
  }, [clientId]);

  return (
    <div>
      <h2>Factures</h2>
      {Array.isArray(factures) && factures.length > 0 ? (
        factures.map(facture => (
          <div key={facture.id}>
            <p>ID : {facture.id}</p>
            <p>Date : {facture.date_facture}</p>
            <p>Montant : {facture.montant_total}</p>
            {/* etc */}
          </div>
        ))
      ) : (
        <p>Aucune facture trouvée.</p>
      )}
    </div>
  );
}

export default FacturePage;
