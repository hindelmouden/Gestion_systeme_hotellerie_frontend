import React, { useState } from 'react';
import { addPayment } from '../api';

export default function AddPayment() {
  const [form, setForm] = useState({ client_id: '', montant: '', mode: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPayment(form);
      alert('✅ Paiement ajouté !');
      setForm({ client_id: '', montant: '', mode: '', description: '' });
    } catch (err) {
      console.error('Erreur:', err);
      alert('❌ Erreur lors de l\'ajout iciiiiii');
    }
  };

  return (
    <div>
      <h2>Ajouter un paiement</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Client ID" value={form.client_id}
          onChange={e => setForm({ ...form, client_id: e.target.value })} />
        <input type="number" placeholder="Montant" value={form.montant}
          onChange={e => setForm({ ...form, montant: e.target.value })} />
        <input type="text" placeholder="Mode (carte, cash...)" value={form.mode}
          onChange={e => setForm({ ...form, mode: e.target.value })} />
        <input type="text" placeholder="Description" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}
