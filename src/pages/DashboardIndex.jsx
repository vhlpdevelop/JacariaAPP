import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import SSDashboard from '../components/SSDashboard';
import { useAuth } from '../contexts/AuthContext';

const DashboardIndex = () => {
  const { sensors: contextSensors } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contextSensors) {
      setLoading(false);
    }
  }, [contextSensors]);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sensores
        </Typography>
        
        {loading ? (
          <Typography>Carregando dados...</Typography>
        ) : contextSensors?.length > 0 ? (
          <SSDashboard />
        ) : (
          <Typography>Nenhum dado de sensor encontrado.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardIndex;