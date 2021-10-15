package co.edu.unbosque.tiendaGenerica.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import co.edu.unbosque.tiendaGenerica.model.*;
import co.edu.unbosque.tiendaGenerica.service.*;

@RestController // esta es una clase REST
@RequestMapping("cliente")
public class ClienteApi extends Api<Cliente, Long>{
	
	/**Servicio (especializado) que accede a las consultas*/
	private ClienteService service; //evita el cast

	@Autowired
	public ClienteApi(ClienteService service) {
		super(service, "cliente", "clientes");
		this.service = service;
	}
	
	@Override
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(@RequestParam(name = "cedula") Long cedula) {		
		return super.leerPorId(cedula);
	}		
	
	
	@GetMapping("/listar-con-venta")
	public ResponseEntity<Map<String, Object>> listarConVenta() {
		//---NO IMPLEMENTADO TODAVIA---
		Map<String, Object> metadataResMap = new HashMap<String, Object>();	
		return new ResponseEntity<Map<String,Object>>(metadataResMap, HttpStatus.NOT_IMPLEMENTED); 		
	}		
	
	@Override
	@PostMapping("/guardar") 
	public ResponseEntity<Map<String, Object>> guardar(@RequestBody Cliente entity) {
		return this.ejecutarModificacion(entity, entity.getCedula(), this.etiCreacion);	
	}	
	
	@Override
	@PutMapping("/actualizar")
	public ResponseEntity<Map<String, Object>>  actualizar(@RequestBody Cliente entity) {
		return this.ejecutarModificacion(entity, entity.getCedula(), this.etiActualizacion);	
	}
	
	@Override
	@DeleteMapping("/eliminar/{cedula}")
	public ResponseEntity<Map<String, Object>> eliminar(@PathVariable("cedula") Long id) {
		return this.ejecutarModificacion(null, id, this.etiEliminacion);	
	}

	//=========================================================
	//Manejadores embebidos de validacion y errores de la entidad

	@Override
	protected Map<String, Object> getMapErroresValidacion(Cliente entity, Long id, String etiModTipo) throws Exception {
		Map<String, Object> valMap = new HashMap<String, Object>();
		
		//validacion para creacion y actualizacion
		if (etiModTipo.equals(this.etiCreacion) 
				|| etiModTipo.equals(this.etiActualizacion)
			) {
			
			//validacion para creacion y actualizacion
			if (entity.getCedula() == 0) {
				valMap.put("cedula", "no tiene un valor valido");
			}
			
			if (entity.getNombre().equals("") || entity.getNombre() == null) {
				valMap.put("nombre", "no puede estar vacio");	
			}
			
			if (entity.getEmail().equals("") || entity.getEmail() == null) {
				valMap.put("email", "no puede estar vacio");	
			}		
			
			if (entity.getDireccion().equals("") || entity.getDireccion() == null) {
				valMap.put("direccion", "no puede estar vacio");	
			}			

			if (entity.getTelefono().equals("") || entity.getTelefono() == null) {
				valMap.put("telefono", "no puede estar vacio");	
			}			
			
			//validacion dedicada a Creacion			
			if (etiModTipo.equals(this.etiCreacion) ) {

				if(this.service.existePorId(id)) {
					valMap.put("cedula", "Ya existe");
				}				
				
				if (this.service.existePorEmail(entity.getEmail())) {
					valMap.put("email", "ese email ya esta registrado");
				}			
				
				if(this.service.existePorTelefono(entity.getTelefono())) {
					valMap.put("telefono", "Ya existe");
				}	
				
			}
			
			//validacion dedicada a Actualizacion			
			if (etiModTipo.equals(this.etiActualizacion) ) {
				
				if (this.service.existePorEmail(entity.getEmail())) {
					valMap.put("email", "ese email ya esta registrado");
				}					
				
				if(this.service.existePorTelefono(entity.getTelefono())) {
					valMap.put("telefono", "Ya existe");
				}
				
			}				
						
		} else if(etiModTipo.equals(this.etiEliminacion)) {
			
			if(this.service.existePorId(id) == false) {
				valMap.put("cedula", "no existe");
			}
			
			if (id <= 0) {
				valMap.put("cedula", "no tiene un valor valido");
			}	
						
		} else {
			throw new Exception("no se especifico tipo de modificacion"); //no se sabe que modificacion hacer
		}		

		return valMap;		

	}

	
}
