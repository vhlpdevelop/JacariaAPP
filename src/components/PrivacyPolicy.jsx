import React from 'react';
import { Typography, Container, Box, Link, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Volta para a rota anterior
  };

  return (
    <Container>
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h4" gutterBottom>
          Política de Privacidade
        </Typography>
        <Typography variant="body1" paragraph>
          A sua privacidade é importante para nós. É política do nosso site respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site.
        </Typography>
        <Typography variant="body1" paragraph>
          Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
        </Typography>
        <Typography variant="body1" paragraph>
          Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
        </Typography>
        <Typography variant="body1" paragraph>
          Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
        </Typography>
        <Typography variant="body1" paragraph>
          O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
        </Typography>
        <Typography variant="body1" paragraph>
          Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
        </Typography>
        <Typography variant="body1" paragraph>
          O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto conosco.
        </Typography>
        <Typography variant="body1" paragraph>
          <Link href="/cookie-settings">Configurações de Cookies</Link>
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBack} sx={{ marginTop: '20px' }}>
          Voltar
        </Button>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;