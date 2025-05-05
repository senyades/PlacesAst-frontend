import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.scss';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        login: formData.login,
        password: formData.password
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000); // Перенаправление через 2 сек
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Логин уже занят');
      } else {
        setError('Ошибка сервера. Попробуйте позже');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Регистрация</h2>
        
        <div className="form-group">
          <label>Логин:</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Подтвердите пароль:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Регистрация успешна! Перенаправляем...</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <div className="login-link">
          Уже есть аккаунт? <Link to="/">Войти</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;