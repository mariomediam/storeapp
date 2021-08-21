import axios from "axios"
import { crearPedidoProducto } from "./pedidoProductoService"
import { obtenerPlantillaRutaPorAlmDist } from "./plantillaRutas"
import { crearPedidoRuta } from "./pedidoRutaService"



const URL = `${process.env.REACT_APP_API}/Pedido`

const obtenerPedidos = async () => {
    try {
        let { data } = await axios.get(URL)
        return data
    } catch (error) {
        throw error
    }
}

const crearPedido = async (nuevoPedido, carrito) => {
    let pedidoProducto = {
        pedido_id:0,
        prod_id:0,
        prod_precio:0,
        prod_cantidad:0,
        almacen_id_origen:0
    }
    let pedidoRuta = {
        pedido_id:0,
        almacen_id_origen:0,
        ruta_paso_id:0,
        ruta_paso_desc:"",
        pedidoRuta_tiemEst:0,
        pedidoRuta_fecEst:new Date(),
        pedidoRuta_Recib:false,
        pedidoRuta_fecReal:new Date(),
        pedidoRuta_coment:"",
        ruta_pasoTipo:""
    }

    let almacenes_origen = []

    try {        
        const headers = {
            "Content-Type": "application/json"
        }
        let { data } = await axios.post(URL, nuevoPedido, { headers })
        for (let i=0; i<carrito.length; i++){        
            pedidoProducto = {
                pedido_id:data.pedido_id,
                prod_id:carrito[i].prod_id,
                prod_precio:carrito[i].prod_precio,
                prod_cantidad:carrito[i].cantidad,
                almacen_id_origen:carrito[i].almacen_id_origen
            }
            await crearPedidoProducto(pedidoProducto)

            if (!almacenes_origen.includes(carrito[i].almacen_id_origen)){
                almacenes_origen.push(carrito[i].almacen_id_origen)
            }
        
        };
        
        for (let i = 0; i < almacenes_origen.length; i++) {
            let misRutas = await obtenerPlantillaRutaPorAlmDist(almacenes_origen[i], nuevoPedido.distr_id_destino)
            let fecEstimada = nuevoPedido.pedido_fecha;                        

            for (let y=0; y < misRutas.length; y++){
                
                fecEstimada = new Date(fecEstimada.setDate(fecEstimada.getDate() + misRutas[y].ruta_TiempoEst));

                pedidoRuta = {
                    pedido_id:data.pedido_id,
                    almacen_id_origen:almacenes_origen[i],
                    ruta_paso_id:misRutas[y].ruta_paso_id,
                    ruta_paso_desc:misRutas[y].ruta_pasoDesc,
                    pedidoRuta_tiemEst:misRutas[y].ruta_TiempoEst,
                    pedidoRuta_fecEst:fecEstimada,
                    pedidoRuta_Recib:false,
                    pedidoRuta_fecReal:undefined,
                    pedidoRuta_coment:"",
                    ruta_pasoTipo:""
                }

                await crearPedidoRuta(pedidoRuta)
            }           
            
        }

        
        
        

        
        return data
    } catch (error) {
        throw error
    }
}

export{
    obtenerPedidos,
    crearPedido    
}