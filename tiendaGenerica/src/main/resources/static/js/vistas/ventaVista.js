import * as VentaCtrl from "../api/ventaApi.js";
import * as ClienteCtrl from "../api/clienteApi.js";
import * as ProductoCtrl from "../api/productoApi.js";
import * as DetalleVentaCtrl from "../api/detalleVentaApi.js";
import * as UsuarioCtrl from "../api/usuarioApi.js";

import { infoColorClass } from "../main.js";
//====================================================    
//selectores de campos del form		

let selForm = "#formVenta";

//selector de agrupacion de secciones
let selSeccVentaCliente = selForm + " [for='ventaCliente']";
let selSeccVentaProducto = selForm + " tbody [for='ventaProducto']";

//selector de campos
let selCampoCedulaCliente = "#ventaCedulaCliente";
let selCampoNombreCliente = "#ventaNombreCliente";
let selCampoConsec = "#ventaConsec";

let selCampoCodigoProducto = "[name='codigo']";
let selCampoNombreProducto = "[name='nombre']";
let selCampoCantidadProducto = "[name='cantidadProducto']";
let selCampoValorTotalProducto = "[name='valorTotal']";

let selCampoValorVenta = "#ventaValorVenta";
let selCampoIvaVenta = "#ventaIvaVenta";
let selCampoTotalVenta = "#ventaTotalVenta";

//selector de errores
let selErrorCedulaCliente = "#errorVentaCedulaCliente";

let selErrorCodigoProducto = "[for='codigo']";

//selector informativo general para el form
let selInfoForm = "#infoVenta";

//selectores de eventos en general
let selEventBotones = `${selForm} button`;
let selEventCambioCantidadProd = `${selSeccVentaProducto} ${selCampoCantidadProducto}`;

let selBtnConfirmarVenta = "#btnVentaConfirmar";
let selBtnVentaLimpiar = "#btnVentaLimpiar";

//====================================================   
//
var usuarioActual = UsuarioCtrl.getModelo();
var clienteActual = ClienteCtrl.getModelo();
var productosActual = [ProductoCtrl.getModelo()];
var detallesVentaActual = [DetalleVentaCtrl.getModelo()];
var ventaActual = VentaCtrl.getModelo();

inicializarVarModulo();

/**Inicializa las variables de modulo */
function inicializarVarModulo() {
	usuarioActual.cedula = cedulaUsuarioActual; //Global desde session.js
	clienteActual = undefined;
	productosActual = [];
	detallesVentaActual = [];
	ventaActual = undefined;
}

//====================================================  
/** 
 * limpia los campos del formulario 
 * y devuelve un modelo vacio
*/
function limpiarCampos() {

	limpiarCamposCliente();

	$(selCampoConsec).val("");

	limpiarCamposProductos();

	$(selCampoValorVenta).val("");
	$(selCampoIvaVenta).val("");
	$(selCampoTotalVenta).val("");

	limpiarErrores();

	return;
}

function limpiarCamposCliente() {
	$(selCampoCedulaCliente).val("");
	$(selCampoNombreCliente).val("");
}

function limpiarCamposProductos() {
	let el = $(selSeccVentaProducto);
	let tam = el.size();
	for (let i = 0; i < tam; i++) {
		limpiarCamposProducto(el.eq(i));
	}
}

function limpiarCamposProducto(el) {
	el.find(selCampoCodigoProducto).eq(0).val("");
	el.find(selCampoNombreProducto).eq(0).val("");
	el.find(selCampoCantidadProducto).eq(0).val("");
	el.find(selCampoValorTotalProducto).eq(0).val("");
}

/** 
 * limpia las etiquetas de error 
 * del formulario
*/
function limpiarErrores() {

	$(selErrorCedulaCliente).text("");
	$(selSeccVentaProducto).find(selErrorCodigoProducto).text(""); //.eq(0)
	$(selInfoForm).text("");
	return;
}

//====================================================
/** 
 * permite asignar valores a 
 * los campos del formulario
 * @param entidad 
*/
function setCamposVenta(entidad = VentaCtrl.getModelo()) {

	$(selCampoConsec).val(entidad.codigo);
	$(selCampoValorVenta).val(entidad.valorVenta);
	$(selCampoIvaVenta).val(entidad.ivaVenta);
	$(selCampoTotalVenta).val(entidad.totalVenta);

	return;
}

function setCamposDetalleVenta(entidad = DetalleVentaCtrl.getModelo(), el) {
	el.find(selCampoCantidadProducto).eq(0).val(entidad.cantidadProducto);
	el.find(selCampoValorTotalProducto).eq(0).val(entidad.valorTotal)
	return;
}

