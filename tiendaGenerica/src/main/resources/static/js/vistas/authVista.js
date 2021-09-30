import * as UsuarioCtrl from "../api/usuarioApi.js";

//====================================================    
//selectores de campos del form		

let selForm = "#formAuth";

//selector de campos
let selCampoUsuario = "#authUsuario";
let selCampoPassword = "#authPassword";

//selector de errores
let selErrorUsuario = "#errorAuthUsuario";
let selErrorPassword = "#errorAuthPassword";

//selector informativo general para el form
let selInfoForm = "#infoAuth";

//selectores de eventos en general
let selEventBotones = `${selForm} button`;

//====================================================  
/** 
 * limpia los campos del formulario 
 * y devuelve un modelo vacio
*/
function limpiarCampos() {
	$(selCampoUsuario).val("");
	$(selCampoPassword).val("");
	return;
}

/** 
 * limpia las etiquetas de error 
 * del formulario
*/
function limpiarErrores() {
	$(selErrorUsuario).text("");
	$(selErrorPassword).text("");
	return;
}

//====================================================
/** 
 * permite acceder o asignar valores a 
 * los campos del formulario
 * @param registro recibe un objeto con los valores
 * a cargar en los campos del formulario o un null.
 * si este objeto es null se asume que se 
 * quiere devolver un objeto que contenga cada 
 * valor de cada campo del formulario
*/
function accederCampos(registro = UsuarioCtrl.getModelo()) {

	//evaluar el contenido de registro
	if (registro == null || typeof (registro) != "object") {

		registro = {};

		registro.usuario = $(selCampoUsuario).val();
		registro.password = $(selCampoPassword).val();

	} else {

		$(selCampoUsuario).val(registro.usuario);
		$(selCampoPassword).val(registro.password);

	}
	return registro;
}

/**
 * agrega los mensajes de error de validacion 
 * que se tengan diponibles
 */
function setTagsError(errorModelo = UsuarioCtrl.getModelo()) {

	$(selErrorUsuario).text(errorModelo.usuario);
	$(selErrorPassword).text(errorModelo.password);

}

//====================================================       
/**realiza la configuracion desde la vista para 
 * llamar a los controllers cuando se a detectado un 
 * click en algun botonque solicita peticion CRUD*/
 function clickControllers(e){
	//desactivar el evento
	e.preventDefault();

	//se inicializa solo para tipar
	let registro = UsuarioCtrl.getModelo();
	registro = accederCampos(null);

	let paramSolicitud = e.target.value;

	UsuarioCtrl.ejecutarController(paramSolicitud, registro)
	.then((metadatos)=>{

		limpiarCampos();
		limpiarErrores();
		
		//deja sesion abierta de usuario
		cedulaUsuarioActual = metadatos.usuarios[0].cedula;

		//aqui debe acceder a otra vista
	})
	.catch((eMt)=>{
		let metadatos = UsuarioCtrl.getMetadatos();
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

export var selIdVista = "#vistaAuth";

export function activarVista() {
	//activar TODOS los eventos que se usen para la vista
	$(selEventBotones).click(clickControllers);

	//eliminar la cedula del usuario anterior
	cedulaUsuarioActual = -1;
}

export function desactivarVista() {
	//desactivar TODOS los eventos que se usen para la vista
	$(selEventBotones).off();
	//limpiar todos los campos
	limpiarCampos();
	//limpiar variables de modulo 

}


