import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Layout from '@/components/layout';
import Profile from '@/pages/Profile';
import ProfileEdit from '@/pages/ProfileEdit';
import About from '@/pages/About';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import { Toaster } from "@/components/ui/use-toast";
import { apiClient } from '@/lib/api';
import Astrology from '@/pages/Astrology';

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeUser = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo?.id) {
        setUser(userInfo);
        initializeSocket(userInfo);
      }
    };

    initializeUser();
  }, []);

  const initializeSocket = (userInfo) => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(SOCKET_URL, {
      query: { userId: userInfo.id },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        token: userInfo.token
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  };

  const handleUpdateUser = (updatedUser) => {
    const newUserInfo = { ...user, ...updatedUser };
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    setUser(newUserInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
          <Route index element={<Home socket={socket} user={user} />} />
          <Route path="about" element={<About />} />
          <Route path="astrology" element={<Astrology />} />
          <Route path="login" element={
            user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />
          } />
          <Route path="register" element={
            user ? <Navigate to="/dashboard" replace /> : <Register setUser={setUser} />
          } />

          {/* Protected Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard socket={socket} user={user} />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          } />
          <Route path="profile/edit" element={
            <ProtectedRoute user={user}>
              <ProfileEdit 
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}