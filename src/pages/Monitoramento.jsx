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
  CircularProgress
} from '@mui/material';
import {
  Public as MapIcon,
  Sensors as SensorIcon,
  Warning as AlertIcon,
  Refresh as RefreshIcon,
  Pets as AlligatorIcon,
  Water as WaterIcon,
  Thermostat as TempIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Monitoring = () => {
  const theme = useTheme();
  const { sensors: contextSensors } = useAuth();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('Todos');

  useEffect(() => {
    if (contextSensors && contextSensors.length > 0) {
      setSensors(contextSensors);
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

  const locations = ['Todos', 'Lago Norte', 'Lago Sul', 'Rio Principal', 'Pântano Leste'];
  const criticalSensors = sensors.filter(s => s.status === 'critical');
  const warningSensors = sensors.filter(s => s.status === 'warning');

  const getLocationSensors = (loc) => {
    if (loc === 'Todos') return sensors;
    return sensors.filter(s => s.location === loc);
  };

  const currentSensors = getLocationSensors(selectedLocation);

  return (
    <Box sx={{ 
      p: 3,
      ml: { sm: '240px' },       // Margem para a Sidebar
      mt: '64px',                // Margem para o Header
      width: { sm: 'calc(100% - 240px)' }, // Largura ajustada
      minHeight: 'calc(100vh - 64px)',     // Altura ajustada
      boxSizing: 'border-box'    // Garante que padding não some à largura
    }}>
      {/* Cabeçalho do Monitoramento */}
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

      {/* Cartões de Status */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.success.light, mr: 2 }}>
                  <AlligatorIcon />
                </Avatar>
                <Typography variant="h6">Jacarés Monitorados</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {sensors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Em {locations.length - 1} locais
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.warning.light, mr: 2 }}>
                  <AlertIcon />
                </Avatar>
                <Typography variant="h6">Alertas</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {warningSensors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {criticalSensors.length} críticos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.info.light, mr: 2 }}>
                  <WaterIcon />
                </Avatar>
                <Typography variant="h6">Nível de Água</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {sensors.filter(s => s.level === '0').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sensors.filter(s => s.level === '1').length} baixos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: theme.palette.error.light, mr: 2 }}>
                  <TempIcon />
                </Avatar>
                <Typography variant="h6">Temperatura</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {sensors.length > 0 ? 
                  Math.max(...sensors.map(s => parseFloat(s.temp) || 0)) + '°C' : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Máxima registrada
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mapa e Filtros */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Mapa de Localização
              </Typography>
              <Chip 
                icon={<MapIcon fontSize="small" />} 
                label="Visualização Satélite" 
                variant="outlined"
                clickable
              />
            </Box>
            
            {/* Placeholder do Mapa */}
            <Box sx={{ 
              bgcolor: theme.palette.grey[100], 
              height: '350px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 1
            }}>
              <Box textAlign="center">
                <MapIcon sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 1 }} />
                <Typography color="text.secondary">
                  Mapa de monitoramento será exibido aqui
                </Typography>
              </Box>
            </Box>
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
                />
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
              Sensores Ativos ({currentSensors.length})
            </Typography>
            
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
              {currentSensors.slice(0, 10).map((sensor, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1.5,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: sensor.status === 'critical' ? 
                    theme.palette.error.lighter : 
                    sensor.status === 'warning' ? 
                    theme.palette.warning.lighter : 
                    theme.palette.grey[50]
                }}>
                  <Avatar sx={{ 
                    bgcolor: sensor.status === 'critical' ? 
                      theme.palette.error.main : 
                      sensor.status === 'warning' ? 
                      theme.palette.warning.main : 
                      theme.palette.success.main,
                    mr: 2,
                    width: 32,
                    height: 32
                  }}>
                    <SensorIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {sensor.id_sensor?.substring(0, 8)}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sensor.location}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${sensor.temp}°C`} 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={sensor.level === '0' ? 'Água OK' : 'Água Baixa'} 
                    size="small" 
                    color={sensor.level === '0' ? 'success' : 'warning'}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Alertas Críticos */}
      {criticalSensors.length > 0 && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: theme.palette.error.lighter }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AlertIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" color="error">
              Alertas Críticos
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {criticalSensors.slice(0, 3).map((sensor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1,
                  bgcolor: theme.palette.background.paper
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Sensor: {sensor.id_sensor?.substring(0, 8)}...
                  </Typography>
                  <Typography variant="body2">
                    Local: {sensor.location}
                  </Typography>
                  <Typography variant="body2">
                    Temperatura: {sensor.temp}°C (Alerta!)
                  </Typography>
                  <Typography variant="body2">
                    Última leitura: {new Date(sensor.updatedAt).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Todos os Sensores */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
          Todos os Sensores ({sensors.length})
        </Typography>
        
        <Grid container spacing={2}>
          {sensors.slice(0, 12).map((sensor, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card elevation={1} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ 
                      bgcolor: sensor.status === 'critical' ? 
                        theme.palette.error.main : 
                        sensor.status === 'warning' ? 
                        theme.palette.warning.main : 
                        theme.palette.success.main,
                      mr: 2,
                      width: 32,
                      height: 32
                    }}>
                      <SensorIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle2">
                      {sensor.id_sensor?.substring(0, 6)}...
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <Box component="span" fontWeight="bold">Local:</Box> {sensor.location}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip 
                      icon={<TempIcon fontSize="small" />}
                      label={`${sensor.temp}°C`} 
                      size="small"
                    />
                    <Chip 
                      icon={<WaterIcon fontSize="small" />}
                      label={sensor.level === '0' ? 'Água OK' : 'Água Baixa'} 
                      size="small"
                      color={sensor.level === '0' ? 'success' : 'warning'}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Atualizado: {new Date(sensor.updatedAt).toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Monitoring;