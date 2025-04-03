// clientService.js
import axios from 'axios';

const API_URL = 'https://bonify-api-production.up.railway.app/hotspot'; // URL da sua API

// Função para obter ou gerar o clientId
export const getOrGenerateClientId = async () => {
    // Verifica se já existe um clientId no localStorage
    let clientId = localStorage.getItem('clientId');

    if (!clientId) {
        // Se não existir, faz uma requisição à API para gerar um novo UUID
        try {
            const response = await axios.get(`${API_URL}/generateID`);
            clientId = response.data.clientId;

            // Armazena o novo clientId no localStorage
            localStorage.setItem('clientId', clientId);
        } catch (error) {
            console.error('Erro ao gerar clientId:', error);
            throw error;
        }
    }

    return clientId;
};
export default getOrGenerateClientId