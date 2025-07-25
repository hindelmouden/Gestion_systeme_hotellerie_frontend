  import React, { useState, useEffect } from 'react';
  import { getPayments, addPayment } from '../api';
  import { v4 as uuidv4 } from 'uuid';
  import axios from 'axios';
  const API_BASE = 'http://localhost:5000/api';


  export default function Paiements() {
    const [payments, setPayments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ client_id: '', montant: '', mode: '', description: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const itemsPerPage = 9;
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      loadClients();
        fetchPayments();
  
    }, []);
    
    useEffect(() => {
      console.log("Paiements chargés:", payments);
      console.log("Clients chargés:", clients);
    }, [payments, clients]);
    
    

    const fetchPayments = async () => {
      setLoading(true); // démarre le loading
      try {
        const res = await getPayments();
        setPayments(res.data);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false); // stoppe le loading
      }
    };

    const getClientName = (id) => {
      if (!id || clients.length === 0) return '';
      const client = clients.find(c => c.id.trim().toLowerCase() === id.trim().toLowerCase());
      return client ? `${client.prenom} ${client.nom}` : '❓ Inconnu';
    };
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await addPayment({
          id: uuidv4(),
          date_paiement: new Date(),
          montant: parseFloat(form.montant),
          mode: form.mode,
          description: form.description,
          client_id: form.client_id
        });
        alert('✅ Paiement ajouté !');
        setForm({ client_id: '', montant: '', mode: '', description: '' });
        setShowForm(false);
        fetchPayments();
      } catch (err) {
        console.error('Erreur:', err);
        alert('❌ Erreur lors de l\'ajout');
      } finally {
        setLoading(false);
      }
    };
    const loadClients = async () => {
      try {
       // const res = await axios.get(`${API_BASE}/clients`);
        const res = await axios.get(`${API_BASE}/clients?page=1&limit=30`);

        const data = res.data;

        if (Array.isArray(data)) {
          setClients(data);
        } else if (data && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else {
          console.warn('Format inattendu des clients:', data);
          setClients([]);
        }
      } catch (error) {
        console.error('Erreur lors du fetch des clients:', error);
        setClients([]);
      }
    };
 
    // Pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentPayments = payments.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(payments.length / itemsPerPage);

    return (
      <div style={{ 
        padding: '40px 20px', 
        fontFamily: 'Arial, sans-serif', 
        backgroundColor: '#f8f4f0', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <h2 style={{ color: '#5a3e2b', marginBottom: '20px' }}>💳 Gestion des paiements</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#8b5e3c',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '25px',
            fontSize: '16px',
            fontWeight: '600',
            minWidth: '200px'
          }}>
          {showForm ? 'Annuler' : '➕ Ajouter un paiement'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit}
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              marginBottom: '40px',
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
            <input
              type="text" placeholder="Client ID" value={form.client_id}
              onChange={e => setForm({ ...form, client_id: e.target.value })}
              style={{ padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="number" placeholder="Montant" value={form.montant}
              onChange={e => setForm({ ...form, montant: e.target.value })}
              style={{ padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="text" placeholder="Mode (carte, cash...)" value={form.mode}
              onChange={e => setForm({ ...form, mode: e.target.value })}
              style={{ padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="text" placeholder="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <button type="submit"
              style={{ 
                backgroundColor: '#5a3e2b', 
                color: '#fff', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '16px'
              }}>
              Ajouter
            </button>
          </form>
        )}

        {/* Loader */}
        {loading && <p style={{ color: '#5a3e2b', marginBottom: '20px' }}>⏳ Chargement...</p>}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '22px', 
          width: '100%', 
          maxWidth: '960px',
          marginBottom: '30px'
        }}>
        {currentPayments.map(p => (
  <div key={p.id}
            onClick={() => setSelectedPayment(p)} // 👈 ouvrir la modal
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              color: '#4b3a29',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h4 style={{ marginBottom: '10px', color: '#8b5e3c' }}>💰 {p.montant} MAD</h4>
            <p><strong>Client:</strong> {getClientName(p.client_id)} </p>
            <p><strong>Mode:</strong> {p.mode}</p>
            <p><strong>Date:</strong> {new Date(p.date_paiement).toLocaleString()}</p>
            <p><strong>Description:</strong> {p.description}</p>
          </div>
        ))}

        </div>

        {/* Pagination */}
        <div style={{ 
          width: '100%', 
          maxWidth: '960px', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px'
        }}>
          <span style={{ color: '#5a3e2b', fontWeight: '600' }}>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              backgroundColor: currentPage === 1 ? '#ccc' : '#8b5e3c',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}>
            ⬅ Précédent
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              backgroundColor: currentPage === totalPages ? '#ccc' : '#8b5e3c',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}>
            Suivant ➡
          </button>
        </div>

        {selectedPayment && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '10px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 0 15px rgba(0,0,0,0.3)',
      position: 'relative'
    }}>
      <button onClick={() => setSelectedPayment(null)} style={{
        position: 'absolute',
        top: '10px',
        right: '15px',
        border: 'none',
        background: 'transparent',
        fontSize: '18px',
        cursor: 'pointer'
      }}>✖</button>

      <h3 style={{ color: '#5a3e2b' }}>📋 Détails du Paiement</h3><hr/>
      <p><strong>ID:</strong> {selectedPayment.id}</p>
      <p><strong>Client ID:</strong> {selectedPayment.client_id}</p>
      <p><strong>Facture ID:</strong> {selectedPayment.facture_id}</p>
      <p><strong>Sejour ID :</strong> {selectedPayment.sejour_id}</p>
      <p><strong>Client:</strong> {getClientName(selectedPayment.client_id)}</p>  
      <p><strong>Montant:</strong> {selectedPayment.montant} MAD</p>
      <p><strong>Mode:</strong> {selectedPayment.mode}</p>
      <p><strong>Date paiement :</strong> {new Date(selectedPayment.date_paiement).toLocaleString()}</p>
      <p><strong>Description:</strong> {selectedPayment.description}</p>
    </div>
  </div>
)}

      </div>

      
    );
 
  }
 