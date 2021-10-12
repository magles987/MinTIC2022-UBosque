import * as ClienteCtrl from "../api/clienteApi.js";

//====================================================    
//selectores de campos del form		

let selForm = "#formCliente";

//selector de campos
let selCampoCedula = "#clienteCedula";
let selCampoNombre = "#clienteNombre";
let selCampoDireccion = "#clienteDireccion";
let selCampoTelefono = "#clienteTelefono";
let selCampoEmail = "#clienteEmail";

//selector de errores
let selErrorCedula = "#errorClienteCedula";
let selErrorNombre = "#errorClienteNombre";
let selErrorDireccion = "#errorClienteDireccion";
let selErrorTelefono = "#errorClienteTelefono";
let selErrorEmail = "#errorClienteEmail";


//Selector informativo general para el form
let selInfoForm = "#infoCliente";

//selectores de eventos en general
let selEventBotones = `${selForm} button`;

//====================================================  
/** 
 * Limpia los campos del formulario 
 * y devuelve un modelo vacio
*/
function limpiarCampos() {

	$(selCampoCedula).val("");
	$(selCampoNombre).val("");
	$(selCampoDireccion).val("");
	$(selCampoTelefono).val("");
	$(selCampoEmail).val("");
	
	limpiarErrores();

	return;
}

/** 
 * Limpia las etiquetas de error 
 * del formulario
*/
function limpiarErrores() {

	$(selErrorCedula).text("");
	$(selErrorNombre).text("");
	$(selErrorDireccion).text("");
	$(selErrorTelefono).text("");
	$(selErrorEmail).text("");	
	$(selInfoForm).text("");


	return;
}

//====================================================
/** 
 * Permite acceder o asignar valores a 
 * los campos del formulario
 * @param entidad Recibe un objeto con los valores
 * a cargar en los campos del formulario o un null.
 * Si este objeto es null se asume que se 
 * quiere devolver un objeto que contenga cada 
 * valor de cada campo del formulario
*/
function accederCampos(entidad = ClienteCtrl.getModelo()) {

	//Evaluar el contenido de entidad
	if (entidad == null || typeof (entidad) != "object") {

		entidad = {};

		entidad.cedula = $(selCampoCedula).val().trim();
		entidad.nombre = $(selCampoNombre).val().trim();
		entidad.direccion = $(selCampoDireccion).val().trim();
		entidad.telefono = $(selCampoTelefono).val().trim();
		entidad.email = $(selCampoEmail).val().trim();

	} else {

		$(selCampoCedula).val(entidad.cedula);
		$(selCampoNombre).val(entidad.nombre);
		$(selCampoDireccion).val(entidad.direccion);
		$(selCampoTelefono).val(entidad.telefono);
		$(selCampoEmail).val(entidad.email);
	}
	return entidad;
}

/**
 * Agrega los mensajes de error de validación 
 * que se tengan diponibles
 */
function setTagsError(errorModelo = ClienteCtrl.getModelo()) {
	$(selErrorCedula).text(errorModelo.cedula);
	$(selErrorNombre).text(errorModelo.nombre);
	$(selErrorDireccion).text(errorModelo.direccion);
	$(selErrorTelefono).text(errorModelo.telefono);
	$(selErrorEmail).text(errorModelo.email);
}

//====================================================       
/**realiza la configuracion desde la vista para 
 * llamar a los controllers cuando se a detectado un 
 * click en algun botonque solicita peticion CRUD
 * @param e el evento con el que se disparo la ejecucion
 * */
function clickControllers(e) {
	//Desactivar el evento
	e.preventDefault();

	//Se inicializa solo para tipar
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

					break;

				case "lectura":
					//determinar si la consulta por cedula es vacia
					if (metadatos.clientes.length == 0) {
						metadatos.errorValidacion = ClienteCtrl.getModelo();
						metadatos.errorValidacion.cedula = "No existe";
						return Promise.reject(metadatos);
					}

					accederCampos(metadatos.clientes[0]);
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

		});

}

//====================================================  
//Estados de la vista

export var selIdVista = "#vistaCliente";

export function activarVista() {
	//Activar TODOS los eventos que se usen para la vista
	$(selEventBotones).click(clickControllers);
}

export function desactivarVista() {
	//Desactivar TODOS los eventos que se usen para la vista
	$(selEventBotones).off();
	//Limpiar todos los campos
	limpiarCampos();
	//Limpiar variables de modulo 

}