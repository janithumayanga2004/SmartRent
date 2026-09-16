import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PredictPage from './pages/PredictPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuthPage from './pages/AuthPage';

function MainApp() {
  const [activePage, setActivePage] = useState('predict');
  const [authMessage, setAuthMessage] = useState('');
  const toast = useToast();

  // Legacy-compatible notify bridge so all pages keep working unchanged
  const notify = (message, type = 'success') => toast(message, type);

  const handleOpenAuth = (msg) => {
    setAuthMessage(msg || '');
    setActivePage('auth');
  };

  return (
    <div className="app-container">
      {/* Sticky Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setAuthMessage('');
          setActivePage(page);
        }}
        onOpenAuth={handleOpenAuth}
        notify={notify}
      />

      {/* Main Page Content */}
      <main className="main-content">
        {activePage === 'predict' && (
          <PredictPage notify={notify} setActivePage={setActivePage} />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage notify={notify} setActivePage={setActivePage} />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage notify={notify} />
        )}

        {activePage === 'auth' && (
          <AuthPage
            notify={notify}
            setActivePage={setActivePage}
            initialMessage={authMessage}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
