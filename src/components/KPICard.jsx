import React from 'react';

const KPICard = ({ title, value, change }) => {
  // Determina a cor do texto da mudança com base no valor (positivo ou negativo)
  const changeColor = change.startsWith('+') ? '#4CAF50' : '#F44336';

  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.value}>{value}</p>
        <p style={{ ...styles.change, color: changeColor }}>
          {change}
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '200px',
    margin: '10px',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  value: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  change: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '0',
  },
};

export default KPICard;