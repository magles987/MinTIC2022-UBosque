import { UsuarioController, getUsuarioModelo, getUsuarioMetadatos } from "../api/usuarioApi.js";

$(document).ready(function(){
	
    //====================================================    
    //selectores de campos del form		

	let selForm = "#form-usuario"; 

	//selector de campos
	let selCampoCedula = "#usuario-cedula";
	let selCampoNombre = "#usuario-nombre";
	let selCampoEmail = "#usuario-email";
	let selCampoUsuario = "#usuario-usuario";
	let selCampoPassword = "#usuario-password";
	
	//selector de errores
	let selErrorCedula = "#error-usuario-cedula";
	let selErrorNombre = "#error-usuario-nombre";
	let selErrorEmail = "#error-usuario-email";
	let selErrorUsuario = "#error-usuario-usuario";
	let selErrorPassword = "#error-usuario-password";


	//selector informativo general para el form
	let selInfoForm = "#info-usuario";

	//====================================================  
	/** 
	 * limpia los campos del formulario 
	 * y devuelve un modelo vacio
	*/
	function limpiarCampos(){
		
		$(selCampoCedula).val("");
		$(selCampoNombre).val("");
		$(selCampoEmail).val("");
		$(selCampoUsuario).val("");
		$(selCampoPassword).val("");
		
		$(selErrorCedula).text("");
		$(selErrorNombre).text("");
		$(selErrorEmail).text("");
		$(selErrorUsuario).text("");
		$(selErrorPassword).text("");

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
		$(selErrorUsuario).text("");
		$(selErrorPassword).text("");

		return ;
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
	function accederCampos(registro = getUsuarioModelo()){
		
		//evaluar el contenido de registro
		if (registro == null || typeof(registro) != "object") {
			
			registro = {};
			
			registro.cedula = $(selCampoCedula).val();
			registro.nombre = $(selCampoNombre).val();
			registro.email = $(selCampoEmail).val();
			registro.usuario = $(selCampoUsuario).val();
			registro.password = $(selCampoPassword).val();
			
		}else{			

			$(selCampoCedula).val(registro.cedula);
			$(selCampoNombre).val(registro.nombre);
			$(selCampoEmail).val(registro.email);
			$(selCampoUsuario).val(registro.usuario);
			$(selCampoPassword).val(registro.password);
		}
		return registro;
	}

	/**
	 * agrega los mensajes de error de validacion 
	 * que se tengan diponibles
	 */
	function setTagsError(errorModelo = getUsuarioModelo()) {
		$(selErrorCedula).text(errorModelo.cedula);
		$(selErrorNombre).text(errorModelo.nombre);
		$(selErrorEmail).text(errorModelo.email);
		$(selErrorUsuario).text(errorModelo.usuario);
		$(selErrorPassword).text(errorModelo.password);
	}

	//====================================================       
	/**configura el evento de cada boton del form correspondiente */
	$(`${selForm} button`).click(function(e){
		//desactivar el evento
		e.preventDefault();

		//se inicializa solo para tipar
		let registro = getUsuarioModelo();
		registro = accederCampos(null);

		let paramSolicitud = e.target.value;

		UsuarioController(paramSolicitud, registro)
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
					accederCampos(metadatos.usuarios[0]);
					break;

				default:
					break;
			}

			metadatos.usuarios
		})
		.catch((eMt)=>{
			let metadatos = getUsuarioMetadatos();
			metadatos = eMt;

			limpiarErrores();

			if (metadatos.errorValidacion 
				&& metadatos.errorValidacion != null 
				&& typeof(metadatos.errorValidacion) == "object") {
				
				setTagsError(metadatos.errorValidacion);
			}
			
			$(selInfoForm).text(metadatos.msn);

		});
	});

});


