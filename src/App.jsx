import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import CookieSettings from './components/CookieSettings';
import PrivacyPolicy from './components/PrivacyPolicy';
import { initGA, trackPageView } from './js/analytics';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardIndex from './pages/DashboardIndex';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Monitoramento from './pages/Monitoramento';
import SensorDetailPage from './pages/SensorDetailPage';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  const [cookieConsent, setCookieConsent] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [openCookieBanner, setOpenCookieBanner] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!localStorage.getItem('token');

  // Verifica consentimento ao carregar
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    } else {
      setOpenCookieBanner(true);
    }
  }, []);

  // Inicializa GA se consentido
  useEffect(() => {
    if (cookieConsent.analytics) {
      initGA('G-FX9LLWKZMH');
      trackPageView(location.pathname);
    }
  }, [cookieConsent.analytics, location.pathname]);

  // Função de consentimento unificada
  const handleConsent = (consent) => {
    const newConsent = {
      essential: true,
      analytics: consent,
      marketing: consent,
    };

    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    setCookieConsent(newConsent);
    setOpenCookieBanner(false);
    setSnackbarOpen(true);

    if (consent && !window.gaInitialized) {
      initGA('G-FX9LLWKZMH');
      window.gaInitialized = true;
    }
  };

  // Atualiza preferências salvas
  const handleSaveCookiePreferences = (preferences) => {
    const updatedConsent = {
      ...preferences,
      essential: true,
    };

    localStorage.setItem('cookieConsent', JSON.stringify(updatedConsent));
    setCookieConsent(updatedConsent);

    if (updatedConsent.analytics && !window.gaInitialized) {
      initGA('G-FX9LLWKZMH');
      window.gaInitialized = true;
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const showCookieBanner = openCookieBanner && location.pathname !== '/cookie-settings';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Rotas que NÃO usam AuthProvider */}
        <Route path="/cookie-settings" element={<CookieSettings onSave={handleSaveCookiePreferences} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Rotas que usam AuthProvider */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    isAuthenticated ? (
                      <Dashboard />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                >
                  <Route index element={<DashboardIndex />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="monitoring" element={<Monitoramento />} />
                  <Route path="sensor/:id" element={<SensorDetailPage />} />
                </Route>
                
                {/* Redirecionamento para login caso não autenticado */}
                <Route 
                  path="*" 
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
              </Routes>
            </AuthProvider>
          }
        />
      </Routes>

      {showCookieBanner && (
        <Box sx={bannerStyle}>
          <Typography variant="body2">
            Utilizamos cookies para melhorar sua experiência.
            <a href="/privacy-policy" target="_blank" rel="noopener"> Política de Privacidade</a>
          </Typography>
          <Button onClick={() => handleConsent(true)} color="primary">Aceitar Tudo</Button>
          <Button onClick={() => handleConsent(false)} color="secondary">Recusar</Button>
          <Button onClick={() => navigate('/cookie-settings')} color="primary">Personalizar</Button>
        </Box>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity="success">Preferências salvas!</Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

const bannerStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  bgcolor: 'background.paper',
  p: 2,
  textAlign: 'center',
  boxShadow: 3,
};

export default App;