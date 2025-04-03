import React, { useEffect, useState } from 'react';
import { 
  Bar, 
  Pie, 
  Line 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  useTheme, 
  useMediaQuery,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const SensorsDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { sensors: contextSensors } = useAuth();
  const [displaySensors, setDisplaySensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug inicial
  useEffect(() => {
    console.log('[DEBUG] Context Sensors:', {
      source: 'context',
      data: contextSensors,
      type: typeof contextSensors,
      isArray: Array.isArray(contextSensors),
      length: contextSensors?.length,
      sample: contextSensors?.[0]
    });
  }, []);

  // Sincronização dos dados
  useEffect(() => {
    const loadSensors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Tentar usar os dados do contexto
        if (contextSensors && contextSensors.length > 0) {
          console.log('[DEBUG] Usando sensores do contexto');
          setDisplaySensors(contextSensors);
          return;
        }

        // 2. Fallback para localStorage
        const stored = localStorage.getItem('sensors');
        if (stored) {
          console.log('[DEBUG] Fallback para localStorage');
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDisplaySensors(parsed);
            return;
          }
        }

        // 3. Fallback para API (exemplo)
        // const response = await axios.get('/api/sensors');
        // setDisplaySensors(response.data);

        setError('Nenhum dado de sensor disponível');
      } catch (err) {
        console.error('[ERROR] Falha ao carregar sensores:', err);
        setError('Erro ao carregar dados dos sensores');
      } finally {
        setLoading(false);
      }
    };

    loadSensors();
  }, [contextSensors]);

  // Preparar dados para gráficos
  const prepareChartData = () => {
    if (!displaySensors || displaySensors.length === 0) {
      return {
        typeData: { labels: [], datasets: [] },
        tempData: { labels: [], datasets: [] },
        levelData: { labels: [], datasets: [] }
      };
    }

    // Gráfico de tipos de sensores
    const typeCount = displaySensors.reduce((acc, sensor) => {
      const type = sensor.sensor_type || 'Desconhecido';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Gráfico de temperatura (últimos 5 sensores)
    const recentSensors = [...displaySensors]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    // Gráfico de nível de água
    const levelCount = {
      Cheio: displaySensors.filter(s => s.level === "0").length,
      Vazio: displaySensors.filter(s => s.level === "1").length
    };

    return {
      typeData: {
        labels: Object.keys(typeCount),
        datasets: [{
          label: 'Tipos de Sensor',
          data: Object.values(typeCount),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      tempData: {
        labels: recentSensors.map(s => s.id_sensor?.substring(0, 6) + '...'),
        datasets: [{
          label: 'Temperatura (°C)',
          data: recentSensors.map(s => {
            const temp = parseFloat(s.temp);
            return isNaN(temp) ? 0 : temp;
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      levelData: {
        labels: Object.keys(levelCount),
        datasets: [{
          label: 'Nível de Água',
          data: Object.values(levelCount),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderWidth: 1
        }]
      }
    };
  };

  const { typeData, tempData, levelData } = prepareChartData();

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        bodyFont: {
          size: isMobile ? 11 : 13
        }
      }
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Recarregar Página
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1, md: 3 },
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Gráfico de Tipos */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Distribuição por Tipo
              </Typography>
              <Box sx={{ height: 300 }}>
                {typeData.labels.length > 0 ? (
                  <Pie data={typeData} options={getChartOptions()} />
                ) : (
                  <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 8 }}>
                    Sem dados para exibir
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Temperatura */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Temperatura Recente
              </Typography>
              <Box sx={{ height: 300 }}>
                {tempData.labels.length > 0 ? (
                  <Bar data={tempData} options={getChartOptions()} />
                ) : (
                  <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 8 }}>
                    Sem dados para exibir
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Nível */}
        <Grid item xs={12} md={12} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Nível de Água
              </Typography>
              <Box sx={{ height: 300 }}>
                {levelData.labels.length > 0 ? (
                  <Pie data={levelData} options={getChartOptions()} />
                ) : (
                  <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 8 }}>
                    Sem dados para exibir
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela de Sensores */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Sensores Recentes
          </Typography>
          <TableContainer component={Paper}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell>ID Sensor</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Temperatura</TableCell>
                  <TableCell>Nível</TableCell>
                  <TableCell>Última Leitura</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displaySensors.length > 0 ? (
                  [...displaySensors]
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 5)
                    .map((sensor, index) => {
                      const isActive = (new Date() - new Date(sensor.updatedAt)) < 24 * 60 * 60 * 1000;
                      return (
                        <TableRow key={index}>
                          <TableCell>{sensor.id_sensor?.substring(0, 6)}...</TableCell>
                          <TableCell>{sensor.sensor_type || 'N/A'}</TableCell>
                          <TableCell>
                            {sensor.temp && sensor.temp !== "empty" ? `${sensor.temp}°C` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {sensor.level === "0" ? 'Cheio' : 
                             sensor.level === "1" ? 'Vazio' : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(sensor.updatedAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={isActive ? 'Ativo' : 'Inativo'}
                              color={isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum sensor encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SensorsDashboard;