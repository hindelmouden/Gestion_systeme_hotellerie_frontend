import React, { useState } from 'react';
import {
  getTauxOccupation,
  getChiffreAffaires,
  getTotalSejours,
  getPaiementsParType,
} from '../api';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList, 
} from 'recharts';

export default function Rapports() {
  const [hotelId, setHotelId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fonction qui récupère les données selon le type choisi
  const fetch = async (type) => {
    // Validation simple
    if (type !== 'types' && (!hotelId || !start || !end)) {
      alert('Merci de remplir Hotel ID, date de début et date de fin');
      return;
    }
    if (type === 'types' && (!start || !end)) {
      alert('Merci de remplir la date de début et la date de fin');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (type === 'taux') res = await getTauxOccupation(hotelId, start, end);
      else if (type === 'ca') res = await getChiffreAffaires(hotelId, start, end);
      else if (type === 'sejours') res = await getTotalSejours(hotelId, start, end);
      else if (type === 'types') res = await getPaiementsParType(start, end);

      setResult({ type, data: res.data });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la récupération des données');
    }
    setLoading(false);
  };

  // Préparer les données pour le graphique paiements par type
  const prepareChartData = () => {
    if (!result || result.type !== 'types' || !result.data.paiements_par_type) return [];

    return Object.entries(result.data.paiements_par_type).map(([key, value]) => ({
      type: key && key.trim() !== '' ? key : 'Type non défini',
      montant: parseFloat(value.toFixed(2)),
    }));
  };

  const chartData = prepareChartData();

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '40px auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: 20,
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#34495e',
          marginBottom: 30,
        }}
      >
        📊 Rapports statistiques
      </h1>

      {/* Inputs */}
      <div
        style={{
          display: 'flex',
          gap: 15,
          marginBottom: 20,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Hotel ID"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#2980b9')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          disabled={loading}
        />

        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#2980b9')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          disabled={loading}
        />

        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#2980b9')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          disabled={loading}
        />
      </div>

      {/* Boutons */}
      <div
        style={{
          display: 'flex',
          gap: 15,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 30,
        }}
      >
        <button onClick={() => fetch('taux')} style={buttonStyle} disabled={loading}>
          Taux d’occupation
        </button>
        <button onClick={() => fetch('ca')} style={buttonStyle} disabled={loading}>
          Chiffre d’affaires
        </button>
        <button onClick={() => fetch('sejours')} style={buttonStyle} disabled={loading}>
          Total séjours
        </button>
        <button onClick={() => fetch('types')} style={buttonStyle} disabled={loading}>
          Paiements par type
        </button>
      </div>

      {/* Résultat */}
      {loading && <p style={{ textAlign: 'center' }}>Chargement...</p>}

      {result && !loading && (
        <div
          style={{
            backgroundColor: '#f0f4f8',
            padding: 20,
            borderRadius: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {result.type === 'types' && chartData.length > 0 ? (
            <>
              <h3 style={{ marginBottom: 15, color: '#2c3e50' }}>
                Répartition des paiements par type
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 14, fill: '#333' }}
                    label={{ value: 'Type de paiement', position: 'bottom', offset: 20, fontSize: 16, fill: '#222' }}
                  />
                  <YAxis
                    tick={{ fontSize: 14, fill: '#333' }}
                    label={{ value: 'Montant (MAD)', angle: -90, position: 'insideLeft', fontSize: 16, fill: '#222' }}
                    tickFormatter={(value) => value.toLocaleString()}
                    domain={[0, 'dataMax + 1000']}
                  />
                  <Tooltip formatter={(value) => `${value.toFixed(2)} MAD`} cursor={{ fill: 'rgba(41, 128, 185, 0.1)' }} />
                  <Bar dataKey="montant" fill="#2980b9" radius={[5, 5, 0, 0]}>
                    <LabelList
                      dataKey="montant"
                      position="top"
                      formatter={(value) => value.toFixed(2)}
                      style={{ fill: '#2980b9', fontWeight: 'bold', fontSize: 14 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <>
              <h3 style={{ color: '#2c3e50', marginBottom: 12 }}>
                {{
                  taux: 'Taux d’occupation',
                  ca: 'Chiffre d’affaires',
                  sejours: 'Total séjours',
                }[result.type] || 'Résultat'}
              </h3>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  fontSize: 15,
                }}
              >
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '12px 22px',
  fontSize: 16,
  fontWeight: '600',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#8B4513', // marron
  color: 'white',
  boxShadow: '0 4px 8px rgba(139, 69, 19, 0.4)', // ombre marron plus claire
  transition: 'background-color 0.3s ease',
};

const inputStyle = {
  padding: '10px 15px',
  borderRadius: 6,
  border: '1.5px solid #ccc',
  width: 200,
  fontSize: 16,
  outline: 'none',
  transition: 'border-color 0.3s',
};
