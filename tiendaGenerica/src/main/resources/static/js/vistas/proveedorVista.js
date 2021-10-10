import * as ProveedorCtrl from "../api/proveedorApi.js";

//====================================================    
//selectores de campos del form		

let selForm = "#formProveedor";

//selector de campos
let selCampoNit = "#proveedorNit";
let selCampoNombre = "#proveedorNombre";
let selCampoDireccion = "#proveedorDireccion";
let selCampoTelefono = "#proveedorTelefono";
let selCampoCiudad = "#proveedorCiudad";

//selector de errores
let selErrorNit = "#errorProveedorNit";
let selErrorNombre = "#errorProveedorNombre";
let selErrorDireccion = "#errorProveedorDireccion";
let selErrorTelefono = "#errorProveedorTelefono";
let selErrorCiudad = "#errorProveedorCiudad";

//selector informativo general para el form
let selInfoForm = "#infoProveedor";

//selectores de eventos en general
let selEventBotones = `${selForm} button`;

//====================================================  
/** 
 * limpia los campos del formulario 
 * y devuelve un modelo vacio
*/
function limpiarCampos() {

	$(selCampoNit).val("");
	$(selCampoNombre).val("");
	$(selCampoDireccion).val("");
	$(selCampoTelefono).val("");
	$(selCampoCiudad).val("");

	limpiarErrores();

	return;
}

/** 
 * limpia las etiquetas de error 
 * del formulario
*/
function limpiarErrores() {

	$(selErrorNit).text("");
	$(selErrorNombre).text("");
	$(selErrorDireccion).text("");
	$(selErrorTelefono).text("");
	$(selErrorCiudad).text("");

	$(selInfoForm).text("");	

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
function accederCampos(entidad = ProveedorCtrl.getModelo()) {

	//evaluar el contenido de entidad
	if (entidad == null || typeof (entidad) != "object") {

		entidad = {};

		entidad.nit = $(selCampoNit).val().trim();
		entidad.nombre = $(selCampoNombre).val().trim();
		entidad.direccion = $(selCampoDireccion).val().trim();
		entidad.telefono = $(selCampoTelefono).val().trim();
		entidad.ciudad = $(selCampoCiudad).val().trim();

	} else {

		$(selCampoNit).val(entidad.nit);
		$(selCampoNombre).val(entidad.nombre);
		$(selCampoDireccion).val(entidad.direccion);
		$(selCampoTelefono).val(entidad.telefono);
		$(selCampoCiudad).val(entidad.ciudad);
	}
	return entidad;
}

/**
 * agrega los mensajes de error de validacion 
 * que se tengan diponibles
 */
function setTagsError(errorModelo = ProveedorCtrl.getModelo()) {
	$(selErrorNit).text(errorModelo.nit);
	$(selErrorNombre).text(errorModelo.nombre);
	$(selErrorDireccion).text(errorModelo.direccion);
	$(selErrorTelefono).text(errorModelo.telefono);
	$(selErrorCiudad).text(errorModelo.ciudad);
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

		//se inicializa solo para tipar
		let entidad = ProveedorCtrl.getModelo();
		entidad = accederCampos(null);

		let paramSolicitud = e.target.value;

		ProveedorCtrl.ejecutarController(paramSolicitud, entidad)
		.then((metadatos)=>{
			
			switch (metadatos.tipoConsulta) {
				case "creacion":
				case "actualizacion":
				case  "eliminacion":
					limpiarCampos();
					limpiarErrores();
					$(selInfoForm).text(metadatos.msn);

					break;
			
				case "lectura":

					//determinar si la consulta por nit es vacia
					if (metadatos.proveedores.length == 0) {
						metadatos.errorValidacion = ProveedorCtrl.getModelo();
						metadatos.errorValidacion.nit = "no existe";
						limpiarCampos();
						return Promise.reject(metadatos);
					}

					accederCampos(metadatos.proveedores[0]);
					limpiarErrores();

					break;

				default:
					break;
			}

		})
		.catch((eMt)=>{
			let metadatos = ProveedorCtrl.getMetadatos();
			metadatos = eMt;

			limpiarErrores();

			if (metadatos.errorValidacion 
				&& metadatos.errorValidacion != null 
				&& typeof(metadatos.errorValidacion) == "object") {
				
				setTagsError(metadatos.errorValidacion);
			}
			
			$(selInfoForm).text(metadatos.msn);

		});
}

//====================================================  
//estados de la vista

export var selIdVista = "#vistaProveedor";

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