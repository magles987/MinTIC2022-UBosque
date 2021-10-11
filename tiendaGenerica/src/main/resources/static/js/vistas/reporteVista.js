import * as UsuarioCtrl from "../api/usuarioApi.js";

import { infoColorClass } from "../main.js";

//====================================================    
let selReporte = "#vistaReporte"
//selector informativo general para el form
let selInfoForm = "#infoUsuario";
//Selectores de subvistas de tablas
let selVistaListarUsuarios = "#vistaListarUsuarios";
//Selector de navegación
let selEventNavA = selReporte + " nav a";

//==================================================== 

/**realiza la configuracion desde la vista para 
 * llamar a los controllers cuando se a detectado un 
 * click en algun botonque solicita peticion CRUD
 * @param e el evento con el que se disparo la ejecucion
 * */
function clickListar(e) {
	//Aqui toda la funcionalidad de vista
	//desactivar el evento
	e.preventDefault();

	let el = $(e.target);
	let selListaPor = "#" + el.attr("for");
	let msmVacio = "No hay registros";

	switch (selListaPor) {

		case selVistaListarUsuarios:
			UsuarioCtrl.ejecutarController("GET:listar", null)
				.then((metadatos) =>{
					let datos= metadatos.usuarios
					if (datos.length == 0){
						$(selInfoForm).text(msmVacio);
						return;
					}
					let tabla = "";
					for (let i = 0; i < datos.length; i++) {
						let fila = "";
						fila += "<tr>";
						fila += "<td>" + datos[i].cedula + "</td>";
						fila += "<td>" + datos[i].nombre+ "</td>";
						fila += "<td>" + datos[i].email + "</td>";
						fila += "<td>" + datos[i].usuario + "</td>";
						fila += "<td>" + datos[i].password + "</td>";
						fila += "</tr>";
						tabla += fila;
					} 
					//En el metodo .html se debe agregar el String que construye todos los datos de la tabla (metadatos)	
					$(selListarPor + " table tbody").html(tabla );

				})
			break;
	}
}

//====================================================  
//estados de la vista

export var selIdVista = "#vistaReporte";

export function activarVista() {
	//activar TODOS los eventos que se usen para la vista
	$(selEventNavA).click(clickListar);
}

export function desactivarVista() {
	//desactivar TODOS los eventos que se usen para la vista
	$(selEventNavA).off();
	//limpiar variables de modulo 

}