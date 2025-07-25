import React, { useState, useEffect } from 'react';
import axios from 'axios';

const style = {
  container: {
    backgroundColor: '#7B3F00',
    color: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    maxWidth: 400,
  },
  label: {
    display: 'block',
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 8,
    borderRadius: 4,
    border: 'none',
    marginTop: 4,
  },
  button: {
    marginTop: 15,
    padding: '8px 15px',
    backgroundColor: '#5A2E00',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  }
};

export default function FactureForm({ facture, clientId, onSaved, onCancel }) {
  const [formData, setFormData] = useState({
    client_id: clientId || '',
    date_facture: '',
    montant_total: '',
    sejour_id: '',
    type_facture: ''
  });

  useEffect(() => {
    if (facture) {
      setFormData({
        client_id: facture.client_id,
        date_facture: facture.date_facture,
        montant_total: facture.montant_total,
        sejour_id: facture.sejour_id,
        type_facture: facture.type_facture
      });
    } else {
      setFormData(f => ({ ...f, client_id: clientId }));
    }
  }, [facture, clientId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (facture) {
        // Modifier
        await axios.put(`http://localhost:3000/factures/${facture.id}`, formData);
      } else {
        // Ajouter
        await axios.post('http://localhost:3000/factures', formData);
      }
      onSaved();
    } catch (err) {
      alert('Erreur sauvegarde facture : ' + err.message);
    }
  };

  return (
    <form style={style.container} onSubmit={handleSubmit}>
    <h3>{facture ? 'Modifier' : 'Ajouter'} Facture</h3>

<label style={style.label}>Date facture</label>
<input
  type="date"
  name="date_facture"
  value={formData.date_facture}
  onChange={handleChange}
  required
  disabled={facture !== null} // désactive si on modifie une facture
  style={{
    ...style.input,
    color: facture !== null ? '#6c757d' : 'black', // gris si modif
    backgroundColor: facture !== null ? '#e9ecef' : 'white', // fond gris clair si désactivé
    cursor: facture !== null ? 'not-allowed' : 'auto'
  }}
/>

      <label style={style.label}>Montant total (€)</label>
      <input type="number" step="0.01" name="montant_total" value={formData.montant_total} onChange={handleChange} required style={style.input} />

      <label style={style.label}>ID Séjour</label>
      <input type="text" name="sejour_id" value={formData.sejour_id} onChange={handleChange} required style={style.input} />

      <label style={style.label}>Type facture</label>
      <input type="text" name="type_facture" value={formData.type_facture} onChange={handleChange} required style={style.input} />

      <button type="submit" style={style.button}>Enregistrer</button>
      <button type="button" style={{ ...style.button, marginLeft: 10, backgroundColor: '#A65C00' }} onClick={onCancel}>Annuler</button>
    </form>
  );
}
