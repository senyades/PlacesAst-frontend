import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPage.scss';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [targetLogin, setTargetLogin] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/users`);
        setUsers(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке пользователей:', err);
        setError('Не удалось загрузить список пользователей');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleResetPassword = async (targetLogin) => {
    try {
      const admin = JSON.parse(localStorage.getItem('user')); // получаем данные о администраторе из локального хранилища
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/reset-password`, {
        adminLogin: admin.login,
        adminPassword,
        targetLogin,
        newPassword
      });

      setMessage(response.data.message || 'Пароль обновлён');
      setNewPassword(''); // очищаем поля
      setAdminPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Ошибка при сбросе пароля');
    }
  };

  const handleLogout = () => {
    // Удаляем пользователя из localStorage
    localStorage.removeItem('user');
    // Перенаправляем на страницу входа
    navigate('/');
  };

  if (loading) return <div className="admin-loading">Загрузка пользователей...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-container">
      <h2>Админ-панель: Пользователи</h2>

      {/* Кнопка выхода */}
      <button className="logout-btn" onClick={handleLogout}>
        Выйти
      </button>

      {message && <div className="message">{message}</div>}

      <table className="users-table">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Роль</th>
            <th>Пройденные тесты</th>
            <th>Баллы</th>
            <th>Сброс пароля</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td>{user.login}</td>
              <td>{user.admin ? 'Админ' : 'Пользователь'}</td>
              <td>
                {user.test_info?.filter(t => t.passed).length || 0} / {user.test_info?.length || 0}
              </td>
              <td>
                {user.test_info?.reduce((sum, t) => sum + (t.score || 0), 0) || 0}
              </td>
              <td>
                <input
                  type="password"
                  placeholder="Новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Ваш пароль (для подтверждения)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <button onClick={() => handleResetPassword(user.login)}>Сбросить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
