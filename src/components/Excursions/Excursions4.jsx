import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Excursions.scss';

const Excursions4 = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/test/4');
  };

  return (
    <div className="tour-page">
      <header className="tour-header">
        <h2>Фауна волги</h2>
      </header>

      <div className="viewer-container">
        <iframe
          src="https://astmuseum.ru/ru/virtualnyy-tur/ihtiofauna-nizoviy-volgi/" // <-- Заменить на реальный 3D-URL
          title="Исторический центр Москвы"
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

export default Excursions4;
