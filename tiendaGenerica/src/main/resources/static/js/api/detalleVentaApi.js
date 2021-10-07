import * as ProductoCtrl from "./productoApi.js";
/** 
 * @return un modelo modelo vacio para usarlo como instancia 
 * o para tipar
*/
export function getModelo(){
	return {
		codigo :"",
        cantidadProducto:"",
		valorVenta : "",
		valorIva : "",
		valorTotal :"",

		venta:undefined,//FK
		producto:undefined,//FK
	};
}

// ==========================================================
/** 
 * @return un mensaje si la cantidad de prodyucto no es valida
*/
export function valCantidaYProducto(valCant, valProd = ProductoCtrl.getModelo()){
	if (!valCant || valCant == "") {
		return "cantidad no puede estar vacio";
	}

	if (isNaN(parseFloat(valCant))) {
		return "cantidad debe ser numerico";
	}

	if (parseFloat(valCant) <= 0) {
		return "la cantidad debe ser mayor a 0";
	}	

	if (!valProd || valProd == null) {
		return "Producto no puede estar vacio";
	}

	if (typeof valProd != "object") {
		return "no se ha seleccionado un producto valido";
	}	

	if (!valProd.codigo || valProd.codigo == "" || valProd.codigo == null) {
		return "no se ha seleccionado un codigo de producto valido";
	}
	
	if (!valProd.nombre || valProd.nombre == "" || valProd.nombre == null) {
		return "no se ha verificado que el codigo del producto este registrado";
	}

	return;
}

// ==========================================================
/** 
 * @return un entidad ya calculado con los detalles de venta
*/
export function calcular(cantidadProducto, producto = ProductoCtrl.getModelo()) {
	if (producto == null || typeof producto != "object") {return undefined;}
	
	//Factor de redondeo, la cantidad de 0 indica la cantidad maxima de decimales a redondear
	let fR = 1000  
	
	let dv = getModelo();
	dv.cantidadProducto = cantidadProducto;
	
	let vi = (producto.ivacompra / 100) * producto.precioVenta * cantidadProducto;
	let vv = (cantidadProducto * producto.precioVenta) - vi;
	let vt = (cantidadProducto * producto.precioVenta);	
	
	dv.valorIva = (Math.round((vi + Number.EPSILON) * fR) / fR);
	dv.valorVenta = (Math.round((vv + Number.EPSILON) * fR) / fR);
	dv.valorTotal = (Math.round((vt + Number.EPSILON) * fR) / fR);

	dv.producto = producto;
	return dv;		
}

