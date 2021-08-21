import axios from "axios"


const URL = `${process.env.REACT_APP_API}/Pedido_Producto`

const obtenerPedidoProducto = async () => {
    try {
        let { data } = await axios.get(URL)
        return data
    } catch (error) {
        throw error
    }
}

const crearPedidoProducto = async (nuevoPedido) => {
    try {
        const headers = {
            "Content-Type": "application/json"
        }
        //.post(URL, DATA, HEADERS)
        let { data } = await axios.post(URL, nuevoPedido, { headers })
        return data
    } catch (error) {
        throw error
    }
}

export{
    obtenerPedidoProducto,
    crearPedidoProducto    
}