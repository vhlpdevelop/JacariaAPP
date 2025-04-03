import axios from 'axios';

const getAds = async (params) => {
    console.log(params)
    const object ={
        'username': params.username,
        'linkloginonly':params.linkLoginOnly,
        'linklogin': params.linkLogin,
        'dst': params.dst,
        'mac':params.mac,
        'ip':params.ip,
        'owner_id':params.hostname,
        'adType':params.adType,
    }
    console.log(object)
    try {
        const response = await axios.post('https://bonify-api-production.up.railway.app/hotspot/getAds', object)
        console.log(response)
        if (response.status === 200) {
            console.log('Propagandas buscadas!');
            return response.data; // Retorna os dados das propagandas
        } else {
            throw new Error('Erro ao buscar propagandas');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export default getAds