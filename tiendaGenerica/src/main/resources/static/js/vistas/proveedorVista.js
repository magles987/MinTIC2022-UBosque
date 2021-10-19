import * as ProveedorCtrl from "../api/proveedorApi.js";

import { infoColorClass } from "../main.js";
//====================================================    
//selectores de campos del form		

let selForm = "#formProveedor"; 

//selector de campos
let selCampoNit = "#proveedorNit";
let selCampoNombre = "#proveedorNombre";
let selCampoCiudad = "#proveedorCiudad";
let selCampoDirecion = "#proveedorDireccion";
let selCampoTelefono = "#proveedorTelefono";


//selector de errores
let selErrorNit = "#errorProveedorNit";
let selErrorNombre = "#errorProveedorNombre";
let selErrorCiudad = "#errorProveedorCiudad";
let selErrorDireccion = "#errorProveedorDireccion";
let selErrorTelefono = "#errorProveedorTelefono";

//selector informativo general para el form
let selInfoForm = "#infoProveedor";

//selectores de eventos en general
let selEventBotones = `${selForm} button`;

//====================================================  
/** 
 * limpia los campos del formulario 
 * y devuelve un modelo vacio
*/
function limpiarCampos(){
	
	$(selCampoNit).val("");
	$(selCampoNombre).val("");
	$(selCampoCiudad).val("");
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

	$(selErrorNit).text("");
	$(selErrorNombre).text("");
	$(selErrorCiudad).text("");
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
function accederCampos(entidad = ProveedorCtrl.getModelo()){
	
	//evaluar el contenido de entidad
	if (entidad == null || typeof(entidad) != "object") {
		
		entidad = {};
		
		entidad.nit = $(selCampoNit).val().trim();
		entidad.nombre = $(selCampoNombre).val().trim();
		entidad.ciudad = $(selCampoCiudad).val().trim();
		entidad.direccion = $(selCampoDirecion).val().trim();
		entidad.telefono = $(selCampoTelefono).val().trim();
		
	}else{			

		$(selCampoNit).val(entidad.nit);
		$(selCampoNombre).val(entidad.nombre);
		$(selCampoCiudad).val(entidad.ciudad);
		$(selCampoDirecion).val(entidad.direccion);
		$(selCampoTelefono).val(entidad.telefono);
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
	$(selErrorCiudad).text(errorModelo.ciudad);
	$(selErrorDireccion).text(errorModelo.direccion);
	$(selErrorTelefono).text(errorModelo.telefono);
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

	//spinner animacion show
	$(selInfoForm).text("");
	$(selInfoForm).addClass("spinner");
	$(selInfoForm).show();

	ProveedorCtrl.ejecutarController(paramSolicitud, entidad)
	.then((metadatos)=>{
		
		//spinner animacion hide
		$(selInfoForm).removeClass("spinner");		
		
		switch (metadatos.tipoConsulta) {
			case "creacion":
			case "actualizacion":
			case  "eliminacion":
				limpiarCampos();
				limpiarErrores();
				$(selInfoForm).text(metadatos.msn);
				infoColorClass(selInfoForm, true);

				break;
		
			case "lectura":	

				//determinar si la consulta por nit es vacia
				if (metadatos.proveedores.length == 0) {
					metadatos.errorValidacion = ProveedorCtrl.getModelo()
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

		//spinner animacion hide
		$(selInfoForm).removeClass("spinner");

		limpiarErrores();

		if (metadatos.errorValidacion 
			&& metadatos.errorValidacion != null 
			&& typeof(metadatos.errorValidacion) == "object") {
			
			setTagsError(metadatos.errorValidacion);
		}
		
		$(selInfoForm).text(metadatos.msn);
		infoColorClass(selInfoForm, false);

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

