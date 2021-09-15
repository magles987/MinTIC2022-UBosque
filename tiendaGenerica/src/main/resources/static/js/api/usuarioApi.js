
/**Nombre del modelo o su correspondiente entidad en Singular*/
var nomModel_s = "usuario";
/**Nombre del modelo o su correspondiente entidad en Plural*/
var nomModel_p = "usuarios"

var urlBase = `/${nomModel_s}/`;

function getModelo(){
	return {
		cedula :"",
		nombre :"",
		email:"",
		usuario : "",
		password : "",
		confirmPassword : ""
	};
}

function getMetadatos() {
	return {
		tipoConsulta:"",
		usuarios : [getModelo()],		
		errorValidacion:getModelo(),
		errorInterno:"",
		msn:"",
	}
}

// ==========================================================
//validaciones locales por cada campo

function valCedula(val) {
	let msn;

	if (isNaN(val) || val <= 0) {
		msn = "no puede estar vacio";
	}
	return msn;
}

function valNombre(val) {
	let msn;

	if (!val || val == "" || val == null) {
		msn = "no puede estar vacio";
	}

	return msn;
}

function valEmail(val) {
	let msn;

	if (!val || val == "" || val == null) {
		msn = "no puede estar vacio";
	}

	return msn;
}

function valUsuario(val) {
	let msn;

	if (!val || val == "" || val == null) {
		msn = "no puede estar vacio";
	}

	return msn;
}

function valPassword(val) {
	let msn;

	if (!val || val == "" || val == null) {
		msn = "no puede estar vacio";
	}

	return msn;
}

function valConfigPassword(val, password) {
	let msn;

	if (!val || val == "" || val == null) {
		msn = "no puede estar vacio";
	}

	if (val === password) {
		msn = "la contraseña no coincide";
	}

	return msn;
}

function comprobarErrorModelo(em = getModelo()) {
	return (em.cedula 
			|| em.nombre
			|| em.email
			|| em.usuario
			|| em.password
			|| em.confirmPassword
			);
}

// ==========================================================
/** 
 * @return un modelo modelo vacio para usarlo como instancia 
 * o para tipar
*/
export function getUsuarioModelo(){
	return getModelo();
}

/** 
 * @return un modelo de metadatos vacio para usarlo como instancia 
 * o para tipar
*/
export function getUsuarioMetadatos() {
	return getMetadatos();
}

/** 
 * permite acceder o asignar valores a 
 * los campos del formulario
 * @param registro recibe un objeto con los datos 
 * resgitrados por el usuario de la aplicacion 
 * y los valida
 * @return un modelo con los mensajes de error de 
 * validacion si no hay errores devuelve null
*/
export function UsuarioController(paramSolicitud, registro = getModelo()) {
	
	//metadatos a devolver (se asigna para tipar)
	let metadatos = getMetadatos();

	//promesa a devolver (se asigna para tipar)
	let PromesaSolicitud = Promise.resolve(metadatos);

	//extraccion de solicitud
	let metodo = paramSolicitud.split(":")[0];
	let solicitud = paramSolicitud.split(":")[1];	

	//contendra posibles errores de validacion con 
	//sus correspondientes mensajes para cada campo
	let errorModelo = getModelo();
	errorModelo = {};

	//asignacion del registro a enviar (si existe)
	metadatos[nomModel_p] = [registro]; 

	//preconfiguracion de url de solicitud
	let url = urlBase + solicitud;
	
	//configuracion inicial de peticion para el fetch
	let confingPeticion = {};
	confingPeticion.method = metodo;

	switch (paramSolicitud) {

		case "GET:login":
			
			//ejecutar validadores para este caso
			errorModelo.usuario = valUsuario(registro.usuario);
			errorModelo.password = valPassword(registro.password);

			//construccion de peticion
			url = `${url}?usuario=${registro.usuario}&password=${registro.password}`;

			break;
		
		case "GET:leerPorId":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(registro.cedula);

			//construccion de peticion
			url  = `${url}?cedula=${registro.cedula}`;			
			break;
	
		case "POST:guardar":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(registro.cedula);	
			errorModelo.nombre = valNombre(registro.nombre);	
			errorModelo.email = valEmail(registro.email);		
			errorModelo.usuario = valUsuario(registro.usuario);	
			errorModelo.password = valPassword(registro.password);	
			errorModelo.confirmPassword = valConfigPassword(registro.confirmPassword);	

			confingPeticion.body = JSON.stringify(registro);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};             

			break;      
			
		case "PUT:actualizar":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(registro.cedula);	
			errorModelo.nombre = valNombre(registro.nombre);	
			errorModelo.email = valEmail(registro.email);		
			errorModelo.usuario = valUsuario(registro.usuario);	
			errorModelo.password = valPassword(registro.password);	
			errorModelo.confirmPassword = valConfigPassword(registro.confirmPassword);	

			confingPeticion.body = JSON.stringify(registro);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};     
			break;   
			
		case "DELETE:eliminar":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(registro.cedula);

			//se arma la solicitud con el parametro identificador para eliminacion
			url = `${url}/${registro.cedula}`
			break;   

		default:
			break;
	}

	let statusActual = 0;

	return PromesaSolicitud
	//validacion local
	.then(()=>{
		//comprobar errorres de validacion
		if (comprobarErrorModelo(errorModelo)) {
			metadatos.errorValidacion = errorModelo;
			metadatos.msn = "se detectaron errores";
			return Promise.reject(metadatos);
		}else{
			return Promise.resolve();
		}
	})
	//solicitar
	.then(()=>fetch(url, confingPeticion))
	//respueta inicial
	.then(response => {
		statusActual = response.status;
		return response.json();
	})
	//administrar respuesta
	.then((mt)=>{
		
		//para tipar
		let metadatos = getMetadatos();
		metadatos = mt;

		//verificar correcto
		if (statusActual >= 200 && statusActual < 300) {

		metadatos[nomModel_p] = Array.isArray(metadatos[nomModel_p]) == true ?
								metadatos[nomModel_p] : 
								(metadatos[nomModel_p] == metadatos[nomModel_p] != null) ?
										[metadatos[nomModel_p]] :
										[];
			return Promise.resolve(metadatos);
		} else
		//verificar error usuario
		if (statusActual >= 400 && statusActual < 500) {
			return Promise.reject(metadatos);
		} else 
		//verificar error grave de servidor
		if (statusActual >= 500) {
			console.log(metadatos.errorInterno);
			return Promise.reject(null); // error grave retorna null
		} else
		//devolvio una respuesta desconocida
		{
			return Promise.reject(undefined); 
		}
	})

} ;







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