//====================================================     
//ejecuciones de controllers adicionales
function ejecClienteController(paramSolicitud, elSeccVentaCliente) {

	let entidad = ClienteCtrl.getModelo();
	entidad.cedula = $(selCampoCedulaCliente).val().trim();

	let metadatos = ClienteCtrl.getMetadatos();

	ClienteCtrl.ejecutarController(paramSolicitud, entidad)
		.then((mt) => {

			metadatos = mt;

			limpiarErrores();

			//determinar si la consulta por cedula es vacia
			if (metadatos.clientes.length == 0) {
				metadatos.errorValidacion = ClienteCtrl.getModelo()
				metadatos.errorValidacion.cedula = "no existe";
				return Promise.reject(metadatos);
			}

			clienteActual = metadatos.clientes[0];

			$(selCampoNombreCliente).val(metadatos.clientes[0].nombre);

		})
		.catch((mt) => {

			metadatos = mt;

			limpiarCamposCliente();
			clienteActual = undefined;

			if (metadatos.errorValidacion
				&& metadatos.errorValidacion != null
				&& typeof (metadatos.errorValidacion) == "object") {
				$(selErrorCedulaCliente).text(metadatos.errorValidacion.cedula);
			}

			//mensaje informativo acumulativo
			$(selInfoForm).text(metadatos.msn);
			infoColorClass(selInfoForm, false);

		});

}

function ejecProductoController(paramSolicitud, elSeccVentaProducto) {

	let entidad = ProductoCtrl.getModelo();
	entidad.codigo = elSeccVentaProducto.find(selCampoCodigoProducto).eq(0).val().trim();

	let metadatos = ProductoCtrl.getMetadatos();
	let idxProd = elSeccVentaProducto.index();

	ProductoCtrl.ejecutarController(paramSolicitud, entidad)
		.then((mt) => {
			metadatos = mt;

			limpiarErrores();

			//determinar si la consulta por codigo es vacia
			if (metadatos.productos.length == 0) {
				metadatos.errorValidacion = ProductoCtrl.getModelo()
				metadatos.errorValidacion.codigo = "no existe";
				return Promise.reject(metadatos);
			}

			productosActual[idxProd] = metadatos.productos[0];

			elSeccVentaProducto.find(selCampoNombreProducto).eq(0).val(metadatos.productos[0].nombre);

			//desbloquear el campo cantidad
			elSeccVentaProducto.find(selCampoCantidadProducto).eq(0).removeProp("disabled");
		})
		.catch((mt) => {
			metadatos = mt;

			limpiarCamposProducto(elSeccVentaProducto);

			//elimina rastros de productos y detalle ventas anteriores
			productosActual[idxProd] = undefined;
			detallesVentaActual[idxProd] = undefined;

			if (metadatos.errorValidacion
				&& metadatos.errorValidacion != null
				&& typeof (metadatos.errorValidacion) == "object") {
				let m = metadatos.errorValidacion.codigo
				elSeccVentaProducto.find(selErrorCodigoProducto).eq(0).text(m);
			}

			//mensaje informativo acumulativo
			$(selInfoForm).text(metadatos.msn);
			infoColorClass(selInfoForm, false);

			//limpiar y bloquear el campo cantidad
			elSeccVentaProducto.find(selCampoCantidadProducto).eq(0).val("");
			elSeccVentaProducto.find(selCampoCantidadProducto).eq(0).prop("disabled", true);

			//bloquear btn confirmar
			$(selBtnConfirmarVenta).prop("disabled", true);		

		});
}

