import { UsuarioController, getUsuarioModelo, getUsuarioMetadatos } from "../api/usuarioApi.js";

$(document).ready(function(){
	
    //====================================================    
    //selectores de campos del form		

	let selForm = "#form-auth"; 

	//selector de campos
	let selCampoUsuario = "#auth-usuario";
	let selCampoPassword = "#auth-password";

	
	//selector de errores
	let selErrorUsuario = "#error-auth-usuario";
	let selErrorPassword = "#error-auth-password";


	//selector informativo general para el form
	let selInfoForm = "#info-auth";

	//====================================================  
	/** 
	 * limpia los campos del formulario 
	 * y devuelve un modelo vacio
	*/
	function limpiarCampos(){
		
		$(selCampoUsuario).val("");
		$(selCampoPassword).val("");

		return ;
	}

	/** 
	 * limpia las etiquetas de error 
	 * del formulario
	*/	
	function limpiarErrores(){

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
			
			registro.usuario = $(selCampoUsuario).val();
			registro.password = $(selCampoPassword).val();
			
		}else{					

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

			limpiarCampos();
			limpiarErrores();
			
			cedulaUsuarioActual = metadatos.usuarios[0].cedula;

			//aqui debe acceder a otra vista
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


