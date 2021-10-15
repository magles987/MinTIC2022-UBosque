import * as ProveedorCtrl from "./proveedorApi.js";

/**Nombre del modelo o su correspondiente entidad en Singular*/
var nomModel_s = "producto";
/**Nombre del modelo o su correspondiente entidad en Plural*/
var nomModel_p = "productos"

var urlBase = `${nomModel_s}/`;

/** 
 * @return un modelo modelo vacio para usarlo como instancia 
 * o para tipar
*/
export function getModelo(){
	return {
		codigo :"",
		nombre :"",
		precioCompra:"",
		ivacompra : "",
		precioVenta : "",
		
		proveedor:undefined, //FK
		detalleVentas:[]//referencia virtual
	};
}

/** 
 * @return un modelo de metadatos vacio para usarlo como instancia 
 * o para tipar
*/
export function getMetadatos() {
	return {
		tipoConsulta:"",
		productos : [getModelo()],		
		errorValidacion:getModelo(),
		errorInterno:"",
		msn:"",
	}
}

// ==========================================================
//validaciones locales por cada campo

function valCodigo(val) {

	if (!val || val == "") {
		return "no puede estar vacio";
	}

	if (isNaN(parseInt(val)) || parseInt(val) <= 0) {
		return "no es una codigo valido";
	}
	return;
}

function valNombre(val) {

	if (!val || val == "" || val == null) {
		return "no puede estar vacio";
	}

	return;
}

function valPrecioCompra(val) {

	if (!val || val == "" || val == null) {
		return "no puede estar vacio";
	}

	if (isNaN(parseFloat(val))) {
		return "debe ser numerico";
	}	

	if (parseFloat(val) <= 0) {
		return "debe ser mayor a 0";
	}	

	return;
}

function valIvacompra(val) {

	if (!val || val == "" || val == null) {
		return "no puede estar vacio";
	}

	if (isNaN(parseFloat(val))) {
		return "debe ser numerico";
	}	

	if (parseFloat(val) <= 0) {
		return "debe ser mayor a 0";
	}	

	return;
}

function valPrecioVenta(val) {

	if (!val || val == "" || val == null) {
		return "no puede estar vacio";
	}

	if (isNaN(parseFloat(val))) {
		return "debe ser numerico";
	}
		
	if (parseFloat(val) <= 0) {
		return "debe ser mayor a 0";
	}	

	return;
}

function valProveedor(val = ProveedorCtrl.getModelo()) {
	
	if (!val || val == "" || val == null) {
		return "no puede estar vacio";
	}

	if (typeof val != "object"
		|| !val.nit
		|| val.nit == null
		|| isNaN(val.nit)
	) {
		return "no se indicó a que proveedor valido le pertenece";
	}

	return;
}


function valArchivo(archivo) {

	//primero determinar que exista algun valor y que sea objeto
	if (!archivo 
		|| archivo == null 
		|| typeof archivo != "object" ) {
		return "no hay un archivo a subir";
	}

	//verificar que tenga los atributos de name y size
	if (!archivo.name || archivo.name == null
		|| !archivo.size || archivo.size == null
		) {
		return "el archivo no se puede leer o esta dañado";
	}

	const extVal = ".csv"; //extension valida de archivo permitido
	const tipoVal = "text/csv"; //tipo de archivo permitido
	const tamMax = 2500000; //250k tamanno maximo permitido a subir (en Bytes)

	let nomArchivo = archivo.name;
	let extArchivo = nomArchivo.substring(nomArchivo.lastIndexOf("."), nomArchivo.length);
	let tamArchivo = archivo.size;
	let tipoArchivo = archivo.type;

	if (tamArchivo == 0) {
		return "el archivo no puede estar vacio";
	}

	if (tamArchivo > tamMax) {
		return `el archivo excede ${tamMax} de tamaño en Bytes`;
	}

	if (extVal != extArchivo || tipoVal != tipoArchivo) {
		return `no es un archivo valido, debe ser de extension ${extVal} y de tipo ${tipoVal}`
	}

	return;
}

/**
 * verifica si se tiene acumulado algun error de validacion local
 * @return un true si tiene errores acumulados o un false si no los tiene
 */
function comprobarErrorModelo(em = getModelo()) {
	return (em.codigo 
			|| em.nombre
			|| em.precioCompra
			|| em.ivacompra
			|| em.precioVenta
			|| em.proveedor
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
			errorModelo.codigo = valCodigo(entidad.codigo);

			//construccion de peticion
			url  = `${url}?codigo=${entidad.codigo}`;			
			break;
	
		case "POST:guardar":
			//ejecutar validadores para este caso
			errorModelo.codigo = valCodigo(entidad.codigo);	
			errorModelo.nombre = valNombre(entidad.nombre);	
			errorModelo.precioCompra = valPrecioCompra(entidad.precioCompra);		
			errorModelo.ivacompra = valIvacompra(entidad.ivacompra);	
			errorModelo.precioVenta = valPrecioVenta(entidad.precioVenta);	
			errorModelo.proveedor = valProveedor(entidad.proveedor);

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};             

			break;      
			
		case "PUT:actualizar":
			//ejecutar validadores para este caso
			errorModelo.codigo = valCodigo(entidad.codigo);	
			errorModelo.nombre = valNombre(entidad.nombre);	
			errorModelo.precioCompra = valPrecioCompra(entidad.precioCompra);		
			errorModelo.ivacompra = valIvacompra(entidad.ivacompra);	
			errorModelo.precioVenta = valPrecioVenta(entidad.precioVenta);	
			errorModelo.proveedor = valProveedor(entidad.proveedor);

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};     
			break;   
			
		case "DELETE:eliminar":
			//ejecutar validadores para este caso
			errorModelo.codigo = valCodigo(entidad.codigo);

			//se arma la solicitud con el parametro identificador para eliminacion
			url = `${url}/${entidad.codigo}`
			break;   


        case "POST:cargar-archivo":
            //ejecutar validadores para este caso
            errorModelo.codigo = valArchivo(entidad);

			//empaquetar archivo para enviar
			let formData = new FormData();
			formData.append("file", entidad);

            confingPeticion.body = formData;

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



