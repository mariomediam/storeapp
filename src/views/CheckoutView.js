import { useState, useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap} from "react-leaflet"
import { useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import L from "leaflet" 
import { generate } from "generate-password";

import { CarritoContext } from "../context/carritoContext";
import { AuthContext } from "../context/authContext";
import { obtenerDistritos } from "../services/distritoService";
import { crearPedido } from "../services/pedidoService";
import Loading from '../components/Loading'

export default function CheckoutView() {
    const [marcador, setMarcador] = useState([-12.0433, -77.0283])
	const [cargando, setCargando] = useState(false)
	//const [distritos, setDistritos] = useState([])
	const [distritosOriginal, setDistritosOriginal] = useState([])
	const [departamentos, setDepartamentos] = useState([])
	const [provincias, setProvincias] = useState([])
	const [distritos, setDistritos] = useState([])
	const [geoDistrito, setGeoDistrito] = useState([-16.4040105,-71.556521])
	const [pedido, setPedido] = useState({
        pedido_token:"TOKEN",
        pedido_fecha:1629044187,
        pedido_cliente:"CLIENTE",
        distr_id_destino:0,
        pedido_direccion:"DIRECCION",
		pedido_dirgeo:[-12.0433, -77.0283],
		pedido_email:"EMAIL",
		pedido_telefono:"TELEFONO"
    })
	

	const { carrito } = useContext(CarritoContext);
	const { userState, signOut } = useContext(AuthContext);

	const selectDpto = useRef()
	const selectProv = useRef()
	const selectDist = useRef()
	
	
	const getDistritos = async () => {
        try {
            const distritosObtenidos = await obtenerDistritos()
            setDistritosOriginal(distritosObtenidos)
			obtenerDepartamentos(distritosObtenidos)			
        } catch (error) {
            console.error(error)
        }
    }
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

    const AgregarMarcador = () => {
        const map = useMapEvents({
            click: (e) => {
                //console.log(e)
                const {lat, lng} = e.latlng
                setMarcador([lat, lng])
            }
        })
        return null
    }

	const LocationMarker = () => {
		
		const map = useMap()
		try {
			//map.flyTo(geoDistrito, map.getZoom())
			map.setView(geoDistrito, 16)
		} catch (error) {
			//console.log(error)
		}

  		return null

	}

	let total = 0;

	total = carrito.reduce((acum, item) => {
		return acum + item.cantidad * item.prod_precio;
	}, 0);

	const recibirSubmit = async (datos) => {
		//console.log("recibir submit")
		try {			
			
			const newDate = new Date()
			const token = generate({
				length: 6,
				numbers: true
			});

			const pedidoTmp = {
				pedido_token:token,
				pedido_fecha: newDate,
				pedido_cliente:datos.nombreCompleto,
				distr_id_destino:selectDist.current.value,
				pedido_direccion:datos.direccion,
				pedido_dirgeo:geoDistrito,
				pedido_email:datos.email,
				pedido_telefono:datos.telefono
			}

			

			//const pedidoGenerado = await crearPedido(pedidoTmp, carrito)

	
			const pedidoGenerado = await crearPedido(pedidoTmp, carrito)
		
			await Swal.fire({
                icon:'success',
                title:`Pedido registrado`,
				text: `Podrá hacer seguimiento del mismo con el código ${pedidoGenerado["pedidoToken"]}`,
                showConfirmButton:true                
            })

			// await Swal.fire({
            //     icon:'success',
            //     title:`Pedido registrado`,
			// 	text: `Podrá hacer seguimiento del mismo con el código ${token}`,
            //     showConfirmButton:true                
            // })

		} catch (error) {
			
			await Swal.fire({
                icon:'error',
                title:`Error`,
				text: error,
                showConfirmButton:true                
            })
		}

		


	};



	const obtenerDepartamentos = (distritos) => {		
		let departamentosTmp = []
		distritos.forEach((dist, i) => {
		
			if (departamentosTmp.includes(dist.dpto_nombre)===false) {
				departamentosTmp.push(dist.dpto_nombre)
			}
		})		
		setDepartamentos(departamentosTmp)		
	}

	const obtenerProvincias = () => {	
		if (selectDpto.current !== undefined){
			
			let provinciasTmp = []
			distritosOriginal.forEach((dist, i) => {
				if (dist.dpto_nombre === selectDpto.current.value){
					if (provinciasTmp.includes(dist.prov_nombre) === false){
						provinciasTmp.push(dist.prov_nombre)
					}
				}
	
			})
			setProvincias(provinciasTmp)	
		}
		
			
	}

	const obtenerCboDistritos= () => {	
		let distritosTmp = []
		distritosOriginal.forEach((dist, i) => {
			if (dist.dpto_nombre === selectDpto.current.value && dist.prov_nombre === selectProv.current.value){
				if (distritosTmp.includes(dist.distr_nombre) === false){
					distritosTmp.push({distr_id: dist.distr_id,distr_nombre:dist.distr_nombre})
				}
			}

		})
		setDistritos(distritosTmp)			
	}

	const obtenerGeoDistrito = () => {
		let geoDistritoTmp = []
		distritosOriginal.every((dist, i) => {
			if (dist.distr_id === selectDist.current.value ){
				geoDistritoTmp = dist.distri_geo				
				return false
			}
			
			return true

		})
		setGeoDistrito(geoDistritoTmp)
	}

	

	
	useEffect(() => {
        
		getDistritos()		
    }, [])

	useEffect(() => {
        
		obtenerProvincias()		
    }, [departamentos])

	useEffect(() => {
        
		obtenerCboDistritos()		
    }, [provincias])

	useEffect(() => {
        
		obtenerGeoDistrito()
    }, [distritos])


	

	return (
		//*********************************** */
		<div>
			{cargando ? 
			(<Loading />) : 
			(<div className="container mt-4">
				<h1>Verificar Compra</h1>
				<p>Por favor verifique los productos e indique los datos solicitados</p>
				<div className="row">
					<div className="col-sm-12 col-md-6">
						<h4>Productos en CarritoView</h4>
						<ul className="list-group">
							{carrito.map((prod, i) => (
								<li
									className="list-group-item d-flex justify-content-between"
									key={i}
								>
									<div>
										<span className="fw-bold">{prod.prod_nombre}</span>
										<br />
										<small>Cantidad: {prod.cantidad}</small>
									</div>

									<small className="badge bg-dark rounded-pill p-3">
										S/ {prod.cantidad * prod.prod_precio}
									</small>
								</li>
							))}
							{total !== 0 ? (
								<li className="list-group-item d-flex justify-content-between">
									<span className="fw-bold">TOTAL:</span>
									<span>S/ {total}</span>
								</li>
							) : (
								<li className="list-group-item">
									Todavía no ha agregado ningún producto.
								</li>
							)}
						</ul>
					</div>

					<div className="col-sm-12 col-md-6">
						<h4>Ingrese sus datos:</h4>

						<form onSubmit={handleSubmit(recibirSubmit)}>
							<div className="mb-2">
								<label className="form-label">Nombres y apellidos</label>
								<input
									type="text"
									className="form-control"
									placeholder="Ej. Juan Perez"
									value = {userState.displayName}
									//{...register("nombre", {validaciones})}
									{...register("nombreCompleto", { required: true })}
								/>
								{errors.nombreCompleto && (
									<small className="text-danger">Este campo es obligatorio</small>
								)}
							</div>


							<div className="mb-2">
								<label className="form-label">Correo electrónico</label>
								<input
									type="text"
									className="form-control"
									placeholder="Ej. micuenta@correo.com"	
									value = {userState.email}
									{...register("email", {
										required: true,
										pattern: {
										value: /\S+@\S+\.\S+/,
										message: "Ingrese un correo electrónivo válido"
										}
									})}							
								/>
								{errors.email && (
									<small className="text-danger">{errors.email.message}</small>
								)}							
							</div>



							<div className="mb-2">
								<label className="form-label">Telefono</label>
								<input
									type="text"
									className="form-control"
									placeholder="Ej. +51 926707653"
									{...register("telefono", {
										required: false
									})}
								
								/>
								
							</div>

							<div className="mb-2">
								<label className="form-label">Departamento</label>
								<select 
									className="form-select" 
									aria-label="selectDpto"  
									ref={selectDpto} 
									onChange={obtenerProvincias}
									
								>
									{departamentos.map((departamento, i) => (
										<option key={i}>{departamento}</option>
									))}								
								</select>
							</div>

							<div className="mb-2">
								<label className="form-label">Provincia</label>
								<select className="form-select" aria-label="selectProv" ref={selectProv} onChange={obtenerCboDistritos}>
									{provincias.map((provincia, i) => (
										<option key={i}>{provincia}</option>
									))}								
								</select>
							</div>

							<div className="mb-2">
								<label className="form-label">Distrito</label>
								<select className="form-select" aria-label="selectDist" ref={selectDist} onChange={obtenerGeoDistrito}>
									{distritos.map((distrito, i) => (
										<option value={distrito.distr_id} key={i}>{distrito.distr_nombre}</option>
									))}								
								</select>
							</div>

							<div className="mb-2">
								<label className="form-label">Dirección</label>
								<input
									type="text"
									className="form-control"
									placeholder="Ej. Urb. Yanahuara S/N"
									{...register("direccion")}
								/>								
							</div>

							<MapContainer   
								center={geoDistrito}
								zoom={16}
								style={{height:"400px"}}
								
								
							>
								<TileLayer
									attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								
								<LocationMarker />
								
								
								<AgregarMarcador />
								<Marker
									position={marcador}
								/>
								
							</MapContainer>
							<button type="submit" className="btn btn-dark">
								Confirmar Compra
							</button>
							
						</form>
					</div>
				</div>
			</div>)}


		</div>
			);
}
