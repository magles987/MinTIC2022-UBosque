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
	let selCampoConfirmPassword = "#usuario-confirmPassword";	
	
	//selector de errores
	let selErrorCedula = "#error-usuario-cedula";
	let selErrorNombre = "#error-usuario-nombre";
	let selErrorEmail = "#error-usuario-email";
	let selErrorUsuario = "#error-usuario-usuario";
	let selErrorPassword = "#error-usuario-password";
	let selErrorConfirmPassword = "#error-usuario-confirmPassword";	

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
		$(selCampoConfirmPassword).val("");
		
		$(selErrorCedula).text("");
		$(selErrorNombre).text("");
		$(selErrorEmail).text("");
		$(selErrorUsuario).text("");
		$(selErrorPassword).text("");
		$(selErrorConfirmPassword).text("");

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
		$(selErrorConfirmPassword).text("");

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
			registro.confirmPassword = $(selCampoConfirmPassword).val();
			
		}else{			

			$(selCampoCedula).val(registro.cedula);
			$(selCampoNombre).val(registro.nombre);
			$(selCampoEmail).val(registro.email);
			$(selCampoUsuario).val(registro.usuario);
			$(selCampoPassword).val(registro.password);
			$(selCampoConfirmPassword).val(registro.confirmPassword);
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
		$(selErrorConfirmPassword).text(errorModelo.confirmPassword);
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




















// $(document).ready(function(){

//     //==================================================== 
// 	//nombre de metadatos   
//     /**Nombre del modelo o su correspondiente entidad en Singular*/
// 	let nomModel_s = "usuario";
// 	/**Nombre del modelo o su correspondiente entidad en Plural*/
// 	let nomModel_p = "usuarios"

// 	let nomMsn = "msn";
// 	let nomTipoConsulta = "tipoConsulta";
// 	let nomErrorInterno = "errorInterno";
// 	let nomErrorValidacion = "errorValidacion";
// 	let etiLecturaUno = "lecturaUno";
// 	let etiLecturaVarios = "lecturaVarios";
// 	let etiCreacion = "creacion";
// 	let etiActualizacion = "actualizacion";
// 	let etiEliminacion = "eliminacion";

//     //====================================================    
//     //selectores de campos del form		

// 	let selForm = "#form-usuario"; 

// 	//selector de campos
// 	let selCampoCedula = "#usuario-cedula";
// 	let selCampoNombre = "#usuario-nombre";
// 	let selCampoEmail = "#usuario-email";
// 	let selCampoUsuario = "#usuario-usuario";
// 	let selCampoPassword = "#usuario-password";
// 	let selCampoConfirmPassword = "#usuario-confirmPassword";	
	
// 	//selector de errores
// 	let selErrorCedula = "#error-usuario-cedula";
// 	let selErrorNombre = "#error-usuario-nombre";
// 	let selErrorEmail = "#error-usuario-email";
// 	let selErrorUsuario = "#error-usuario-usuario";
// 	let selErrorPassword = "#error-usuario-password";
// 	let selErrorConfirmPassword = "#error-usuario-confirmPassword";	

// 	//selector informativo general para el form
// 	let selInfoForm = "#info-usuario";

// 	//====================================================  
// 	/** 
// 	 * limpia los campos del formulario 
// 	 * y devuelve un modelo vacio
// 	*/
// 	function limpiarCampos(){
		
// 		$(selCampoCedula).val("");
// 		$(selCampoNombre).val("");
// 		$(selCampoEmail).val("");
// 		$(selCampoUsuario).val("");
// 		$(selCampoPassword).val("");
// 		$(selCampoConfirmPassword).val("");
		
// 		return ;
// 	}

// 	//====================================================
// 	/**
// 	 * @return devuleve una representacion 
// 	 * vacia de una entidad (o modelo) correspondiente
// 	 */
// 	function getEntidadVacia(){
// 		return {
// 	        cedula :"",
// 	        nombre :"",
// 	        email:"",
// 	        usuario : "",
// 	        password : "",
// 	        confirmPassword : ""
// 	    };
// 	}

// 	//====================================================
// 	/** 
// 	 * permite acceder o asignar valores a 
// 	 * los campos del formulario
// 	 * @param entidad recibe un objeto con los valos 
// 	 * a cargar en los campos del formulario si este 
// 	 * objeto no se recibe o es null se asume que se 
// 	 * quiere devolver un objeto que contenga cada 
// 	 * valor de cada campo del formulario
// 	*/	
// 	function accederCampos(entidad){
		
// 		//representa la entidad (vacia o con registro)
// 	    let ent = getEntidadVacia();
		
// 		//evaluar el contenido de entidad
// 		if (!entidad || entidad == null || typeof(entidad) != "object") {
// 			ent.cedula = $(selCampoCedula).val();
// 			ent.nombre = $(selCampoNombre).val();
// 			ent.email = $(selCampoEmail).val();
// 			ent.usuario = $(selCampoUsuario).val();
// 			ent.password = $(selCampoPassword).val();
// 			ent.confirmPassword = $(selCampoConfirmPassword).val();
			
// 		}else{			
			
// 			ent = entidad;

// 			$(selCampoCedula).val(ent.cedula);
// 			$(selCampoNombre).val(ent.nombre);
// 			$(selCampoEmail).val(ent.email);
// 			$(selCampoUsuario).val(ent.usuario);
// 			$(selCampoPassword).val(ent.password);
// 			$(selCampoConfirmPassword).val(ent.confirmPassword);
// 		}
// 		return ent;
// 	}

// 	//====================================================
// 	/** 
// 	 * permite acceder o asignar valores a 
// 	 * los campos del formulario
// 	 * @param registro recibe un objeto con los datos 
// 	 * resgitrados por el usuario de la aplicacion 
// 	 * y los valida
// 	 * @return un booleano determinando si es valido o no
// 	*/
// 	function validarLocal(registro, solicitud) {
		
// 		let isValido = true;

// 		let reg = getEntidadVacia();
// 		reg = registro;		

// 		switch (solicitud) {
			
// 			case "leerPorId":

// 				if (isNaN(reg.cedula) || reg.cedula <= 0) {
// 					$(selErrorCedula).text("debe ser una cedula verdadera");
// 					isValido = false; 
// 				}

// 				break;	

// 			case "login":
// 				if (reg.usuario == "" || reg.usuario == null) {
// 					$(selErrorUsuario).text("no puede esta vacio");
// 					isValido = false; 
// 				}
				
// 				if (reg.password == "" || reg.password == null) {
// 					$(selErrorPassword).text("no puede esta vacio");
// 					isValido = false; 
// 				}
// 				break;
			
// 			//casos de modificacion:

// 			case "guardar":
// 			case "actualizar":			

// 				if (isNaN(reg.cedula) || reg.cedula <= 0) {
// 					$(selErrorCedula).text("debe ser una cedula verdadera");
// 					isValido = false; 
// 				}
				
// 				if (reg.nombre == "" || reg.nombre == null) {
// 					$(selErrorNombre).text("no puede esta vacio");
// 					isValido = false; 
// 				}
			
// 				if (reg.email == "" || reg.email == null) {
// 					$(selErrorEmail).text("no puede esta vacio");
// 					isValido = false; 
// 				}    
			
// 				if (reg.usuario == "" || reg.usuario == null) {
// 					$(selErrorUsuario).text("no puede esta vacio");
// 					isValido = false; 
// 				}
				
// 				if (reg.password == "" || reg.password == null) {
// 					$(selErrorPassword).text("no puede esta vacio");
// 					isValido = false; 
// 				}
			
// 				if (reg.confirmPassword == "" || reg.confirmPassword == null) {
// 					$(selErrorConfirmPassword).text("no puede esta vacio");
// 					isValido = false; 
// 				}

// 				break;

// 			case "eliminar":
// 				if (isNaN(reg.cedula) || reg.cedula <= 0) {
// 					$(selErrorCedula).text("debe ser una cedula verdadera");
// 					isValido = false; 
// 				}
// 				break;								
		
// 			default:
// 				isValido = false;
// 				break;
// 		}

// 		//determinar informacion general a mostrar
// 		if (isValido == false) {
// 			$(selInfoForm).text("error al registras los datos");
// 		}

// 		return isValido;
// 	}

// 	//====================================================
// 	//funcion api	
// 	function consultar(paramSolicitud){
	
// 		//extraer informacion del atributo
// 	    let metodo = paramSolicitud.split(":")[0];
// 	    let solicitud = paramSolicitud.split(":")[1];
	
// 	    let urlBase = `/${nomModel_s}/`;

// 	    //elementos del form		
// 	    let elemtForm = $(selForm);
	
// 	    //obtener datos del form	
// 	    let registro = accederCampos();

// 	    //validar local
// 	    if (validarLocal(registro, solicitud) == false) {			
// 	        return; //no ejecutar peticion
// 	    }
	
// 	    //configurar consulta
	
// 	    let url = `${urlBase}${solicitud}`;
	
// 	    let confingPeticion = {};
	    
// 		switch (metodo) {
// 	        case "GET":
	
// 	            switch (solicitud) {
		
// 	                case "login":
	
// 	                    url = `${url}?usuario=${registro.usuario}&password=${registro.password}`;
// 	                    confingPeticion.method = metodo;
// 	                    break;	
		
// 	                case "leerPorId":
	
// 	                    url  = `${url}?cedula=${registro.cedula}`;
// 	                    confingPeticion.method = metodo;
// 	                    break;
	
// 	                case "listar":
	
// 	                    confingPeticion.method = metodo;
// 	                    break;
	            
// 	                default:
// 	                    break;
// 	            }
	
// 	            break;
	
// 	        case "POST":
	        
// 				confingPeticion.body = JSON.stringify(registro);
// 	            confingPeticion.method = metodo;
// 	            confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};             
	
// 	            break;      
	            
// 	        case "PUT":
	
// 				confingPeticion.body = JSON.stringify(registro);
// 	            confingPeticion.method = metodo;
// 	            confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};     
// 	            break;   
	            
// 	        case "DELETE":

// 	            //se arma la solicitud con el parametro identificador para eliminacion
// 	            url = `${url}/${registro.cedula}`
// 				confingPeticion.method = metodo;
// 	            break;            
	    
// 	        default:
// 	            break;
// 	    }
	
// 	    //ejecutar consulta y administrar respuesta
	    
// 	    let statusActual = 0;
	    
// 	    fetch(url, confingPeticion)
// 	    .then(response => {
// 	        statusActual = response.status;
// 	        return response.json();
// 	    })
// 	    .then(resData => {
// 	        //verificar correcto
// 	        if (statusActual >= 200 && statusActual < 300) {
// 				ejecutarRespuestaOK(resData);
// 	        }
// 	        //verificar error usuario
// 	        if (statusActual >= 400 && statusActual < 500) {
// 	            ejecutarRespuestaUsuarioError(resData)
// 	        }  
// 	        //verificar error grave de servidor
// 	        if (statusActual >= 500) {
// 	            ejecutarRespuestaInternoError(resData);
// 	        }  
// 	    });   	
// 	}
	
// 	//====================================================    
// 	/**
// 	 * administrar la respuesta correcta (codigos entre 200 y 399)
// 	 * @param resData el objeto que contiene la respuesta
// 	 */
// 	function ejecutarRespuestaOK(resData){
		
// 		switch (resData[nomTipoConsulta]) {
			
// 			case etiCreacion:
// 			case etiActualizacion:
// 			case etiEliminacion:
// 				limpiarCampos();
// 				break;
				 
// 			case etiLecturaUno:

// 				//vacio solo para tipar
// 				let registro = getEntidadVacia();
// 				//quitar array (si existe solo selecciona el primero o null)
// 				registro = Array.isArray(resData[nomModel_p]) == false ? 
// 							resData[nomModel_p]	: (resData[nomModel_p].length > 0) ?
// 													resData[nomModel_p][0] : null;
				
// 				if (registro == null) {
// 					$(selInfoForm).text("no hay registros"); //--este mensaje lo deberia enviar el servidor???--
// 					limpiarCampos();
// 					break;
// 				}

// 				accederCampos(registro);

// 				break;

// 			case etiLecturaVarios:
				
// 				//vacio solo para tipar
// 				let registros = [getEntidadVacia()];
// 				//convertir a array si no viene
// 				registros = Array.isArray(resData[nomModel_p]) == true ? 
// 							resData[nomModel_p]	: [resData[nomModel_p]];
				
// 				if (registros.length <= 0 || !registros[0] || registros[0] == null) {
// 					$(selInfoForm).text("no hay registros"); //--este mensaje lo deberia enviar el servidor???--
// 					limpiarCampos();
// 					break;
// 				}

// 				for (reg in registros) {
// 					//aqui poblar (rellenar) toda la tabla					
// 				}
// 				break;				

// 			default:
// 				$(selInfoForm).text(resData[nomMsn]);
// 				break;
// 		}

// 		return
// 	}

// 	/**
// 	 * administrar la respuesta correcta pero con 
// 	 * errores de validacion por parte del usuario
// 	 * (codigos entre 400 y 499)
// 	 * @param resData el objeto que contiene la respuesta
// 	 */
// 	function ejecutarRespuestaUsuarioError(resData){

// 		//solo para tipar
// 		let dataValError = getEntidadVacia();

// 		dataValError = resData[nomErrorValidacion]

// 		$(selErrorCedula).text(dataValError.cedula);
// 		$(selErrorNombre).text(dataValError.nombre);
// 		$(selErrorEmail).text(dataValError.email);
// 		$(selErrorUsuario).text(dataValError.usuario);
// 		$(selErrorPassword).text(dataValError.password);
// 		$(selErrorConfirmPassword).text(dataValError.confirmPassword);

// 		$(selInfoForm).text(resData[nomMsn]);
// 	}

// 	/**
// 	 * administrar errores internos del servidor 
// 	 * (web o de BD)
// 	 * (codigos entre 500 en adelante)
// 	 * @param resData el objeto que contiene la respuesta
// 	 */
// 	 function ejecutarRespuestaInternoError(resData){
// 		console.log(resData);
// 	}

// 	//====================================================       
// 	/**configura el evento de cada boton del form correspondiente */
//     $(`${selForm} button`).click(function(e){
//         //desactivar el evento
//         e.preventDefault();
//         consultar(e.target.value);
//     });

//   });

