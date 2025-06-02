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
  },
  {
    id: 5,
    name: 'Кактусовые поля',
    tourUrl: '/tour/5',
    previewImage: 'kaktus.jpg'
  },
  {
    id: 6,
    name: 'Красный бугор',
    tourUrl: '/tour/6',
    previewImage: 'bugor.jpg'
  },
  {
    id: 7,
    name: 'Сарай бату',
    tourUrl: '/tour/7',
    previewImage: 'batu.jpg'
  },
  {
    id: 8,
    name: 'Хошеутовский хурул',
    tourUrl: '/tour/8',
    previewImage: 'hram.jpg'
  }
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tourName: ''
  });
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

      const enrichedTours = tourList.map(tour => {
        const testInfo = userData.test_info?.find(t => t.testid === tour.id);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Данные формы:', formData);
    
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', tourName: '' });
    
    alert(`Тур "${formData.tourName}" успешно добавлен!`);
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
        
        <div className="header-actions">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="add-tour-button"
          >
            Добавить тур
          </button>
          
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            
            <h3>Добавить новый тур</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ваше имя</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите номер телефона"
                />
              </div>
              
              <div className="form-group">
                <label>Название тура</label>
                <input
                  type="text"
                  name="tourName"
                  value={formData.tourName}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите название тура"
                />
              </div>
              
              <button type="submit" className="submit-button">
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}

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