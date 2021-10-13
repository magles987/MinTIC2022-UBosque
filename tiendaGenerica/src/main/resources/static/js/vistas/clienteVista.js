import * as ClienteCtrl from "../api/clienteApi.js";

import { infoColorClass } from "../main.js";
//====================================================    
//selectores de campos del form		

let selForm = "#formCliente"; 

//selector de campos
let selCampoCedula = "#clienteCedula";
let selCampoNombre = "#clienteNombre";
let selCampoEmail = "#clienteEmail";
let selCampoDirecion = "#clienteDireccion";
let selCampoTelefono = "#clienteTelefono";


//selector de errores
let selErrorCedula = "#errorClienteCedula";
let selErrorNombre = "#errorClienteNombre";
let selErrorEmail = "#errorClienteEmail";
let selErrorDireccion = "#errorClienteDireccion";
let selErrorTelefono = "#errorClienteTelefono";

//selector informativo general para el form
let selInfoForm = "#infoCliente";

//selectores de eventos en general
let selEventBotones = `${selForm} button`;

//====================================================  
/** 
 * limpia los campos del formulario 
 * y devuelve un modelo vacio
*/
function limpiarCampos(){
	
	$(selCampoCedula).val("");
	$(selCampoNombre).val("");
	$(selCampoEmail).val("");
	$(selCampoDirecion).val("");
	$(selCampoTelefono).val("");
	
	limpiarErrores();

	return ;
}

/** 
 * limpia las etiquetas de error 
 * del formulario
*/	
function limpiarErrores(){

	$(selErrorCedula).text("");
	$(selErrorNombre).text("");
	$(selErrorEmail).text("");
	$(selErrorDireccion).text("");
	$(selErrorTelefono).text("");

	$(selInfoForm).text("");
	return ;
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
function accederCampos(entidad = ClienteCtrl.getModelo()){
	
	//evaluar el contenido de entidad
	if (entidad == null || typeof (entidad) != "object") {

		entidad = {};

		entidad.cedula = $(selCampoCedula).val().trim();
		entidad.nombre = $(selCampoNombre).val().trim();
		entidad.email = $(selCampoEmail).val().trim();
		entidad.direccion = $(selCampoDirecion).val().trim();
		entidad.telefono = $(selCampoTelefono).val().trim();

	} else {

		$(selCampoCedula).val(entidad.cedula);
		$(selCampoNombre).val(entidad.nombre);
		$(selCampoEmail).val(entidad.email);
		$(selCampoDirecion).val(entidad.direccion);
		$(selCampoTelefono).val(entidad.telefono);
	}
	return entidad;
}

/**
 * agrega los mensajes de error de validacion 
 * que se tengan diponibles
 */
function setTagsError(errorModelo = ClienteCtrl.getModelo()) {
	$(selErrorCedula).text(errorModelo.cedula);
	$(selErrorNombre).text(errorModelo.nombre);
	$(selErrorEmail).text(errorModelo.email);
	$(selErrorDireccion).text(errorModelo.direccion);
	$(selErrorTelefono).text(errorModelo.telefono);
}

//====================================================       
/**realiza la configuracion desde la vista para 
 * llamar a los controllers cuando se a detectado un 
 * click en algun botonque solicita peticion CRUD
 * @param e el evento con el que se disparo la ejecucion
 * */
function clickControllers(e) {
	//desactivar el evento
	e.preventDefault();

	//se inicializa solo para tipar
	let entidad = ClienteCtrl.getModelo();
	entidad = accederCampos(null);

	let paramSolicitud = e.target.value;

	ClienteCtrl.ejecutarController(paramSolicitud, entidad)
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

					//determinar si la consulta por cedula es vacia
					if (metadatos.clientes.length == 0) {
						metadatos.errorValidacion = ClienteCtrl.getModelo()
						metadatos.errorValidacion.cedula = "no existe";
						limpiarCampos();
						return Promise.reject(metadatos);
					}

					accederCampos(metadatos.clientes[0]);
					limpiarErrores()
					break;

				default:
					break;
			}

		})
		.catch((eMt) => {
			let metadatos = ClienteCtrl.getMetadatos();
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

export var selIdVista = "#vistaCliente";

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

