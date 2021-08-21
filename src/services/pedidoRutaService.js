import axios from "axios"

const URL = `${process.env.REACT_APP_API_TRACKING}/Pedido_Ruta`

const obtenerPedidoRuta = async(busqueda = "") => {
    try {
        let { data } = await axios.get(`${URL}?search=${busqueda}`)
        return data //ya tenemos los datos
    } catch (error) {
        throw error
    }
}

const obtenerPedidoRutaPorId = async(id) => {
    try {
        let { data } = await axios.get(`${URL}/${id}`)
        return data //ya tenemos los datos
    } catch (error) {
        throw error
    } 
}

const crearPedidoRuta = async (nuevoPedidoRuta) => {
   
    try {        
        const headers = {
            "Content-Type": "application/json"
        }
        let { data } = await axios.post(URL, nuevoPedidoRuta, { headers })              
        
        return data
    } catch (error) {
        throw error
    }
}

export{
    obtenerPedidoRuta,
    obtenerPedidoRutaPorId,
    crearPedidoRuta
}