//====================================================       
/**realiza la configuracion desde la vista para 
 * llamar a los controllers cuando se a detectado un 
 * click en algun botonque solicita peticion CRUD
 * @param e el evento con el que se disparo la ejecucion
 * */
 function clickControllers(e){
	 //desactivar el evento
	 e.preventDefault();

	 let paramSolicitud = e.target.value;
	 
	 let elSeccVentaCliente = $(e.target).parents(selSeccVentaCliente);
	 let elSeccVentaProducto = $(e.target).parents(selSeccVentaProducto);

	//determina se es un boton del panel principal
	let btnId = "#" + $(e.target).prop("id");

	 //determinar el contexto de la consulta
	 if (elSeccVentaCliente.size() > 0) {
		 ejecClienteController(paramSolicitud, elSeccVentaCliente);
	 } else if (elSeccVentaProducto.size() > 0) {
		 ejecProductoController(paramSolicitud, elSeccVentaProducto);
	 } else if(btnId == selBtnConfirmarVenta){

		 //se inicializa solo para tipar
		 let entidad = ventaActual;

		//spinner animacion show
		$(selInfoForm).text("");
		$(selInfoForm).addClass("spinner");
		$(selInfoForm).show();

		 VentaCtrl.ejecutarController(paramSolicitud, entidad)
			 .then((metadatos) => {

				//spinner animacion hide
				$(selInfoForm).removeClass("spinner");

				 switch (metadatos.tipoConsulta) {
					 case "creacion":

						 let consecutivo = metadatos.ventas[0].codigo;
						 $(selCampoConsec).val(consecutivo)

						 //limpiarCampos();						
						 limpiarErrores();
						 $(selInfoForm).text(metadatos.msn);
						 infoColorClass(selInfoForm, true);
						 break;

					 case "actualizacion":
					 case "eliminacion":
						 //limpiarCampos();
						 limpiarErrores();
						 $(selInfoForm).text(metadatos.msn);
						 infoColorClass(selInfoForm, true);

						 break;

					 case "lectura":
						 //---se necesita???---							
						 break;

					 default:
						 break;
				 }

				//deshabilitar los campos cantidad
				$(selCampoCantidadProducto).prop("disabled", true);

				//bloquear btn confirmar
				$(selBtnConfirmarVenta).prop("disabled", true);
				//muestra el boton de limpieza
				$(selBtnVentaLimpiar).show();

			 })
			 .catch((eMt) => {
				 let metadatos = UsuarioCtrl.getMetadatos();
				 metadatos = eMt;

				 //spinner animacion hide
				 $(selInfoForm).removeClass("spinner");

				 limpiarErrores();

				 if (metadatos.errorValidacion
					 && metadatos.errorValidacion != null
					 && typeof (metadatos.errorValidacion) == "object") {

					 for (const key in metadatos.errorValidacion) {						 
						 metadatos.msn += `<span> ${metadatos.errorValidacion[key]} </span> </br>`;
					 }
				 }

				 metadatos.msn = `<h5> ${metadatos.msn} <h5>`;
				 $(selInfoForm).html(metadatos.msn);
				 infoColorClass(selInfoForm, false);

				//bloquear btn confirmar
				$(selBtnConfirmarVenta).prop("disabled", true);	
				//muestra el boton de limpieza
				$(selBtnVentaLimpiar).show();		 

			 });
	 }else if(btnId == selBtnVentaLimpiar){
		//limpiar todos los campos
		limpiarCampos();
		//limpiar variables de modulo 
		inicializarVarModulo();
		//oculta el boton de limpieza
		$(selBtnVentaLimpiar).hide();	
	 }
 }

/**es llamado al detectar uncambio en el campo cantidad Producto
 * y ejecuta los calculos de acuerdo a l acantidad digitada
 * @param e el evento con el que se disparo la ejecucion
 * */
 function cambiarCantidad(e){
		//desactivar el evento
		e.preventDefault();

		let el = $(e.target);		
		let cantidadProducto = el.val().trim();

		//reasignar elemento hacia el contenedor padre
		el = el.parents(selSeccVentaProducto);
		let idxProd = el.index();

		let msnVal = DetalleVentaCtrl.valCantidaYProducto(cantidadProducto, productosActual[idxProd]);
		if (msnVal && msnVal != "") {

			//limpiado de campos personalizado
			el.find(selCampoCantidadProducto).eq(0).val(cantidadProducto);
			el.find(selCampoValorTotalProducto).eq(0).val("")
			setCamposVenta(undefined);

			$(selInfoForm).text(msnVal);
			infoColorClass(selInfoForm, false);

			//bloquear btn confirmar
			$(selBtnConfirmarVenta).prop("disabled", true);				
			return
		}

		detallesVentaActual[idxProd] = DetalleVentaCtrl.calcular(cantidadProducto, productosActual[idxProd]);

		setCamposDetalleVenta(detallesVentaActual[idxProd], el);

		ventaActual = VentaCtrl.calcular(detallesVentaActual, usuarioActual, clienteActual);
		
		setCamposVenta(ventaActual);

		//desbloquear btn confirmar
		$(selBtnConfirmarVenta).removeProp("disabled");

		$(selInfoForm).text("");
 }

//====================================================  
//estados de la vista

export var selIdVista = "#vistaVenta";

export function activarVista() {
	//activar TODOS los eventos que se usen para la vista
	$(selEventBotones).click(clickControllers);
	$(selEventCambioCantidadProd).keyup(cambiarCantidad)//.change(cambiarCantidad);

	//deshabilitar los campos cantidad
	$(selCampoCantidadProducto).prop("disabled", true);

	//deshabilitar btn confirmar
	$(selBtnConfirmarVenta).prop("disabled", true);

	//oculta el boton de limpieza
	$(selBtnVentaLimpiar).hide();
	
}

export function desactivarVista() {
	//desactivar TODOS los eventos que se usen para la vista
	$(selEventBotones).off();
	$(selEventCambioCantidadProd).off();

	//deshabilitar los campos cantidad
	$(selCampoCantidadProducto).prop("disabled", true);

	//deshabilitar btn confirmar
	$(selBtnConfirmarVenta).prop("disabled", true);

	//limpiar todos los campos
	limpiarCampos();
	//limpiar variables de modulo 
	inicializarVarModulo();

	//oculta el boton de limpieza
	$(selBtnVentaLimpiar).hide();

}

