import axios from "axios"

const URL = `${process.env.REACT_APP_API_TRACKING}/Distrito`

const obtenerDistritos = async(busqueda = "") => {
    try {
        let { data } = await axios.get(`${URL}`)        
        return data //ya tenemos los datos
    } catch (error) {
        throw error
    }
}

const obtenerDistritoPorId = async(id) => {
    try {
        let { data } = await axios.get(`${URL}/${id}`)
        return data //ya tenemos los datos
    } catch (error) {
        throw error
    } 
}

export{
    obtenerDistritoPorId,
    obtenerDistritos
}