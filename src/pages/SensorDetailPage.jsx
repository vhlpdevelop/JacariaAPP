import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Button,
  Alert,
  AlertTitle
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import { DatePicker } from '@mui/x-date-pickers';
import { format, subDays, subHours } from 'date-fns';
import { ArrowBack } from '@mui/icons-material';

// Estilos com styled API
const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
}));

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ChartContainer = styled('div')(({ theme }) => ({
  height: '400px',
  marginTop: theme.spacing(3),
}));

const FilterSection = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const AlertItem = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SensorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('24h');
  const [startDate, setStartDate] = useState(subDays(new Date(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [sensorData, setSensorData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensorDetails = async () => {
      try {
        setLoading(true);
        // Simulação de chamada API - substitua pela sua implementação real
        const mockData = generateMockSensorData(id);
        setSensorData(mockData);
        setHistoryData(mockData.history);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados do sensor');
        setLoading(false);
      }
    };

    fetchSensorDetails();
  }, [id, startDate, endDate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    const now = new Date();
    switch (event.target.value) {
      case '1h':
        setStartDate(subHours(now, 1));
        break;
      case '24h':
        setStartDate(subDays(now, 1));
        break;
      case '7d':
        setStartDate(subDays(now, 7));
        break;
      case '30d':
        setStartDate(subDays(now, 30));
        break;
      default:
        break;
    }
    setEndDate(now);
  };

  const handleBackClick = () => {
    navigate('/dashboard/monitoring');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          {error}
        </Alert>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBackClick}
          >
            Voltar para Monitoramento
          </Button>
        </Box>
      </Container>
    );
  }

  if (!sensorData) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">
          <AlertTitle>Sensor não encontrado</AlertTitle>
          O sensor com ID {id} não foi encontrado no sistema.
        </Alert>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBackClick}
          >
            Voltar para Monitoramento
          </Button>
        </Box>
      </Container>
    );
  }

  // Configuração dos gráficos
  const tempChartData = {
    labels: historyData.map(entry => format(new Date(entry.createdAt), 'HH:mm')),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: historyData.map(entry => entry.temp !== 'empty' ? parseFloat(entry.temp) : null),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Horário'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valor'
        }
      }
    }
  };

  return (
    <Root >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">
          {sensorData.sensor_type === 'incubadora' ? 'Incubadora' : 'Baia'} - {sensorData.location}
          <Chip 
            label={sensorData.level !== 'empty' ? sensorData.level : 'Sem alertas'}
            color={getAlertLevelColor(sensorData.level)}
            sx={{ ml: 1 }}
          />
        </Typography>
      </Box>
      
      <PaperStyled>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Visão Geral" />
          <Tab label="Métricas" />
          <Tab label="Ativações" />
          <Tab label="Histórico" />
        </Tabs>
        <Divider />
        
        <Box mt={3}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informações Básicas
                </Typography>
                <Typography variant="body1"><strong>ID do Sensor:</strong> {sensorData.id_sensor}</Typography>
                <Typography variant="body1"><strong>Tipo:</strong> {sensorData.sensor_type === 'incubadora' ? 'Incubadora' : 'Baia'}</Typography>
                <Typography variant="body1"><strong>Localização:</strong> {sensorData.location}</Typography>
                <Typography variant="body1"><strong>Última atualização:</strong> {format(new Date(sensorData.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Status Atual
                </Typography>
                {sensorData.message !== 'empty' && (
                  <AlertItem severity={getAlertLevelSeverity(sensorData.level)}>
                    <AlertTitle>{sensorData.level !== 'empty' ? sensorData.level.toUpperCase() : 'ALERTA'}</AlertTitle>
                    {sensorData.message}
                  </AlertItem>
                )}
              </Grid>
            </Grid>
          )}
          
          {tabValue === 1 && (
            <div>
              <FilterSection>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Período</InputLabel>
                      <Select
                        value={timeRange}
                        label="Período"
                        onChange={handleTimeRangeChange}
                      >
                        <MenuItem value="1h">Última hora</MenuItem>
                        <MenuItem value="24h">Últimas 24 horas</MenuItem>
                        <MenuItem value="7d">Últimos 7 dias</MenuItem>
                        <MenuItem value="30d">Últimos 30 dias</MenuItem>
                        <MenuItem value="custom">Personalizado</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {timeRange === 'custom' && (
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        label="Data inicial"
                        value={startDate}
                        onChange={setStartDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                  )}
                </Grid>
              </FilterSection>

              {sensorData.temp !== 'empty' && (
                <ChartContainer>
                  <Typography variant="h6" gutterBottom>
                    Variação de Temperatura
                  </Typography>
                  <Line data={tempChartData} options={chartOptions} />
                </ChartContainer>
              )}
            </div>
          )}
        </Box>
      </PaperStyled>
    </Root>
  );
};

// Funções auxiliares
const getAlertLevelColor = (level) => {
  switch (level) {
    case 'critical': return 'error';
    case 'warning': return 'warning';
    case 'info': return 'info';
    default: return 'default';
  }
};

const getAlertLevelSeverity = (level) => {
  switch (level) {
    case 'critical': return 'error';
    case 'warning': return 'warning';
    case 'info': return 'info';
    default: return 'success';
  }
};

// Função para gerar dados mockados (substitua pela sua API real)
const generateMockSensorData = (id) => {
  const now = new Date();
  const history = [];
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - (24 - i));
    
    history.push({
      id_sensor: id,
      createdAt: timestamp,
      temp: (25 + Math.sin(i / 2) * 5 + Math.random()).toFixed(1),
      humidity: (60 + Math.cos(i / 3) * 10 + Math.random() * 5).toFixed(1),
      amony: (Math.random() * 10).toFixed(2),
      pressure: (1013 + Math.random() * 5).toFixed(1),
      message: i % 5 === 0 ? 'Leitura normal' : 'empty',
      level: i % 5 === 0 ? (i % 10 === 0 ? 'warning' : 'info') : 'empty'
    });
  }
  
  return {
    id_sensor: id,
    sensor_type: Math.random() > 0.5 ? 'incubadora' : 'baia',
    location: `Setor ${Math.floor(Math.random() * 10) + 1}`,
    message: history[23].message,
    level: history[23].level,
    temp: history[23].temp,
    amony: history[23].amony,
    pressure: history[23].pressure,
    activations: Math.floor(Math.random() * 10).toString(),
    humidity: history[23].humidity,
    createdAt: subDays(now, 30),
    updatedAt: now,
    history
  };
};

export default SensorDetailPage;