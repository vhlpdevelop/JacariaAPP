import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, sensors } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - mantém position: fixed */}
      <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Conteúdo abaixo do Header */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: '64px', // Ajuste para o Header fixo
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

const drawerWidth = 240;

export default Dashboard;