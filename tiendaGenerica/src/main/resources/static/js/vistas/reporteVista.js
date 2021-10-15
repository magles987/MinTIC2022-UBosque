import * as UsuarioCtrl from "../api/usuarioApi.js";
import * as ClienteCtrl from "../api/clienteApi.js";
import * as ProveedorCtrl from "../api/proveedorApi.js";
import * as ProductoCtrl from "../api/productoApi.js";
import * as VentaCtrl from "../api/ventaApi.js";
import * as DetalleVentaCtrl from "../api/detalleVentaApi.js"

import { infoColorClass } from "../main.js";

//====================================================    
let selReporte = "#vistaReporte"

//selector informativo general para el form
let selInfoForm = "#infoUsuario";

//Selectores de subvistas de tablas
let selVistaListarUsuarios = "#vistaListarUsuarios";
let selVistaListarClientes = "#vistaListarClientes";
let selVistaListarVentaClientes = "#vistaListarVentasClientes";
let selVistaListarProveedores = "#vistaListarProveedores";
let selVistaListarProductos = "#vistaListarProductos";
let selVistaListarVentas = "#vistaListarVentas";

//Selector de navegación
let selEventNavA = selReporte + " nav a";

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

/**realiza la configuracion desde la vista para 
 * llamar a los controllers cuando se a detectado un 
 * click en algun botonque solicita peticion CRUD
 * @param e el evento con el que se disparo la ejecucion
 * */
