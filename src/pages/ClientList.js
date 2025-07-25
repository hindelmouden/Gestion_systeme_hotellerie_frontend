import React, { useEffect, useState } from 'react';
import { getClients, deleteClient, searchClients, getClientById, updateClient, addClient } from '../api';


function ClientList() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [editingClient, setEditingClient] = useState(null); // null = ajout
  const [formClient, setFormClient] = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [successMessage, setSuccessMessage] = useState(''); // ✅ Place-la ici


  useEffect(() => {
    fetchClients(page);
  }, [page]);

  const fetchClients = async (pageNumber = 1) => {
    try {
      const res = await getClients({ page: pageNumber, limit: 10 }); // backend récupère max 100, front pagine par 10
      setClients(res.data.clients || res.data);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormClient({ nom: '', prenom: '', email: '', telephone: '' });
    setEditingClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formClient);
        setSuccessMessage("✅ Client modifié avec succès !");
      } else {
        await addClient(formClient);
        setSuccessMessage("✅ Client ajouté avec succès !");
      }
      resetForm();
      fetchClients();
      setTimeout(() => setSuccessMessage(''), 3000); // Disparait après 3 secondes
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormClient({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await deleteClient(id);
        fetchClients();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSearch = async () => {
    try {
      const res = await searchClients(search);
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const clientsPerPage = 10;
  const totalPages = Math.ceil(total / clientsPerPage);
  const displayedClients = clients.slice((page - 1) * clientsPerPage, page * clientsPerPage);

  const goToPage = (num) => {
    if (num < 1 || num > totalPages) return;
    setPage(num);
  };


  return (
    <div className="container mt-4">
      <h2>Liste des Clients</h2>
      {successMessage && (
  <div className="alert alert-success alert-dismissible fade show" role="alert">
    {successMessage}
    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
  </div>
)}

      {/* Formulaire unique ajout/modif */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>{editingClient ? 'Modifier un client' : 'Ajouter un client'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-2 align-items-center">
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Nom"
                  value={formClient.nom}
                  onChange={(e) => setFormClient({ ...formClient, nom: e.target.value })}
                  required
                />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Prénom"
                  value={formClient.prenom}
                  onChange={(e) => setFormClient({ ...formClient, prenom: e.target.value })}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={formClient.email}
                  onChange={(e) => setFormClient({ ...formClient, email: e.target.value })}
                  required
                />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Téléphone"
                  value={formClient.telephone}
                  onChange={(e) => setFormClient({ ...formClient, telephone: e.target.value })}
                  required
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Enregistrer' : 'Ajouter'}
                </button>
                {editingClient && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={resetForm}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control mb-2"
        />
        <button onClick={handleSearch} className="btn btn-primary">Rechercher</button>
      </div>

      {/* Liste des clients */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.nom}</td>
              <td>{client.prenom}</td>
              <td>{client.email}</td>
              <td>{client.telephone}</td>
              <td>
            

                <td>
                  <button className="icon-btn" onClick={() => handleEdit(client)}>🖊️</button>
                  <button className="icon-btn" onClick={() => handleDelete(client.id)}>🗑️</button>
                </td>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">Aucun client trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => goToPage(page - 1)}>Précédent</button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => goToPage(page + 1)}>Suivant</button>
          </li>
        </ul>
      </nav>
      <hr/>
    </div>
  );
}

export default ClientList;
