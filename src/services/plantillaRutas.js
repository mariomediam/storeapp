import axios from "axios"

const URL = `${process.env.REACT_APP_API_TRACKING}/Plantilla_Ruta`

const obtenerPlantillaRuta = async () => {
    try {
        let { data } = await axios.get(URL)
        return data
    } catch (error) {
        throw error
    }
}

const obtenerPlantillaRutaPorId = async(id) => {
    try {
        let { data } = await axios.get(`${URL}/${id}`)
        return data //ya tenemos los datos
    } catch (error) {
        throw error
    } 
}

const obtenerPlantillaRutaPorAlmDist = async(parmAlmacen_id, parmDistrito_id) => {
    try {
        
        let { data } = await axios.get(URL)
        
        return data.filter(item => item.almacen_id == parmAlmacen_id && item.distr_id_destino == parmDistrito_id)
    } catch (error) {
        throw error
    } 
}


export{
    obtenerPlantillaRuta,
    obtenerPlantillaRutaPorId,
    obtenerPlantillaRutaPorAlmDist   
}