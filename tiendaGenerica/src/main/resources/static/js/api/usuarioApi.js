
/**Nombre del modelo o su correspondiente entidad en Singular*/
var nomModel_s = "usuario";
/**Nombre del modelo o su correspondiente entidad en Plural*/
var nomModel_p = "usuarios"

var urlBase = `${nomModel_s}/`;
//magnerApp/
/** 
 * @return un modelo modelo vacio para usarlo como instancia 
 * o para tipar
*/
export function getModelo(){
	return {
		cedula :"",
		nombre :"",
		email:"",
		usuario : "",
		password : "",
		
		ventas:[]//referencia virtual
	};
}

/** 
 * @return un modelo de metadatos vacio para usarlo como instancia 
 * o para tipar
*/
export function getMetadatos() {
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

	if (!val || val == "") {
		return "No puede estar vacío";
	}

	const reNumStr = /^[0-9]+$/
	if (reNumStr.test(val) == false) {
		return "Debe ser cédula valida";
	}

	return;
}

function valNombre(val) {

	if (!val || val == "" || val == null) {
		return "No puede estar vacío";
	}

	const reNomStr = /^[a-zA-ZñÑ ]+$/
	if (reNomStr.test(val) == false) {
		return "Debe ser nombre valido";
	}
	return;
}

function valEmail(val) {

	if (!val || val == "" || val == null) {
		return "No puede estar vacío";
	}

	const reEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	if (reEmail.test(val) == false) {
		return "No es un email valido";
	}

	return;
}

function valUsuario(val) {

	if (!val || val == "" || val == null) {
		return "No puede estar vacío";
	}

	return;
}

function valPassword(val) {
	
	if (!val || val == "" || val == null) {
		return "No puede estar vacío";
	}

	return;
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
 * permite acceder o asignar valores a 
 * los campos del formulario
 * @param paramSolicitud string que contiene los 
 * parametros para configurar la peticion, cada 
 * parametro esta separado por caracter   ":"  
 * ejemplo:  "GET:listar" 
 * donde el "GET" (mayuscula) indica el metodo 
 * a usar y el   "listar" es el recurso a pedirle 
 * al servidor
 * @param entidad recibe un objeto con los datos 
 * resgitrados por el usuario de la aplicacion 
 * y los valida.
 * @return una promesa de la peticion al servidor 
 * con los correspondientes metadatos (ya sean de 
 * respuesta satisfactoria o de error)
*/
export function ejecutarController(paramSolicitud, entidad = getModelo()) {
	
	//metadatos a devolver (se asigna para tipar)
	let metadatos = getMetadatos();

	//extraccion de solicitud
	let metodo = paramSolicitud.split(":")[0];
	let solicitud = paramSolicitud.split(":")[1];	

	//contendra posibles errores de validacion con 
	//sus correspondientes mensajes para cada campo
	let errorModelo = getModelo();
	errorModelo = {};

	//asignacion del entidad a enviar (si existe)
	metadatos[nomModel_p] = [entidad]; 

	//preconfiguracion de url de solicitud
	let url = urlBase + solicitud;
	
	//configuracion inicial de peticion para el fetch
	let confingPeticion = {};
	confingPeticion.method = metodo;

	switch (paramSolicitud) {

		case "GET:login":
			
			//ejecutar validadores para este caso
			errorModelo.usuario = valUsuario(entidad.usuario);
			errorModelo.password = valPassword(entidad.password);

			//construccion de peticion
			url = `${url}?usuario=${entidad.usuario}&password=${entidad.password}`;

			break;
		
		case "GET:leerPorId":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(entidad.cedula);

			//construccion de peticion
			url  = `${url}?cedula=${entidad.cedula}`;			
			break;

		case "GET:listar":
			//no se necesitan parametros
			break;			
	
		case "POST:guardar":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(entidad.cedula);	
			errorModelo.nombre = valNombre(entidad.nombre);	
			errorModelo.email = valEmail(entidad.email);		
			errorModelo.usuario = valUsuario(entidad.usuario);	
			errorModelo.password = valPassword(entidad.password);	

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};             

			break;      
			
		case "PUT:actualizar":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(entidad.cedula);	
			errorModelo.nombre = valNombre(entidad.nombre);	
			errorModelo.email = valEmail(entidad.email);		
			errorModelo.usuario = valUsuario(entidad.usuario);	
			errorModelo.password = valPassword(entidad.password);	

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};     
			break;   
			
		case "DELETE:eliminar":
			//ejecutar validadores para este caso
			errorModelo.cedula = valCedula(entidad.cedula);

			//validacion para no eliminar el mismo usuario actual:
			if(cedulaUsuarioActual == entidad.cedula){
				errorModelo.cedula = "No eliminar usuario actualmente logueado"
			} 

			//se arma la solicitud con el parametro identificador para eliminacion
			url = `${url}/${entidad.cedula}`
			break;   

		default:
			break;
	}

	let statusActual = 0;

	return Promise.resolve()
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
								(metadatos[nomModel_p] && metadatos[nomModel_p] != null) ?
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


