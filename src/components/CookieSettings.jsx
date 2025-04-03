import React, { useState } from 'react';
import { Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CookieSettings = ({ onSave }) => {
  const [cookies, setCookies] = useState(JSON.parse(localStorage.getItem('cookieConsent')) || {
    essential: true,
    analytics: false,
    marketing: false,
  });

  const navigate = useNavigate(); // Hook para navegação

  const handleChange = (event) => {
    setCookies({
      ...cookies,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = () => {
    onSave({ ...cookies, essential: true }); // Força cookies essenciais
    navigate(-1);
  };

  return (
    <div>
      <Typography variant="h6">Configurações de Cookies</Typography>
      <FormControlLabel
        control={
          <FormControlLabel
            control={<Checkbox checked={true} disabled />}
            label="Cookies Essenciais (Obrigatórios)"
          />
        }
        label="Cookies Essenciais"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={cookies.analytics}
            onChange={(e) => setCookies({...cookies, analytics: e.target.checked})}
          />
        }
        label="Analíticos (Google Analytics)"
      />
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: '20px' }}>
        Salvar e Voltar
      </Button>
    </div>
  );
};

export default CookieSettings;