import React, { useState } from 'react';
import { updateClient } from '../api';

function EditClient({ client, onSave, onCancel }) {
  const [form, setForm] = useState({
    nom: client.nom,
    prenom: client.prenom,
    email: client.email,
    telephone: client.telephone,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClient(client.id, form);
      onSave(); // pour recharger la liste
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-3" style={{ backgroundColor: '#f8f2ed', borderColor: '#8B4513' }}>
      <h5>Modifier le client</h5>
      <div className="mb-2">
        <input name="nom" value={form.nom} onChange={handleChange} className="form-control" placeholder="Nom" />
      </div>
      <div className="mb-2">
        <input name="prenom" value={form.prenom} onChange={handleChange} className="form-control" placeholder="Prénom" />
      </div>
      <div className="mb-2">
        <input name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Email" />
      </div>
      <div className="mb-2">
        <input name="telephone" value={form.telephone} onChange={handleChange} className="form-control" placeholder="Téléphone" />
      </div>
      <div>
        <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}

export default EditClient;
