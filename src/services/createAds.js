import axios from 'axios';

const createAds = async (params) => {
    console.log("Create ads service ===>")
    console.log(params)
    try {
        const response = await axios.post('https://bonify-api-production.up.railway.app/user/createAds', params)
        console.log(response)
        if (response.status === 201) {
            console.log('Propaganda Criada!');
            return response.data; // Retorna os dados das propagandas
        } else {
            throw new Error('Erro ao criar propaganda');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export default createAds