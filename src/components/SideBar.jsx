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
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer
} from '@mui/material';
import {
  Home as HomeIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Sensors as SensorsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: contextUser, logout, userRoutes } = useAuth();
  const [displayUser, setDisplayUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Função para mapear strings de ícones para componentes
  const getIconComponent = (iconName) => {
    const iconMap = {
      HomeIcon: <HomeIcon />,
      SensorsIcon: <SensorsIcon />,
      BarChartIcon: <BarChartIcon />,
      SettingsIcon: <SettingsIcon />,
      LogoutIcon: <LogoutIcon />
    };
    return iconMap[iconName] || <HomeIcon />; // Ícone padrão caso o nome não seja encontrado
  };

  // Sistema de fallback para os dados do usuário
  useEffect(() => {
    const loadUserData = () => {
      try {
        setLoading(true);
        
        if (contextUser) {
          setDisplayUser(contextUser);
          return;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setDisplayUser(parsedUser);
          return;
        }

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

  const drawerContent = (
    <>
      <Box sx={{ flex: '1 0 auto' }}>
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

        <List>
          {userRoutes.map((route) => (
            <ListItem key={route.name} disablePadding>
              <ListItemButton 
                onClick={() => {
                  navigate(route.path);
                  if (isMobile) setMobileOpen(false);
                }}
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
                  {getIconComponent(route.icon)}
                </ListItemIcon>
                <ListItemText 
                  primary={route.name} 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

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
    </>
  );

  return (
    <>
      {/* Botão de menu para mobile */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            mt: 4,
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar para desktop - versão original que acompanha o scroll */}
      {!isMobile && (
        <Box 
          component="nav"
          sx={{ 
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            height: '100vh',
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            position: 'fixed',
            overflow: 'auto'
          }}
        >
          {drawerContent}
        </Box>
      )}

      {/* Drawer para mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;