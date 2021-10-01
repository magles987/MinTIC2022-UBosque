package co.edu.unbosque.tiendaGenerica.api;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import co.edu.unbosque.tiendaGenerica.service.MyService;

public abstract class Api<TModel, Tid> {

	/**instancia de Servicio que accede a las consultas*/
	private MyService<TModel, Tid> service; //RECORDAR: JAVA NO SOBREESCRIBE VARIABLES
	
	//nombre campos metadatos (optimizar usando enumeraciones en vez de strings)
	
	/**Nombre del modelo (o entidad) en singular*/
	protected String nomModel_s;
	/**Nombre del modelo (o entidad) en plural*/
	protected String nomModel_p;
	
	/**nombre del campo de metadato para los mensajes*/
	protected String nomMsn = "msn";
	/**nombre del campo de metadato para el tipo de consulta*/
	protected String nomTipoConsulta = "tipoConsulta";
	/**nombre del campo de metadato para un error interno*/
	protected String nomErrorInterno = "errorInterno";
	/**nombre del campo de metadato para un error de validacion del usuario*/
	protected String nomErrorValidacion = "errorValidacion";
	
	/**etiqueta con el tipo de consulta*/
	protected String etiLectura = "lectura";
	protected String etiCreacion = "creacion";
	protected String etiActualizacion = "actualizacion";
	protected String etiEliminacion = "eliminacion";
	
	public Api(MyService<TModel, Tid> service, String nomModel_s, String nomModel_p) {
		this.service = service;
		this.nomModel_s = nomModel_s;
		this.nomModel_p = nomModel_p;
	}

	/**
	 * Conecta y envia la consulta de acuerdo al identificador 
	 * (id) que se haya recibido en la peticion desde el navegador.
	 * @param id el identificador del registro en la BD
	 * @return un objeto ResponseEntity que envuelve los registros 
	 * leidos y los metadatos de la respuesta
	 */
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(Tid id){
		
		HttpStatus httpStatus;
		Map<String, Object> metadataResMap = new HashMap<String, Object>();				

		metadataResMap.put(this.nomTipoConsulta , this.etiLectura);		
		
		try {

			TModel entity = this.service.leerPorId(id);
			httpStatus = HttpStatus.OK;			
			metadataResMap.put(this.nomModel_p, entity);
			
			//enviar mensaje de acuerdo a si se 
			//encontro o no el id
			if(entity != null) {
				metadataResMap.put(this.nomMsn, "se encontro su identificador");
			}else {
				metadataResMap.put(this.nomMsn, "no se encontro su identificador");
			}
						
		} catch (Exception e) {
			e.printStackTrace();
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			metadataResMap.put(this.nomErrorInterno, e.toString());
			metadataResMap.put(this.nomMsn, e.getCause().getMessage());
			metadataResMap.put(this.nomModel_p, null);			
		}	
		
		return new ResponseEntity<Map<String, Object>>(metadataResMap, httpStatus);		

	};	

	/**
	 * conecta y envia la consulta de devolver todo los registros 
	 * de la tabla sin restricciones.
	 * @return un objeto ResponseEntity que envuelve los registros 
	 * leidos y los metadatos de la respuesta
	 */	
	@GetMapping("/listar")
	public ResponseEntity<Map<String, Object>> listar(){
		
		HttpStatus httpStatus;
		Map<String, Object> metadataResMap = new HashMap<String, Object>();				

		metadataResMap.put(this.nomTipoConsulta, this.etiLectura);		
		
		try {

			List<TModel> entities = this.service.leer();
			httpStatus = HttpStatus.OK;
			metadataResMap.put(this.nomModel_p, entities);
						
		} catch (Exception e) {
			e.printStackTrace();
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			metadataResMap.put(this.nomErrorInterno, e.toString());
			metadataResMap.put(this.nomMsn, e.getCause().getMessage());
			metadataResMap.put(this.nomModel_p, new ArrayList<TModel>());			
		}	
		
		return new ResponseEntity<Map<String, Object>>(metadataResMap, httpStatus);		
		
	};
	
	
	/**
	 * procesa la consulta crear un nuevo registro en la tabla el 
	 * cual fue recibido en el cuerpo de la peticion POST desde el navegador.
	 * @param entity objeto que contiene los datos a almacenar
	 * @return un objeto ResponseEntity que envuelve el registro creado y 
	 * los metadatos de la respuesta
	 */		
	public abstract ResponseEntity<Map<String, Object>> guardar(TModel entity);
	
