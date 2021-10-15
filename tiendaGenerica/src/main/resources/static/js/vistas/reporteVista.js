import * as UsuarioCtrl from "../api/usuarioApi.js";
import * as ClienteCtrl from "../api/clienteApi.js";
import * as ProveedorCtrl from "../api/proveedorApi.js";
import * as ProductoCtrl from "../api/productoApi.js";
import * as VentaCtrl from "../api/ventaApi.js";

import { infoColorClass } from "../main.js";
//====================================================    
//selectores para sub navegacion

let selReporte = "#vistaReporte";

let selVistaListarUsuarios = "#vistaListarUsuarios";
let selVistaListarClientes = "#vistaListarClientes";
let selVistaListarVentaClientes = "#vistaListarVentasClientes";
let selVistaListarProveedores = "#vistaListarProveedores";
let selVistaListarProductos = "#vistaListarProductos";
let selVistaListarVentas = "#vistaListarVentas";

//selector informativo general para la consulta
let selInfoConsulta = "#infoReporte";

//selectores de eventos en general
let selEventNavA = `${selReporte} nav a`;

//====================================================  
/** 
 * oculta todas las tablas y muestra la tabla seleccionada
 * @param selListaPor el selector del contenedor 
 * de tabla a mostrar
*/
function renderizarVistaTabla(selListaPor = "") {
	ocultarVistasTablas();
	$(selListaPor).show();
	return;
}

/** 
 * oculta todas las tablas
 * 
*/
function ocultarVistasTablas() {
	$(selVistaListarUsuarios).hide();
	$(selVistaListarClientes).hide();
	$(selVistaListarVentaClientes).hide();
	$(selVistaListarProveedores).hide();
	$(selVistaListarProductos).hide();
	$(selVistaListarVentas).hide();
}

//====================================================
/** 
 * permite generar tabla de acuerdo a la 
 * seleccion del usuarios
 * @param datos los tados a mostrar
 * @param selListaPor el selector del contenedor 
 * de la tabla a renderizar (visualizar)
*/
function crearTabla(datos = [], selListaPor = "") {
	
	const fi = "<tr>";
	const fc = "</tr>";
	const di = "<td>";
	const dc = "</td>";
	let filasHtml = "";
	
	switch (selListaPor) {
		case selVistaListarUsuarios:
			let us = [UsuarioCtrl.getModelo()];
			us = datos;
			for (const u of us) {
				filasHtml += fi;
				filasHtml += `${di} ${u.cedula} ${dc}`;
				filasHtml += `${di} ${u.nombre} ${dc}`;
				filasHtml += `${di} ${u.email} ${dc}`;
				filasHtml += `${di} ${u.usuario} ${dc}`;
				filasHtml += `${di} ${u.password} ${dc}`;
				filasHtml += fc;
			}
			break;

		case selVistaListarClientes:
			let cs = [ClienteCtrl.getModelo()];
			cs = datos;
			for (const c of cs) {
				filasHtml += fi;
				filasHtml += `${di} ${c.cedula} ${dc}`;
				filasHtml += `${di} ${c.nombre} ${dc}`;
				filasHtml += `${di} ${c.email} ${dc}`;
				filasHtml += `${di} ${c.direccion} ${dc}`;
				filasHtml += `${di} ${c.telefono} ${dc}`;
				filasHtml += fc;				
			}				
			break;	

		case selVistaListarVentaClientes:
			let vcs = [ClienteCtrl.getModelo()];
			vcs = datos;
			let sumaTotalVentas = 0;
			
			for (const vc of vcs) {
				//carcular total ventas
				const tv = vc.ventas.reduce((ac, v)=> {
					return ac + v.valorVenta;
				}, 0)

				filasHtml += fi;
				filasHtml += `${di} ${vc.cedula} ${dc}`;
				filasHtml += `${di} ${vc.nombre} ${dc}`;
				filasHtml += `${di} ${tv} ${dc}`;
				filasHtml += fc;
				
				sumaTotalVentas += tv;
			}
			filasHtml += fi;
			filasHtml += `${di} Total Ventas ${dc}`;
			filasHtml += `<td colspan="2"> ${sumaTotalVentas} ${dc}`
			filasHtml += fc;
			break;	
			
		case selVistaListarProveedores:
			let ps = [ProveedorCtrl.getModelo()];
			ps = datos;
			for (const p of ps) {
				filasHtml += fi;
				filasHtml += `${di} ${p.nit} ${dc}`;
				filasHtml += `${di} ${p.nombre} ${dc}`;
				filasHtml += `${di} ${p.ciudad} ${dc}`;
				filasHtml += `${di} ${p.direccion} ${dc}`;
				filasHtml += `${di} ${p.telefono} ${dc}`;
				filasHtml += fc;				
			}				
			break;			
			
		case selVistaListarProductos:
			let pts = [ProductoCtrl.getModelo()];
			pts = datos;
			for (const p of pts) {
				filasHtml += fi;
				filasHtml += `${di} ${p.codigo} ${dc}`;
				filasHtml += `${di} ${p.nombre} ${dc}`;
				filasHtml += `${di} ${p.precioCompra} ${dc}`;
				filasHtml += `${di} ${p.ivacompra} ${dc}`;
				filasHtml += `${di} ${p.precioVenta} ${dc}`;
				filasHtml += fc;				
			}				
			break;	
			
		case selVistaListarVentas:
			let vs = [VentaCtrl.getModelo()];
			vs = datos;
			for (const v of vs) {
				filasHtml += fi;
				filasHtml += `${di} ${v.codigo} ${dc}`;
				filasHtml += `${di} ${v.valorVenta} ${dc}`;
				filasHtml += `${di} ${v.ivaVenta} ${dc}`;
				filasHtml += `${di} ${v.totalVenta} ${dc}`;
				filasHtml += fc;				
			}				
			break;				

		default:
			break;
	}
	$(`${selListaPor} table tbody`).html(filasHtml);
}

