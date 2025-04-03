import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  useTheme
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const theme = useTheme();

  // Dados de exemplo para os gráficos
  const activityData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Atividades Registradas',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: theme.palette.primary.main,
      }
    ]
  };

  const sensorTypesData = {
    labels: ['Temperatura', 'Nível Água', 'Movimento'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Relatórios de Monitoramento
      </Typography>
      
      <Grid container spacing={3}>
        {/* Gráfico de Atividades */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Atividades Mensais
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={activityData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de Tipos de Sensor */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Distribuição de Sensores
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie 
                data={sensorTypesData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Relatório Detalhado */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Relatório Detalhado
            </Typography>
            <Typography variant="body1" paragraph>
              Aqui você pode visualizar relatórios detalhados sobre o monitoramento dos jacarés.
            </Typography>
            <Typography variant="body1" paragraph>
              - Total de alertas no último mês: 15<br />
              - Sensores mais ativos: Lago Norte (8 registros/dia)<br />
              - Temperatura média: 28°C<br />
              - Nível de água estável em 85% dos sensores
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;