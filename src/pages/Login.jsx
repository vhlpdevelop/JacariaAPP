import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress,
  Paper,
  Avatar,
  CssBaseline
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://serverjacaria-production.up.railway.app/user/login', 
        credentials,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resposta completa da API:', response);

      if (response.data && response.data.ok) {
        const { token, user, sensors } = response.data;
        
        console.log('Dados recebidos:', { 
          token, 
          user, 
          sensors: Array.isArray(sensors) ? sensors : [sensors] 
        });

        // Garante que sensors seja um array
        
        console.log('Dados antes do login:', {
          token: token,
          user: user,
          sensors: sensors
        });
        login(token, user, sensors);
        navigate('/dashboard');
      } else {
        const errorMsg = response.data?.msg || 'Credenciais inválidas';
        console.error('Erro no login:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Erro na requisição:', {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });

      const errorMsg = err.response?.data?.msg || 
                      err.message || 
                      'Erro ao conectar com o servidor';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 2
      }}
    >
      <CssBaseline />
      <Paper
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Acesso ao Sistema
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              align="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : 'Entrar'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center">
          Sistema de Monitoramento de Jacarés
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;