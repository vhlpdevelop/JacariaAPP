import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import {
  Warning as AlertIcon,
  Refresh as RefreshIcon,
  Pets as AlligatorIcon,
  Egg as IncubatorIcon,
  Thermostat as TempIcon,
  Close as CloseIcon,
  Air as HumidityIcon,
  LocalAtm as PressureIcon,
  Sensors as SensorIcon,
  Water as WaterIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Monitoring = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { sensors: contextSensors } = useAuth();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('Todos');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (contextSensors && contextSensors.length > 0) {
      const uniqueSensors = contextSensors.filter((sensor, index, self) =>
        index === self.findIndex((s) => s.id_sensor === sensor.id_sensor)
      );
      setSensors(uniqueSensors);
      setLoading(false);
    }
  }, [contextSensors]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  const locations = ['Todos', 'Baias', 'Incubadora'];
  const criticalSensors = sensors.filter(s => s.status === 'critical');
  const warningSensors = sensors.filter(s => s.status === 'warning');

  const sensorComMaisAlertas = sensors.length > 0 ? 
    sensors.reduce((prev, current) => 
      (parseInt(prev.activations || 0) > parseInt(current.activations || 0)) ? prev : current
    ) : null;

  const sensorTemperaturaMaxima = sensors.length > 0 ? 
    sensors.reduce((prev, current) => 
      (parseFloat(prev.temp || 0) > parseFloat(current.temp || 0)) ? prev : current
    ) : null;

  const getLocationSensors = (loc) => {
    if (loc === 'Todos') return sensors;
    if (loc === 'Baias') return sensors.filter(s => s.sensor_type === 'baia');
    if (loc === 'Incubadora') return sensors.filter(s => s.sensor_type === 'incubadora');
    return sensors;
  };

  const currentSensors = getLocationSensors(selectedLocation);

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
    setOpenDialog(true);
  };

  const handleManageSensor = () => {
    if (selectedSensor) {
      navigate(`/dashboard/sensor/${selectedSensor.id_sensor}`);
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const renderSensorValue = (value) => {
    return value && value !== 'empty' ? value : 'N/A';
  };

  const renderSensorMap = () => {
    const sensorsToShow = getLocationSensors(selectedLocation);
    
    return (
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(24px, 1fr))',
        gap: '4px',
        p: 2,
        overflow: 'auto',
        maxHeight: '350px'
      }}>
        {sensorsToShow.map((sensor) => (
          <Tooltip 
            key={sensor.id_sensor} 
            title={`${sensor.id_sensor} - ${sensor.sensor_type === 'incubadora' ? 'Incubadora' : 'Baia'}`}
            arrow
          >
            <Box
              onClick={() => handleSensorClick(sensor)}
              sx={{
                width: 24,
                height: 24,
                bgcolor: sensor.sensor_type === 'incubadora' ? 
                  theme.palette.secondary.main : 
                  theme.palette.success.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 'bold',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                  boxShadow: 2
                }
              }}
            >
              {sensor.id_sensor.substring(sensor.id_sensor.length - 2)}
            </Box>
          </Tooltip>
        ))}
      </Box>
    );
  };

  const baiaSensors = sensors.filter(s => s.sensor_type === 'baia');
  const incubadoraSensors = sensors.filter(s => s.sensor_type === 'incubadora');
  const totalBaias = 130;

  return (
    <Box sx={{ 
      p: 3,
      ml: { sm: '12px' },
      mt: '12px',
      width: { sm: 'calc(100% - 12px)' },
      minHeight: 'calc(100vh - 12px)',
      boxSizing: 'border-box'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Monitoramento em Tempo Real
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Atualizar dados">
            <IconButton 
              onClick={refreshData} 
              color="primary" 
              disabled={loading}
              sx={{ ml: 'auto' }}
            >
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.success.light, mr: 2 }}>
                  <AlligatorIcon />
                </Avatar>
                <Typography variant="h6">Baias Monitoradas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {baiaSensors.length}/{totalBaias}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((baiaSensors.length / totalBaias) * 100).toFixed(1)}% cobertura
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                  <IncubatorIcon />
                </Avatar>
                <Typography variant="h6">Incubadora</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {incubadoraSensors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sensores ativos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              cursor: sensorComMaisAlertas ? 'pointer' : 'default',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: sensorComMaisAlertas ? 'translateY(-4px)' : 'none'
              }
            }}
            onClick={() => sensorComMaisAlertas && handleSensorClick(sensorComMaisAlertas)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.warning.light, mr: 2 }}>
                  <AlertIcon />
                </Avatar>
                <Typography variant="h6">Alertas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {warningSensors.length + criticalSensors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sensorComMaisAlertas ? (
                  <>
                    Sensor: {sensorComMaisAlertas.id_sensor.substring(0, 6)}...
                    ({renderSensorValue(sensorComMaisAlertas.activations)} alertas)
                  </>
                ) : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              cursor: sensorTemperaturaMaxima ? 'pointer' : 'default',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: sensorTemperaturaMaxima ? 'translateY(-4px)' : 'none'
              }
            }}
            onClick={() => sensorTemperaturaMaxima && handleSensorClick(sensorTemperaturaMaxima)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.error.light, mr: 2 }}>
                  <TempIcon />
                </Avatar>
                <Typography variant="h6">Temperatura</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {sensorTemperaturaMaxima ? 
                  `${renderSensorValue(sensorTemperaturaMaxima.temp)}°C` : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sensorTemperaturaMaxima ? (
                  <>
                    Sensor: {sensorTemperaturaMaxima.id_sensor.substring(0, 6)}...
                  </>
                ) : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Mapa de Sensores ({currentSensors.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label="Baias" 
                  size="small"
                  sx={{ 
                    bgcolor: theme.palette.success.main, 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <Chip 
                  label="Incubadora" 
                  size="small"
                  sx={{ 
                    bgcolor: theme.palette.secondary.main, 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>
            
            {currentSensors.length > 0 ? (
              renderSensorMap()
            ) : (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: theme.palette.text.secondary
              }}>
                <Typography>Nenhum sensor encontrado para esta localização</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
              Filtrar por Localização
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {locations.map(location => (
                <Chip
                  key={location}
                  label={location}
                  onClick={() => setSelectedLocation(location)}
                  color={selectedLocation === location ? 'primary' : 'default'}
                  variant={selectedLocation === location ? 'filled' : 'outlined'}
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
              Sensores Ativos ({currentSensors.length})
            </Typography>
            
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
              {currentSensors.length > 0 ? (
                currentSensors.slice(0, 10).map((sensor) => (
                  <Box 
                    key={sensor.id_sensor}
                    onClick={() => handleSensorClick(sensor)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1.5,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: sensor.status === 'critical' ? 
                        theme.palette.error.lighter : 
                        sensor.status === 'warning' ? 
                        theme.palette.warning.lighter : 
                        theme.palette.grey[50],
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: sensor.status === 'critical' ? 
                          theme.palette.error.light : 
                          sensor.status === 'warning' ? 
                          theme.palette.warning.light : 
                          theme.palette.grey[200],
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: sensor.sensor_type === 'incubadora' ? 
                        theme.palette.secondary.main : 
                        theme.palette.success.main,
                      mr: 2,
                      width: 32,
                      height: 32
                    }}>
                      {sensor.sensor_type === 'incubadora' ? 
                        <IncubatorIcon fontSize="small" /> : 
                        <SensorIcon fontSize="small" />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {sensor.id_sensor.substring(0, 8)}...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sensor.sensor_type === 'incubadora' ? 'Incubadora' : `Baia ${sensor.location}`}
                      </Typography>
                    </Box>
                    {sensor.temp && sensor.temp !== 'empty' && (
                      <Chip 
                        label={`${sensor.temp}°C`} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                    )}
                    {sensor.level && sensor.level !== 'empty' && (
                      <Chip 
                        label={sensor.level === '0' ? 'Água OK' : 'Água Baixa'} 
                        size="small" 
                        color={sensor.level === '0' ? 'success' : 'warning'}
                      />
                    )}
                  </Box>
                ))
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: theme.palette.text.secondary
                }}>
                  <Typography>Nenhum sensor encontrado</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              bgcolor: selectedSensor?.sensor_type === 'incubadora' ? 
                theme.palette.secondary.main : 
                theme.palette.success.main,
              mr: 2
            }}>
              {selectedSensor?.sensor_type === 'incubadora' ? 
                <IncubatorIcon /> : 
                <SensorIcon />}
            </Avatar>
            Detalhes do Sensor
          </Box>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSensor && (
            <>
              <DialogContentText gutterBottom>
                <strong>ID:</strong> {selectedSensor.id_sensor}
              </DialogContentText>
              <DialogContentText gutterBottom>
                <strong>Tipo:</strong> {selectedSensor.sensor_type === 'incubadora' ? 'Incubadora' : 'Baia'}
              </DialogContentText>
              <DialogContentText gutterBottom>
                <strong>Localização:</strong> {selectedSensor.location}
              </DialogContentText>
              <DialogContentText gutterBottom>
                <strong>Status:</strong> 
                <Chip 
                  label={selectedSensor.status === 'critical' ? 'Crítico' : 
                         selectedSensor.status === 'warning' ? 'Alerta' : 'Normal'} 
                  size="small"
                  color={selectedSensor.status === 'critical' ? 'error' : 
                         selectedSensor.status === 'warning' ? 'warning' : 'success'}
                  sx={{ ml: 1 }}
                />
              </DialogContentText>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                {selectedSensor.temp && selectedSensor.temp !== 'empty' && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TempIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Temperatura:</strong> {selectedSensor.temp}°C
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {selectedSensor.humidity && selectedSensor.humidity !== 'empty' && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HumidityIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Umidade:</strong> {selectedSensor.humidity}%
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {selectedSensor.level && selectedSensor.level !== 'empty' && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WaterIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Nível de Água:</strong> 
                        <Chip 
                          label={selectedSensor.level === '0' ? 'OK' : 'Baixo'} 
                          size="small"
                          color={selectedSensor.level === '0' ? 'success' : 'warning'}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {selectedSensor.pressure && selectedSensor.pressure !== 'empty' && (
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PressureIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Pressão:</strong> {selectedSensor.pressure}hPa
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              {selectedSensor.amony && selectedSensor.amony !== 'empty' && (
                <Typography variant="body1" gutterBottom>
                  <strong>Amônia:</strong> {selectedSensor.amony}
                </Typography>
              )}
              {selectedSensor.activations && selectedSensor.activations !== 'empty' && (
                <Typography variant="body1" gutterBottom>
                  <strong>Ativações:</strong> {selectedSensor.activations}
                </Typography>
              )}
              {selectedSensor.message && selectedSensor.message !== 'empty' && (
                <Typography variant="body1" gutterBottom>
                  <strong>Mensagem:</strong> {selectedSensor.message}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="caption" display="block" color="text.secondary">
                <strong>Criado em:</strong> {new Date(selectedSensor.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                <strong>Última atualização:</strong> {new Date(selectedSensor.updatedAt).toLocaleString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
          <Button 
            onClick={handleManageSensor}
            color="primary"
            variant="contained"
          >
            Gerenciar Sensor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Monitoring;