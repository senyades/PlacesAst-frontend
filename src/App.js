import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Dashboard from './components/Dashboard/Dashboard';
import Excursions1 from './components/Excursions/Excursions1';
import Excursions2 from './components/Excursions/Excursions2';
import Excursions3 from './components/Excursions/Excursions3';
import Excursions4 from './components/Excursions/Excursions4';
import Excursions8 from './components/Excursions/Excursions8';
import TestPage from './components/Tests/Test1';
import TestPage2 from './components/Tests/Test2';
import TestPage3 from './components/Tests/Test3';
import TestPage4 from './components/Tests/Test4';
import TestPage8 from './components/Tests/Test8';
import AdminPage from './components/Adminpage/AdminPage';

// Защита для авторизованных пользователей
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" replace />;
};

// Защита для админа
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.admin ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/tour/1" element={<Excursions1 />} />
        <Route path="/tour/2" element={<Excursions2 />} />
        <Route path="/tour/3" element={<Excursions3 />} />
        <Route path="/tour/4" element={<Excursions4 />} />
         <Route path="/tour/8" element={<Excursions8 />} />
        <Route path="/test/1" element={<TestPage />} />
        <Route path="/test/2" element={<TestPage2 />} />
        <Route path="/test/3" element={<TestPage3 />} />
        <Route path="/test/4" element={<TestPage4 />} />
        <Route path="/test/8" element={<TestPage8 />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
