import React, { useState } from 'react';
import { addClient } from '../api';
import { v4 as uuidv4 } from 'uuid';

function AddClient() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClient({
        id: uuidv4(),
        ...form
      });
      alert('Client ajouté avec succès !');
      setForm({ nom: '', prenom: '', email: '', telephone: '' });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter un Client</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} className="form-control mb-2" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className="form-control mb-2" required />
        <button type="submit" className="btn" style={{ backgroundColor: '#A47148', color: '#fff' }}>Ajouter</button>
      </form>
    </div>
  );
}

export default AddClient;
