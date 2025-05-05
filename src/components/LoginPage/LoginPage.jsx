import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.scss';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        credentials
      );
      
      if (response.data.message === 'Вход выполнен успешно') {
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
  
        // 👇 Редирект в зависимости от роли
        if (user.admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error 
        || 'Ошибка при подключении к серверу';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Вход в систему</h2>
        
        <div className="form-group">
          <label>Логин:</label>
          <input
            type="text"
            name="login"
            value={credentials.login}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Выполняется вход...' : 'Войти'}
        </button>

        <div className="register-link">
          Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;