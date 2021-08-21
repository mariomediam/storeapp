import axios from "axios"

const URL = `${process.env.REACT_APP_API}/Existencia`

const obtenerExistencia = async(busqueda = "") => {
    try {
        let { data } = await axios.get(`${URL}`)        
        return data //ya tenemos los datos
    } catch (error) {
        throw error
    }
}

/*
const obtenerDistritoPorId = async(id) => {
    try {
        let { data } = await axios.get(`${URL}/${id}`)
        return data //ya tenemos los datos
    } catch (error) {
        throw error
    } 
}
*/

export{
    obtenerExistencia    
}