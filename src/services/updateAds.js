import axios from 'axios';

const updateAds = async (params) => {
    console.log("Update ads service ===>")
    console.log(params)
    try {
        const response = await axios.post('https://bonify-api-production.up.railway.app/user/updateAds', params)
        console.log(response)
        if (response.status === 200) {
            console.log('Propaganda Atualizada!');
            return response.data; // Retorna os dados das propagandas
        } else {
            throw new Error('Erro ao atualizar propaganda');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export default updateAds