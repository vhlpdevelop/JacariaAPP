import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  useTheme
} from '@mui/material';

const Settings = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    alertThreshold: 30,
    darkMode: false,
    emailReports: true
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar configurações
    console.log('Configurações salvas:', settings);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Configurações do Sistema
      </Typography>
      
      <Grid container spacing={3}>
        {/* Configurações de Notificação */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Notificações
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.notifications}
                  onChange={handleChange}
                  name="notifications"
                  color="primary"
                />
              }
              label="Receber notificações"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Limite para alertas (temperatura °C)"
              type="number"
              name="alertThreshold"
              value={settings.alertThreshold}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.emailReports}
                  onChange={handleChange}
                  name="emailReports"
                  color="primary"
                />
              }
              label="Receber relatórios por e-mail"
            />
          </Paper>
        </Grid>

        {/* Aparência */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Aparência
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={settings.darkMode}
                  onChange={handleChange}
                  name="darkMode"
                  color="primary"
                />
              }
              label="Modo escuro"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle2" gutterBottom>
              Tema do sistema:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                sx={{ bgcolor: theme.palette.primary.main }}
              >
                Padrão
              </Button>
              <Button 
                variant="contained" 
                sx={{ bgcolor: theme.palette.secondary.main }}
              >
                Alternativo
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Configurações de Conta */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Configurações de Conta
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  variant="outlined"
                  defaultValue="Usuário"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  variant="outlined"
                  defaultValue="usuario@exemplo.com"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Alterar senha:
            </Typography>
            <TextField
              fullWidth
              label="Senha atual"
              type="password"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nova senha"
              type="password"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirmar nova senha"
              type="password"
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSubmit}
              >
                Salvar Configurações
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;