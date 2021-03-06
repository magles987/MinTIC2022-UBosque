/**Nombre del modelo o su correspondiente entidad en Singular*/
var nomModel_s = "proveedor";
/**Nombre del modelo o su correspondiente entidad en Plural*/
var nomModel_p = "proveedores"

var urlBase = `${nomModel_s}/`;

/** 
 * @return un modelo modelo vacio para usarlo como instancia 
 * o para tipar
*/
export function getModelo(){
	return {
		nit :"",
		nombre:"",		
		ciudad :"",
		direccion : "",
		telefono : "",
		
		productos:[] //referencia virtual
	};
}

/** 
 * @return un modelo de metadatos vacio para usarlo como instancia 
 * o para tipar
*/
export function getMetadatos() {
	return {
		tipoConsulta:"",
		proveedores : [getModelo()],		
		errorValidacion:getModelo(),
		errorInterno:"",
		msn:"",
	}
}

// ==========================================================
//validaciones locales por cada campo

function valNit(val) {

	if (!val || val == "") {
		return "No puede estar vacío";
	}

	const reNumStr = /^[0-9]+$/
	if (reNumStr.test(val) == false) {
		return "No es un NIT valido";;
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

function valCiudad(val) {

	if (!val || val == "" || val == null) {
		return "No puede estar vacío";
	}

	return;
}

function valDireccion(val) {

	if (!val || val == "" || val == null) {
		return "No puede estar vacío";
	}

	return;
}

function valTelefono(val) {

	if (!val || val == "" || val == null) {
		return "No puede estar vacío";
	}

	const reNumStr = /^[0-9]+$/
	if (reNumStr.test(val) == false) {
		return "Debe ser número valido";
	}

	return;
}

/**
 * verifica si se tiene acumulado algun error de validacion local
 * @return un true si tiene errores acumulados o un false si no los tiene
 */
function comprobarErrorModelo(em = getModelo()) {
	return (em.nit 
			|| em.nombre
			|| em.ciudad			
			|| em.direccion
			|| em.telefono
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
		
		case "GET:leerPorId":
			//ejecutar validadores para este caso
			errorModelo.nit = valNit(entidad.nit);

			//construccion de peticion
			url  = `${url}?nit=${entidad.nit}`;			
			break;
	
		case "POST:guardar":
			//ejecutar validadores para este caso
			errorModelo.nit = valNit(entidad.nit);	
			errorModelo.ciudad = valNombre(entidad.nombre);	
			errorModelo.nombre = valCiudad(entidad.ciudad);		
			errorModelo.direccion = valDireccion(entidad.direccion);	
			errorModelo.telefono = valTelefono(entidad.telefono);	

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};             

			break;      
			
		case "PUT:actualizar":
			//ejecutar validadores para este caso
			errorModelo.nit = valNit(entidad.nit);	
			errorModelo.ciudad = valNombre(entidad.nombre);	
			errorModelo.nombre = valCiudad(entidad.ciudad);		
			errorModelo.direccion = valDireccion(entidad.direccion);	
			errorModelo.telefono = valTelefono(entidad.telefono);	

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};     
			break;   
			
		case "DELETE:eliminar":
			//ejecutar validadores para este caso
			errorModelo.nit = valNit(entidad.nit);

			//se arma la solicitud con el parametro identificador para eliminacion
			url = `${url}/${entidad.nit}`
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

		//convertir (si solo se recibio un entidad) a un array de entidads
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

} ;

