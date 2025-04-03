import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user: contextUser, logout } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: `240px` },
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
          Monitoramento de Jacarés
        </Typography>

        <IconButton color="inherit" sx={{ color: 'text.primary' }}>
          <NotificationsIcon />
        </IconButton>

        <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 2 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {contextUser?.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;