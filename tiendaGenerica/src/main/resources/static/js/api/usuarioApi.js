
/**Nombre del modelo o su correspondiente entidad en Singular*/
var nomModel_s = "usuario";
/**Nombre del modelo o su correspondiente entidad en Plural*/
var nomModel_p = "usuarios"

var urlBase = `/${nomModel_s}/`;

/** 
 * @return un modelo modelo vacio para usarlo como instancia 
 * o para tipar
*/
function getModelo(){
	return {
		cedula :"",
		nombre :"",
		email:"",
		usuario : "",
		password : "",
	};
}

/** 
 * @return un modelo de metadatos vacio para usarlo como instancia 
 * o para tipar
*/
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


/**
 * verifica si se tiene acumulado algun error de validacion local
 * @return un true si tiene errores acumulados o un false si no los tiene
 */
function comprobarErrorModelo(em = getModelo()) {
	return (em.cedula 
			|| em.nombre
			|| em.email
			|| em.usuario
			|| em.password
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
 * @param paramSolicitud string que contiene los 
 * parametros para configurar la peticion, cada 
 * parametro esta separado por caracter   ":"  
 * ejemplo:  "GET:listar" 
 * donde el "GET" (mayuscula) indica el metodo 
 * a usar y el   "listar" es el recurso a pedirle 
 * al servidor
 * @param registro recibe un objeto con los datos 
 * resgitrados por el usuario de la aplicacion 
 * y los valida.
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

};