//====================================================       
/**realiza la configuracion desde la vista para 
 * llamar a los controllers a los que se le 
 * realizara la peticion de consultar
 * */
 function clickListar(e) {

	//desactivar el evento
	e.preventDefault();

	let el = $(e.target);
	let selListaPor = "#" + el.attr("for");	

	renderizarVistaTabla(selListaPor);

	let paramSolicitud = "GET:listar";
	let entidad = null;

	let promesaListar = Promise.resolve([]);

	switch (selListaPor) {
		case selVistaListarUsuarios:
			promesaListar = UsuarioCtrl.ejecutarController(paramSolicitud, entidad)
			.then((mt)=>{
				let metadatos = UsuarioCtrl.getMetadatos();
				metadatos = mt;

				let data = metadatos.usuarios;
				
				if(data.length == 0){
					$(selInfoConsulta).text(metadatos.msn);
					infoColorClass(selInfoConsulta, false);
					return;
				}
				$(selInfoConsulta).text("");
				crearTabla(data, selListaPor);	
				return;	
			})
			break;
	
		case selVistaListarClientes:
		case selVistaListarVentaClientes:			
			promesaListar = ClienteCtrl.ejecutarController(paramSolicitud, entidad)
			.then((mt)=>{
				let metadatos = ClienteCtrl.getMetadatos();
				metadatos = mt;

				let data = metadatos.clientes;

				if(data.length == 0){
					$(selInfoConsulta).text(metadatos.msn);
					infoColorClass(selInfoForm, false);
					return;
				}
				$(selInfoConsulta).text("");
				crearTabla(data, selListaPor);	
				return;	
			})
			break;

		case selVistaListarProveedores:
			promesaListar = ProveedorCtrl.ejecutarController(paramSolicitud, entidad)
			.then((mt)=>{
				let metadatos = ProveedorCtrl.getMetadatos();
				metadatos = mt;

				let data = metadatos.proveedores;
				
				if(data.length == 0){
					$(selInfoConsulta).text(metadatos.msn);
					infoColorClass(selInfoForm, false);
					return;
				}
				$(selInfoConsulta).text("");
				crearTabla(data, selListaPor);	
				return;	
			})
			break;

		case selVistaListarProductos:
			promesaListar = ProductoCtrl.ejecutarController(paramSolicitud, entidad)
			.then((mt)=>{
				let metadatos = ProductoCtrl.getMetadatos();
				metadatos = mt;

				let data = metadatos.productos;
				
				if(data.length == 0){
					$(selInfoConsulta).text(metadatos.msn);
					infoColorClass(selInfoForm, false);
					return;
				}
				$(selInfoConsulta).text("");
				crearTabla(data, selListaPor);	
				return;	
			})
			break;		
			
		case selVistaListarVentas:
			promesaListar = VentaCtrl.ejecutarController(paramSolicitud, entidad)
			.then((mt)=>{
				let metadatos = VentaCtrl.getMetadatos();
				metadatos = mt;
				
				let data = metadatos.ventas;
				
				if(data.length == 0){
					$(selInfoConsulta).text(metadatos.msn);
					infoColorClass(selInfoForm, false);
					return;
				}
				$(selInfoConsulta).text("");
				crearTabla(data, selListaPor);	
				return;
			})
			break;			

		default:
			break;
	}

	promesaListar
	.catch((eMt)=>{
		let metadatos = undefined; //no se tipa por que es generico
		metadatos = eMt;		
		$(selInfoConsulta).text(metadatos.msn);
		infoColorClass(selInfoForm, false);
	});	

 }

//====================================================  
//estados de la vista

export var selIdVista = "#vistaReporte";

export function activarVista() {
	//activar TODOS los eventos que se usen para la vista
	$(selEventNavA).click(clickListar);

	//al iniciar la vista oculta todas 
	//las vistas de tablas 
	ocultarVistasTablas();
}

export function desactivarVista() {
	//desactivar TODOS los eventos que se usen para la vista
	$(selEventNavA).off();
	//ocultar tablas
	ocultarVistasTablas();
}
