import React from 'react';
import hotelVideo from '../assets/hotel_files/vid3.mp4';

function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-3">Bienvenue chez LuxuryHotel</h1>
      <p className="hero-text mb-4">
        Confort, élégance et sérénité dans un cadre chaleureux et raffiné.
      </p>

      <div className="position-relative">
      <video
  src={hotelVideo}
  autoPlay
  muted
  loop
  playsInline
  className="img-fluid rounded shadow"
  style={{ maxHeight: '600px', objectFit: 'cover', width: '100%' }}
/>
      </div>
    </div>
  );
}

export default Home;
