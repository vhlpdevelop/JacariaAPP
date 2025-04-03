import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Sensors as SensorsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: contextUser, logout } = useAuth();
  const [displayUser, setDisplayUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const drawerWidth = 240;

  // Sistema de fallback para os dados do usuário
  useEffect(() => {
    const loadUserData = () => {
      try {
        setLoading(true);
        
        // 1. Tentar usar os dados do contexto
        if (contextUser) {
          console.log('Usando usuário do contexto:', contextUser);
          setDisplayUser(contextUser);
          return;
        }

        // 2. Fallback para localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          console.log('Fallback para localStorage - usuário:', storedUser);
          const parsedUser = JSON.parse(storedUser);
          setDisplayUser(parsedUser);
          return;
        }

        // 3. Fallback mínimo
        setDisplayUser({
          name: 'Usuário',
          email: ''
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setDisplayUser({
          name: 'Usuário',
          email: ''
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [contextUser]);

  const menuItems = [
    { text: 'Início', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Monitoramento', icon: <SensorsIcon />, path: '/dashboard/monitoring' },
    { text: 'Relatórios', icon: <BarChartIcon />, path: '/dashboard/reports' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/dashboard/settings' }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        width: drawerWidth,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      component="nav"
      sx={{ 
        width: drawerWidth,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        position: 'fixed', // Fixa a sidebar na tela
        overflow: 'auto' // Permite rolagem se o conteúdo for muito longo
      }}
    >
      {/* Conteúdo principal (cabeçalho + menu) */}
      <Box sx={{ flex: '1 0 auto' }}>
        {/* Cabeçalho com informações do usuário */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 3,
          pt: 4
        }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mb: 2,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontSize: '1.5rem'
            }}
          >
            {displayUser?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="medium">
            {displayUser?.name || 'Usuário'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {displayUser?.email || ''}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Menu de navegação */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  },
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Botão de logout (fixo no final) */}
      <Box sx={{ 
        p: 2,
        position: 'sticky',
        bottom: 0,
        bgcolor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            sx={{
              borderRadius: 1,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.lighter'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Sair" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;