function clickListar(e) {
	//Aqui toda la funcionalidad de vista
	
	//desactivar el evento
	e.preventDefault();

	let el = $(e.target);
	let selListaPor = "#" + el.attr("for");
	
	renderizarVistaTabla(selListaPor);
	
	
	let msmVacio = "No hay registros";

	switch (selListaPor) {

		case selVistaListarUsuarios:
			UsuarioCtrl.ejecutarController("GET:listar", null)
				.then((metadatos) =>{
					let datos= metadatos.usuarios
					if (datos.length == 0){
						$(selInfoForm).text(msmVacio);
						return;
					}
					let tabla = "";
					for (let i = 0; i < datos.length; i++) {
						let fila = "";
						fila += "<tr>";
						fila += "<td>" + datos[i].cedula + "</td>";
						fila += "<td>" + datos[i].nombre+ "</td>";
						fila += "<td>" + datos[i].email + "</td>";
						fila += "<td>" + datos[i].usuario + "</td>";
						fila += "<td>" + datos[i].password + "</td>";
						fila += "</tr>";
						tabla += fila;
					} 
					//En el metodo .html se debe agregar el String que construye todos los datos de la tabla (metadatos)	
					$(selListaPor + " table tbody").html(tabla );

				})
			break;
			
		case selVistaListarClientes:
			ClienteCtrl.ejecutarController("GET:listar", null)
				.then((metadatos) =>{
					let datos= metadatos.clientes
					if (datos.length == 0){
						$(selInfoForm).text(msmVacio);
						return;
					}
					let tabla = "";
					for (let i = 0; i < datos.length; i++) {
						let fila = "";
						fila += "<tr>";
						fila += "<td>" + datos[i].cedula + "</td>";
						fila += "<td>" + datos[i].nombre+ "</td>";
						fila += "<td>" + datos[i].email + "</td>";
						fila += "<td>" + datos[i].direccion+ "</td>"
						fila += "<td>" + datos[i].telefono + "</td>"						
						fila += "</tr>";
						tabla += fila;
					} 
					//En el metodo .html se debe agregar el String que construye todos los datos de la tabla (metadatos)	
					$(selListaPor + " table tbody").html(tabla );

				})
			break;
			
		case selVistaListarProveedores:
			ProveedorCtrl.ejecutarController("GET:listar", null)
				.then((metadatos) =>{
					let datos= metadatos.proveedores
					if (datos.length == 0){
						$(selInfoForm).text(msmVacio);
						return;
					}
					let tabla = "";
					for (let i = 0; i < datos.length; i++) {
						let fila = "";
						fila += "<tr>";
						fila += "<td>" + datos[i].nit + "</td>";
						fila += "<td>" + datos[i].nombre+ "</td>";
						fila += "<td>" + datos[i].ciudad+ "</td>";
						fila += "<td>" + datos[i].direccion+ "</td>"
						fila += "<td>" + datos[i].telefono + "</td>"
						fila += "</tr>";
						tabla += fila;
					} 
					//En el metodo .html se debe agregar el String que construye todos los datos de la tabla (metadatos)	
					$(selListaPor + " table tbody").html(tabla );

				})
			break;
			
		case selVistaListarVentas:
			VentaCtrl.ejecutarController("GET:listar", null)
				.then((metadatos) =>{
					let datos= metadatos.ventas
					if (datos.length == 0){
						$(selInfoForm).text(msmVacio);
						return;
					}
					let tabla = "";
					for (let i = 0; i < datos.length; i++) {					
						let fila = "";
						fila += "<tr>";
						fila += "<td>" + datos[i].codigo + "</td>";
						fila += "<td>" + datos[i].valorVenta+ "</td>";
						fila += "<td>" + datos[i].ivaVenta+ "</td>";						
						fila += "<td>" + datos[i].totalVenta+ "</td>"
						fila += "</tr>";
						tabla += fila;
					} 
					//En el metodo .html se debe agregar el String que construye todos los datos de la tabla (metadatos)	
					$(selListaPor + " table tbody").html(tabla );

				})
			break;
			
		case selVistaListarVentaClientes:
			ClienteCtrl.ejecutarController("GET:listar", null)
				.then((metadatos) =>{
					let datos= metadatos.clientes
					if (datos.length == 0){
						$(selInfoForm).text(msmVacio);
						return;
					}
					let tabla = "";
					let fila = "";
					let tTotalVentas = 0;
					for (let i = 0; i < datos.length; i++) {
						
						let tVentas = 0;
						let vs = datos[i].ventas;			
						for (let j = 0; j < vs.length; j++) {
							tVentas += vs[j].totalVenta;							
						}
						
						//Factor de redondeo, la cantidad de 0 indica la cantidad maxima de decimales a redondear
						let fR = 1000;
						tVentas = (Math.round((tVentas + Number.EPSILON) * fR) / fR); 
																
						fila += "<tr>";
						fila += "<td>" + datos[i].cedula + "</td>";
						fila += "<td>" + datos[i].nombre+ "</td>";
						fila += "<td>" + tVentas+ "</td>";										
						fila += "</tr>";
						tabla += fila;
						
						fila = "";
						
						tTotalVentas+= tVentas;
					} 
					fila += "<tr>";
					fila += "<td colspan='2'>TOTAL VENTAS</td>";
					fila += "<td>" + tTotalVentas+ "</td>";										
					fila += "</tr>";
					tabla += fila;			
					
					//En el metodo .html se debe agregar el String que construye todos los datos de la tabla (metadatos)	
					$(selListaPor + " table tbody").html(tabla );

				})
			break;
			
		case selVistaListarProductos:
			ProductoCtrl.ejecutarController("GET:listar", null)
				.then((metadatos) =>{
					let datos = metadatos.productos;
					if (datos.length == 0){
						$(selInfoForm).text(msmVacio);
						return;
					}
					let tabla = "";
					for (let i = 0; i < datos.length; i++) {					
						let fila = "";
						fila += "<tr>";
						fila += "<td>" + datos[i].codigo + "</td>";
						fila += "<td>" + datos[i].nombre+ "</td>";
						fila += "<td>" + datos[i].precioCompra+ "</td>"
						fila += "<td>" + datos[i].ivacompra+ "</td>";
						fila += "<td>" + datos[i].precioVenta+ "</td>"				
						fila += "</tr>";
						tabla += fila;
					} 
					//En el metodo .html se debe agregar el String que construye todos los datos de la tabla (metadatos)	
					$(selListaPor + " table tbody").html(tabla );

				})
			break;
	}
}

//====================================================  
//estados de la vista

export var selIdVista = "#vistaReporte";

export function activarVista() {
	//activar TODOS los eventos que se usen para la vista
	$(selEventNavA).click(clickListar);
	ocultarVistasTablas();
}

export function desactivarVista() {
	//desactivar TODOS los eventos que se usen para la vista
	$(selEventNavA).off();
	//limpiar variables de modulo 
	ocultarVistasTablas();
}