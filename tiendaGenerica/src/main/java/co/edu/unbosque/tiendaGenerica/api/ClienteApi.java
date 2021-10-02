package co.edu.unbosque.tiendaGenerica.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import co.edu.unbosque.tiendaGenerica.model.Cliente;
import co.edu.unbosque.tiendaGenerica.service.ClienteService;

@RestController // Esta es una clase REST.
@RequestMapping("cliente")
public class ClienteApi extends Api<Cliente, Long>{

	/**Instancia de servicio (especializado) que accede a las consultas*/
	private ClienteService service; 
	
	@Autowired
	public ClienteApi(ClienteService service) {
		super(service, "cliente", "clientes");
		this.service = service;
	}
	
	@Override
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(@RequestParam(name = "cedula") Long cedula) {		
		var r = super.leerPorId(cedula);
		return r;
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
	//Manejadores embebidos de validación y errores de la entidad
	
	@Override
	protected Map<String, Object> getMapErroresValidacion(Cliente entity, Long id, String etiModTipo) throws Exception {
		
		Map<String, Object> valMap = new HashMap<String, Object>();
			
		//Validación para crear y actualizar
		if (etiModTipo.equals(this.etiCreacion) 
				|| etiModTipo.equals(this.etiActualizacion)
			) {
		
			if (entity.getCedula() == 0) {
				valMap.put("cedula", "No tiene un valor valido");
			}
			
			if (entity.getNombre().equals("") || entity.getNombre() == null) {
				valMap.put("nombre", "No puede estar vacio");	
			}
			
			if (entity.getEmail().equals("") || entity.getEmail() == null) {
				valMap.put("email", "No puede estar vacio");	
			}		
			
			//Validación dedicada a creación			
			if (etiModTipo.equals(this.etiCreacion) ) {
				
				if(this.service.existePorId(id)) {
					valMap.put("cedula", "Ya existe");
				}
				
				if (this.service.existePorEmail(entity.getEmail())) {
					valMap.put("email", "El email ya esta registrado");
				}				
			}
			
			//Validación dedicada a actualización			
			if (etiModTipo.equals(this.etiActualizacion) ) {
				
			}			
			
			
		} else if(etiModTipo.equals(this.etiEliminacion)){
			
			if(this.service.existePorId(id) == false) {
				valMap.put("cedula", "No existe");
			}
			
			if (id <= 0) {
				valMap.put("cedula", "no tiene un valor valido");
			}			
			
		} else {
			throw new Exception("no se especifico tipo de modificacion"); //No se sabe que modificación hacer
		}
		
		return valMap;
		
	}
	
	
}