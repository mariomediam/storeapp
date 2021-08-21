import { useState, createContext, useEffect } from "react";
import { obtenerExistencia } from "../services/existenciaService";

export const CarritoContext = createContext()

const CarritoContextProvider = (props) => {

   

    const [carrito, setCarrito] = useState([])

    const [existencia, setExistencia] = useState([])

    const getExistencia = async () => {
        const existenciaTmp = await obtenerExistencia()		
        setExistencia(existenciaTmp)
    }
   

    const anadirACarrito = (producto) => {
       getExistencia()
        
        let almacen_origen = 0
        for(let i = 0; i < carrito.length; i++){
           

            if(carrito[i].prod_id === producto.prod_id){
                //significa que tenemos el producto ya dentro del carrito
                almacen_origen = obtenerAlmacenOrigen(carrito[i].prod_id, carrito[i].cantidad + 1)
                const productoExiste = {
                    ...carrito[i],
                    cantidad: carrito[i].cantidad + 1,
                    almacen_id_origen: almacen_origen
                }
                let carritoTmp = [...carrito] //como carrito es un estado, es inmutable, x eso tenemos una copia
                carritoTmp.splice(i, 1) //remuevo el producto que aumentará su cantidad
                carritoTmp.push(productoExiste) //vuelvo a agregar el producto pero con su cantidad actualizada
                setCarrito(carritoTmp) //actualizo el carrito con la copia actualizada
                return //corto la ejecución aquí
            }
        }
        almacen_origen = obtenerAlmacenOrigen(producto.prod_id,  1)
        setCarrito([...carrito, {...producto, cantidad:1, almacen_id_origen:almacen_origen}])
       
    }

    const obtenerAlmacenOrigen  = (parmProducto_id, parmCantidad) => {
        const almacen = existencia.filter(item => item.producto_id == parmProducto_id && item.existencia_stock >= parmCantidad)
        return almacen[0].almacen_id
        
    }

    useEffect(() => {
        getExistencia()
        const carritoStorage = JSON.parse(localStorage.getItem('carrito'))
        if(carritoStorage){
            setCarrito(carritoStorage)
        }
        
    },[])

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito))
    },[carrito])

    return (
        <CarritoContext.Provider value={{carrito, anadirACarrito}}>
            {props.children}
        </CarritoContext.Provider>
    )
}

export default CarritoContextProvider