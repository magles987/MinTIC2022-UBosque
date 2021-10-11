import * as UsuarioCtrl from "./usuarioApi.js";
import * as ClienteCtrl from "./clienteApi.js";
import * as DetalleVentaCtrl from "./detalleVentaApi.js";

/**Nombre del modelo o su correspondiente entidad en Singular*/
var nomModel_s = "venta";
/**Nombre del modelo o su correspondiente entidad en Plural*/
var nomModel_p = "ventas"

var urlBase = `/${nomModel_s}/`;

/** 
 * @return un modelo modelo vacio para usarlo como instancia 
 * o para tipar
*/
export function getModelo(){
	return {
		codigo :"",
		ivaVenta : "",
		totalVenta : "",
		valorVenta:"",

		cliente :undefined,//FK
		usuario:undefined,//FK
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
		ventas : [getModelo()],		
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

	if (isNaN(val) || val <= 0) {
		return "no es una codigo valido";
	}
	return;
}

function valIvaVenta(val) {

	if (!val || val == "" || val == null) {
		return "Iva Venta no puede estar vacio";
	}

	if (isNaN(val) || val <= 0) {
		return "Iva Venta debe ser numerico";
	}

	return;
}

function valTotalVenta(val) {

	if (!val || val == "" || val == null) {
		return "Total Venta no puede estar vacio";
	}

	if (isNaN(val) || val <= 0) {
		return "Total Venta debe ser numerico";
	}

	return;
}

function valValorVenta(val) {

	if (!val || val == "" || val == null) {
		return "Valor venta no debe estar vacio";
	}

	if (isNaN(val) || val <= 0) {
		return "Valor venta debe ser numerico";
	}

	return;
}

function valUsuario(val = UsuarioCtrl.getModelo()) {

	if (!val
		||val == ""
		|| val == null
		|| typeof val != "object"
		|| !val.cedula
		|| val.cedula == null
		|| isNaN(parseInt(val.cedula))
		|| parseInt(val) <= 0
	) {
		return "no se indico una cedula valida del Usuario";
	}

	return;
}

function valCliente(val = ClienteCtrl.getModelo()) {

	if (!val
		||val == ""
		|| val == null
		|| typeof val != "object"
		|| !val.cedula
		|| val.cedula == null
		|| isNaN(parseInt(val.cedula))
		|| parseInt(val) <= 0
	) {
		return "no se indico una cedula valida del Cliente";
	}

	return;
}

function valDetalleVenta(val = [DetalleVentaCtrl.getModelo()]) {

	if (!val
		||val == ""
		|| val == null
		|| typeof val != "object"
	) {
		return "no se puede procesar el detalle de la venta";
	}

	for (let i = 0; i < val.length; i++) {
		let el = val[i];
		if (!el.cantidadProducto
			||el.cantidadProducto == null
		) {
			return "algunos productos sin cantidad";
		}
	
		if (isNaN(el.cantidadProducto)
			||el.cantidadProducto <= 0
		) {
			return "algunos productos con cantidad NO valida (debe ser numero y mayor a 0)";
		}		
		
	}

	return;
}

/**
 * verifica si se tiene acumulado algun error de validacion local
 * @return un true si tiene errores acumulados o un false si no los tiene
 */
function comprobarErrorModelo(em = getModelo()) {
	return (em.codigo 
			|| em.ivaVenta
			|| em.totalVenta
			|| em.valorVenta
			|| em.usuario
			|| em.cliente
			|| em.detalleVentas
			);
}

// ==========================================================
/** 
 * @return un entidad ya calculado con la venta
*/
export function calcular(
	detallesVenta = [DetalleVentaCtrl.getModelo()], 
	usuario = UsuarioCtrl.getModelo(), 
	cliente = ClienteCtrl.getModelo()
	) {
	let venta = getModelo();
	
	venta.valorVenta = 0;
	venta.ivaVenta = 0;
	venta.totalVenta = 0; 
	
	//Factor de redondeo, la cantidad de 0 indica la cantidad maxima de decimales a redondear
	let fR = 1000  

	for (const dv of detallesVenta) {
		if (!dv || dv == null || typeof dv != "object") {continue}
		
		venta.valorVenta +=  dv.valorVenta;
		venta.ivaVenta += dv.valorIva;
		venta.totalVenta += dv.valorTotal;

		venta.valorVenta = (Math.round((venta.valorVenta + Number.EPSILON) * fR) / fR);
		venta.ivaVenta = (Math.round((venta.ivaVenta  + Number.EPSILON) * fR) / fR);
		venta.totalVenta = (Math.round((venta.totalVenta + Number.EPSILON) * fR) / fR);

		venta.detalleVentas.push(dv);
	}

	venta.usuario = usuario;
	venta.cliente = cliente;
	
	return venta;		
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
 * @param entidad recibe un objeto con los datos 
 * resgitrados por el venta de la aplicacion 
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
	
			errorModelo.ivaVenta = valIvaVenta(entidad.ivaVenta);	
			errorModelo.valorVenta = valValorVenta(entidad.valorVenta);		
			errorModelo.totalVenta = valTotalVenta(entidad.totalVenta);
			errorModelo.usuario = valUsuario(entidad.usuario);
			errorModelo.cliente = valCliente(entidad.cliente);
			errorModelo.detalleVentas = valDetalleVenta(entidad.detalleVentas);	

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};             

			break;      
			
		case "PUT:actualizar":
			//ejecutar validadores para este caso

			errorModelo.ivaVenta = valIvaVenta(entidad.ivaVenta);	
			errorModelo.valorVenta = valValorVenta(entidad.valorVenta);		
			errorModelo.totalVenta = valTotalVenta(entidad.totalVenta);
			errorModelo.usuario = valUsuario(entidad.usuario);
			errorModelo.cliente = valCliente(entidad.cliente);
			errorModelo.detalleVentas = valDetalleVenta(entidad.detalleVentas);

			confingPeticion.body = JSON.stringify(entidad);
			confingPeticion.headers = {'Content-Type': 'application/json;charset=UTF-8'};     
			break;   
			
		case "DELETE:eliminar":
			//ejecutar validadores para este caso
			errorModelo.codigo = valCodigo(entidad.codigo);

			//se arma la solicitud con el parametro identificador para eliminacion
			url = `${url}/${entidad.codigo}`
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
		//verificar error venta
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




