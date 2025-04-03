import axios from 'axios';
import getOrGenerateClientId from '../services/clientID'; 
const registryInteraction = async (params) => {
    // Recupera o UUID do localStorage
    var clientId = localStorage.getItem('clientId');

    if (!clientId) {
        await getOrGenerateClientId();
        clientId = localStorage.getItem('clientId');
    }

    // Adiciona o clientId aos parâmetros
    const payload = {
        ...params,
        clientId, // Inclui o UUID no payload
    };

    console.log("registryInteraction ->", payload);

    try {
        const response = await axios.post('https://bonify-api-production.up.railway.app/hotspot/registryInteraction', payload);
        console.log(response);
        if (response.status === 200) {
            console.log('Registro feito!');
            return response.data; // Retorna os dados das propagandas
        } else {
            throw new Error('Erro ao registrar');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export default registryInteraction;