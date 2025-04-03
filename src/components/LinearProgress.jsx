import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LinearTimer = ({ totalDuration, tempoRestante }) => {
  const progresso = ((totalDuration - tempoRestante) / totalDuration) * 100;

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      {/* Barra de progresso */}
      <LinearProgress variant="determinate" value={progresso} sx={{ height: 10 }} />

      {/* Texto do tempo restante */}
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        {`Tempo restante: ${tempoRestante}s`}
      </Typography>
    </Box>
  );
};

LinearTimer.propTypes = {
  totalDuration: PropTypes.number.isRequired,
  tempoRestante: PropTypes.number.isRequired,
};

export default LinearTimer;