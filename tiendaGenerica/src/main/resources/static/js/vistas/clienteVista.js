import {ClienteController, getClienteModelo, getClienteMetadatos } from "../api/clienteApi.js";

$(document).ready(function() {

	//====================================================    
	//selectores de campos del form		

	let selForm = "#form-cliente";

	//selector de campos
	let selCampoCedula = "#cliente-cedula";
	let selCampoNombre = "#cliente-nombre";
	let selCampoDireccion = "#cliente-direciion";
	let selCampoTelefono = "#cliente-telefono";
	let selCampoEmail = "#cliente-email";

	//selector de errores
	let selErrorCedula = "#error-cliente-cedula";
	let selErrorNombre = "#error-cliente-nombre";
	let selErrorDireccion = "#error-cliente-direccion";
	let selErrorTelefono = "#error-cliente-telefono";
	let selErrorEmail = "#error-cliente-email";


	//Selector informativo general para el form
	let selInfoForm = "#info-cliente";

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

		$(selErrorCedula).text("");
		$(selErrorNombre).text("");
		$(selErrorDireccion).text("");
		$(selErrorTelefono).text("");
		$(selErrorEmail).text("");

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

		return;
	}

	//====================================================
	/** 
	 * Permite acceder o asignar valores a 
	 * los campos del formulario
	 * @param registro Recibe un objeto con los valores
	 * a cargar en los campos del formulario o un null.
	 * Si este objeto es null se asume que se 
	 * quiere devolver un objeto que contenga cada 
	 * valor de cada campo del formulario
	*/
	function accederCampos(registro = getClienteModelo()) {

		//Evaluar el contenido de registro
		if (registro == null || typeof (registro) != "object") {

			registro = {};

			registro.cedula = $(selCampoCedula).val();
			registro.nombre = $(selCampoNombre).val();
			registro.direccion = $(selCampoDireccion).val();
			registro.telefono = $(selCampoTelefono).val();
			registro.email = $(selCampoEmail).val();

		} else {

			$(selCampoCedula).val(registro.cedula);
			$(selCampoNombre).val(registro.nombre);
			$(selCampoDireccion).val(registro.email);
			$(selCampoTelefono).val(registro.telefono);
			$(selCampoEmail).val(registro.email);
		}
		return registro;
	}

	/**
	 * Agrega los mensajes de error de validación 
	 * que se tengan diponibles
	 */
	function setTagsError(errorModelo = getClienteModelo()) {
		$(selErrorCedula).text(errorModelo.cedula);
		$(selErrorNombre).text(errorModelo.nombre);
		$(selErrorDireccion).text(errorModelo.direccion);
		$(selErrorTelefono).text(errorModelo.telefono);
		$(selErrorEmail).text(errorModelo.email);
	}

	//====================================================       
	/**Configura el evento de cada boton del form correspondiente */
	$(`${selForm} button`).click(function(e) {
		//Desactivar el evento
		e.preventDefault();

		//Se inicializa solo para tipar
		let registro = getClienteModelo();
		registro = accederCampos(null);

		let paramSolicitud = e.target.value;

		ClienteController(paramSolicitud, registro)
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
						accederCampos(metadatos.clientes[0]);
						break;

					default:
						break;
				}

				metadatos.clientes
			})
			.catch((eMt) => {
				let metadatos = getClienteMetadatos();
				metadatos = eMt;

				limpiarErrores();

				if (metadatos.errorValidacion
					&& metadatos.errorValidacion != null
					&& typeof (metadatos.errorValidacion) == "object") {

					setTagsError(metadatos.errorValidacion);
				}

				$(selInfoForm).text(metadatos.msn);

			});
	});

});