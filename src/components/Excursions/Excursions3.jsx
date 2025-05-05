import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Excursions.scss';

const Excursions3 = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/test/3');
  };

  return (
    <div className="tour-page">
      <header className="tour-header">
        <h2>Буддийская культура калмыков</h2>
      </header>

      <div className="viewer-container">
        <iframe
          src="https://astmuseum.ru/ru/virtualnyy-tur/ritualnyy-buddiyskiy-kompleks-kalmykov/" // <-- Заменить на реальный 3D-URL
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

export default Excursions3;
