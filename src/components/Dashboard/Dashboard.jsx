import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

const tourList = [
  {
    id: 1,
    name: 'Астраханский кремль',
    tourUrl: '/tour/1',
    previewImage: 'kreml.jpg'
  },
  {
    id: 2,
    name: 'Краеведческий музей',
    tourUrl: '/tour/2',
    previewImage: 'museum.jfif'
  },
  {
    id: 3,
    name: 'Буддийская культура калмыков',
    tourUrl: '/tour/3',
    previewImage: 'maxresdefault.jpg'
  },
  {
    id: 4,
    name: 'Ихтиофауна низовий Волги',
    tourUrl: '/tour/4',
    previewImage: 'volga.jpg'
  }
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Добавим информацию о прохождении теста к каждому туру
      const enrichedTours = tourList.map(tour => {
        const testInfo = userData.test_info.find(t => t.testid === tour.id);
        return {
          ...tour,
          testStatus: testInfo ? testInfo.passed : false
        };
      });

      setTours(enrichedTours);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      localStorage.removeItem('user');
      navigate('/');
    }
  }, [navigate]);

  const handleTourClick = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <h2>Добро пожаловать, {user.login}!</h2>
          {user.admin && <div className="admin-badge">Администратор</div>}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </header>

      <div className="tours-section">
        <h3>Доступные онлайн-туры</h3>
        <div className="tours-grid">
          {tours.map((tour) => (
            <div 
              key={tour.id}
              className="tour-card"
              onClick={() => handleTourClick(tour.id)}
            >
              <div 
                className="tour-preview"
                style={{ backgroundImage: `url(/images/${tour.previewImage})` }}
              >
                {tour.testStatus && (
                  <div className="tour-status completed">
                    Тест пройден
                  </div>
                )}
              </div>
              <div className="tour-info">
                <h4>{tour.name}</h4>
                <button 
                  className="start-tour-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTourClick(tour.id);
                  }}
                >
                  Начать тур
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
