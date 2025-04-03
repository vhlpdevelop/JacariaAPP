import axios from 'axios';

const deleteAds = async (params) => {
    console.log("delete ads service ===>")
    console.log(params)
    try {
        const response = await axios.delete('https://bonify-api-production.up.railway.app/user/deleteAds/'+params)
        console.log(response)
        if (response.status === 200) {
            console.log('Propaganda Deletada!');
            return response.data; // Retorna os dados das propagandas
        } else {
            throw new Error('Erro ao deletar propaganda');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export default deleteAds