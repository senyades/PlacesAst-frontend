import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Excursions.scss';

const Excursions2 = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/test/2');
  };

  return (
    <div className="tour-page">
      <header className="tour-header">
        <h2>Краеведческий музей</h2>
      </header>

      <div className="viewer-container">
        <iframe
          src="https://astmuseum.ru/ru/virtualnyy-tur/kraevedcheskiy-musei/" // <-- Заменить на реальный 3D-URL
          title="Краеведческий музей"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      <div className="test-start">
        <button onClick={handleStartTest}>Пройти тест</button>
      </div>
    </div>
  );
};

export default Excursions2;
