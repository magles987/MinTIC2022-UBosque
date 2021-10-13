import * as ProductoCtrl from "../api/productoApi.js";

import { infoColorClass } from "../main.js";
//====================================================    
//selectores de campos del form		

let selForm = "#formProducto";

//selector de campos
let selCampoCodigo = "#productoCodigo";
let selCampoNombre = "#productoNombre";
let selCampoPrecioCompra = "#productoPrecioCompra";
let selCampoIvacompra = "#productoIvacompra";
let selCampoPrecioVenta = "#productoPrecioVenta";

let selCampoArchivo = "#productoArchivo";

//selector de errores
let selErrorCodigo = "#errorProductoCodigo";
let selErrorNombre = "#errorProductoNombre";
let selErrorPrecioCompra = "#errorProductoPrecioCompra";
let selErrorIvaCompra = "#errorProductoIvacompra";
let selErrorPrecioVenta = "#errorProductoPrecioVenta";

let selErrorArchivo = "#errorProductoArchivo";

//selector informativo general para el form
let selInfoForm = "#infoProducto";

//selectores de eventos en general
let selEventBotones = `${selForm} button`;

//====================================================  
/** 
 * limpia los campos del formulario 
 * y devuelve un modelo vacio
*/
function limpiarCampos() {

	$(selCampoCodigo).val("");
	$(selCampoNombre).val("");
	$(selCampoPrecioCompra).val("");
	$(selCampoIvacompra).val("");
	$(selCampoPrecioVenta).val("");

	$(selCampoArchivo).val("");

	limpiarErrores();

	return;
}

/** 
 * limpia las etiquetas de error 
 * del formulario
*/
function limpiarErrores() {

	$(selErrorCodigo).text("");
	$(selErrorNombre).text("");
	$(selErrorPrecioCompra).text("");
	$(selErrorIvaCompra).text("");
	$(selErrorPrecioVenta).text("");

	$(selErrorArchivo).text("");

	return;
}

//====================================================
/** 
 * permite acceder o asignar valores a 
 * los campos del formulario
 * @param entidad recibe un objeto con los valores
 * a cargar en los campos del formulario o un null.
 * si este objeto es null se asume que se 
 * quiere devolver un objeto que contenga cada 
 * valor de cada campo del formulario
*/
function accederCampos(entidad = ProductoCtrl.getModelo()) {

	//evaluar el contenido de entidad
	if (entidad == null || typeof (entidad) != "object") {

		entidad = {};

		entidad.codigo = $(selCampoCodigo).val().trim();
		entidad.nombre = $(selCampoNombre).val().trim();
		entidad.precioCompra = $(selCampoPrecioCompra).val().trim();
		entidad.ivacompra = $(selCampoIvacompra).val().trim();
		entidad.precioVenta = $(selCampoPrecioVenta).val().trim();

	} else {

		$(selCampoCodigo).val(entidad.codigo);
		$(selCampoNombre).val(entidad.nombre);
		$(selCampoPrecioCompra).val(entidad.precioCompra);
		$(selCampoIvacompra).val(entidad.ivacompra);
		$(selCampoPrecioVenta).val(entidad.precioVenta);
	}

	return entidad;
}

/**
 * agrega los mensajes de error de validacion 
 * que se tengan diponibles
 */
function setTagsError(errorModelo = ProductoCtrl.getModelo()) {
	$(selErrorCodigo).text(errorModelo.codigo);
	$(selErrorNombre).text(errorModelo.nombre);
	$(selErrorPrecioCompra).text(errorModelo.precioCompra);
	$(selErrorIvaCompra).text(errorModelo.ivacompra);
	$(selErrorPrecioVenta).text(errorModelo.precioVenta);
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

	 //se inicializa solo para tipar
	 let entidad = ProductoCtrl.getModelo();
	 entidad = accederCampos(null);

	 //consulta especial de archivo		
	 if (paramSolicitud === "POST:cargar-archivo") {
		 //la variable entidad almacenara el archivo
		 entidad = $(selCampoArchivo).prop("files")[0]; //solo el primero
	 }

	 ProductoCtrl.ejecutarController(paramSolicitud, entidad)
		 .then((metadatos) => {

			 switch (metadatos.tipoConsulta) {
				 case "creacion":
				 case "actualizacion":
				 case "eliminacion":
					 limpiarCampos();
					 limpiarErrores();
					 $(selInfoForm).text(metadatos.msn);
					 infoColorClass(selInfoForm, true);

					 break;

				 case "lectura":

					 //determinar si la consulta por codigo es vacia
					 if (metadatos.productos.length == 0) {
						 metadatos.errorValidacion = ProductoCtrl.getModelo()
						 metadatos.errorValidacion.codigo = "no existe";
						 limpiarCampos();
						 return Promise.reject(metadatos);
					 }

					 accederCampos(metadatos.productos[0]);
					 limpiarErrores();
					 break;

				 default:
					 break;
			 }

		 })
		 .catch((eMt) => {
			 let metadatos = ProductoCtrl.getMetadatos();
			 metadatos = eMt;

			 limpiarErrores();

			 if (metadatos.errorValidacion
				 && metadatos.errorValidacion != null
				 && typeof (metadatos.errorValidacion) == "object") {

				 setTagsError(metadatos.errorValidacion);
			 }

			 $(selInfoForm).text(metadatos.msn);
			 infoColorClass(selInfoForm, false);

		 });

 }

//====================================================  
//estados de la vista

export var selIdVista = "#vistaProducto";

export function activarVista() {
	//activar TODOS los eventos que se usen para la vista
	$(selEventBotones).click(clickControllers);
}

export function desactivarVista() {
	//desactivar TODOS los eventos que se usen para la vista
	$(selEventBotones).off();
	//limpiar todos los campos
	limpiarCampos();
	//limpiar variables de modulo 

}
