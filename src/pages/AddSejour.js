import React, { useState } from 'react';
import { addSejour } from '../api';
import { v4 as uuidv4 } from 'uuid';

export default function AddSejour() {
  const [form, setForm] = useState({
    client_id: '',
    date_debut: '',
    date_fin: '',
    hotel_id: '',
    montant: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addSejour({
        id: uuidv4(),
        ...form,
        montant: parseFloat(form.montant)
      });
      alert('Séjour ajouté avec succès !');
      setForm({
        client_id: '',
        date_debut: '',
        date_fin: '',
        hotel_id: '',
        montant: ''
      });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un séjour</h2>

      <div>
        <label>Client ID :</label><br />
        <input name="client_id" value={form.client_id} onChange={handleChange} required />
      </div>

      <div>
        <label>Date Début :</label><br />
        <input type="date" name="date_debut" value={form.date_debut} onChange={handleChange} required />
      </div>

      <div>
        <label>Date Fin :</label><br />
        <input type="date" name="date_fin" value={form.date_fin} onChange={handleChange} required />
      </div>

      <div>
        <label>Hotel ID :</label><br />
        <input name="hotel_id" value={form.hotel_id} onChange={handleChange} required />
      </div>

      <div>
        <label>Montant :</label><br />
        <input
          type="number"
          step="0.01"
          name="montant"
          value={form.montant}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" style={{ marginTop: '10px' }}>Ajouter</button>
    </form>
  );
}