	/**
	 * procesa la consulta actualizar de un registro existente en la tabla el 
	 * cual fue recibido en el cuerpo de la peticion PUT desde el navegador.
	 * @param entity objeto que contiene los datos a almacenar
	 * @return un objeto ResponseEntity que envuelve el registro actualizado y 
	 * los metadatos de la respuesta
	 */		
	public abstract ResponseEntity<Map<String, Object>>  actualizar(TModel entity);
	
	/**
	 * procesa la consulta eliminar de un registro existente en la tabla del cual 
	 * se recibe su identificador (id) en la peticion DELETE desde el navegador.
	 * @param id el identificador del registro en la Base de Datos
	 * @return un objeto ResponseEntity que envuelve el identificador del registro 
	 * eliminado y los metadatos de la respuesta
	 */		
	public abstract ResponseEntity<Map<String, Object>> eliminar(Tid id);

	/**
	 * ejecuta el codigo en comun que tienen las consultas de modificacion 
	 * (crear, actualizar y eliminar).
	 * @param entity objeto que contiene los datos a modificar (sea crear o actualizar) o null (si es para eliminar)
	 * @param id el identificador del registro en la BD que se desea modificar OBLIGATORIO
	 * @param etiModTipo la etiqueta que especifica el tipo de modificacion
	 * @return un objeto ResponseEntity que envuelve el registro (o identificador si 
	 * fue eliminado) y los metadatos para la respuesta al navegador.
	 */		
	protected ResponseEntity<Map<String, Object>> ejecutarModificacion(TModel entity, Tid id, String etiModTipo){
	
		Map<String, Object> metadataResMap = new HashMap<String, Object>();
				
		try {

			//devolvera el tipo de consulta (modificacion para este caso)
			metadataResMap.put(this.nomTipoConsulta, etiModTipo);	
						
			
			//validacion embebida
			Map<String, Object> valMap = this.getMapErroresValidacion(entity, id, etiModTipo);
			if(valMap.size() > 0) {					
				metadataResMap.put(this.nomErrorValidacion, valMap);
				metadataResMap.put(this.nomMsn, "se encontraron errores de validacion");
				return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.BAD_REQUEST);	
			}			
						
			if(etiModTipo.equals(this.etiCreacion)){								
				
				var newEntity = this.service.crear(entity);	
				//--Opcional---
				//devolver el objeto recien creado ()
				metadataResMap.put(this.nomModel_p, newEntity);
				
			} else if(etiModTipo.equals(this.etiActualizacion)) {

				this.service.actualizar(entity);
				//--Opcional---
				//devolver el objeto recien actualizado
				//entity = this.service.leerPorId(id);
				metadataResMap.put(this.nomModel_p, entity);				

			} else if(etiModTipo.equals(this.etiEliminacion)) {
				
				this.service.eliminar(id);
				//--Opcional---
				//devolver null ya que se elimino
				metadataResMap.put(this.nomModel_p, null);				

			} else {
				throw new Exception("no se especifico tipo de modificacion"); //no se sabe que modificacion hacer
			}
							
			metadataResMap.put(this.nomMsn, "el " + this.nomModel_s + " tuvo " + etiModTipo + " exitosa");	
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.OK); 			
						
		} catch (DataIntegrityViolationException e) {
			e.printStackTrace();
			metadataResMap.put(this.nomErrorInterno, e.getCause().getMessage());
			metadataResMap.put(this.nomMsn, "Integridad de datos no respetada por una FK");
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.INTERNAL_SERVER_ERROR);	
		
		} catch (Exception e) {
			e.printStackTrace();
			metadataResMap.put(this.nomErrorInterno, e.getCause().getMessage());
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.INTERNAL_SERVER_ERROR);		
		}
			
	}
	

	//==========================================================
	//validaciones embebidas
	
	/**
	 * valida los campos del registro a modificar de acuerdo al tipo de 
	 * modificacion que se este requiriendo (crear, actualizar o eliminar)
	 * @param entity objeto que contiene los datos validar
	 * @param id el identificador a validar OBLIGATORIO solo en caso que la modificacion sea de tipo eliminacion
	 * @param etiModTipo etiqueta que indica el tipo de modificacion (creacion, actualizacion o eliminacion)
	 * @return un objeto Map<String, Object> con errores de validacion de 
	 * cada campo del registro, si no hubo errores devuelve un Map vacio
	 */		
	protected abstract Map<String, Object> getMapErroresValidacion(TModel entity, Tid id, String etiModTipo) throws Exception;	

}
