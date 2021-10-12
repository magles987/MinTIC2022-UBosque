package co.edu.unbosque.tiendaGenerica.api;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import co.edu.unbosque.tiendaGenerica.model.Proveedor;
import co.edu.unbosque.tiendaGenerica.service.ProveedorService;

@RestController // esta es una clase REST
@RequestMapping("proveedor")
public class ProveedorApi extends Api<Proveedor, Long>{
	
	/**instancia de Servicio (especializado) que accede a las consultas*/
	private ProveedorService service;
	
	@Autowired
	public ProveedorApi(ProveedorService service) {
		super (service, "proveedor", "proveedores");
		this.service = service;
	}
	
	@Override
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(@RequestParam(name = "nit") Long nit) {
		var r = super.leerPorId(nit);
		return r;
	}
	
	@Override
	@PostMapping("/guardar")
	public ResponseEntity<Map<String, Object>> guardar(@RequestBody Proveedor entity){
		
		return this.ejecutarModificacion(entity, entity.getNit(), this.etiCreacion);
	}
	
	@Override
	@PutMapping("/actualizar")
	public ResponseEntity<Map<String, Object>> actualizar(@RequestBody Proveedor entity){
		
		return this.ejecutarModificacion(entity, entity.getNit(), this.etiActualizacion);
	}
	
	@Override
	@DeleteMapping("/eliminar/{nit}")
	public ResponseEntity<Map<String, Object>> eliminar(@PathVariable("nit") Long id){
		
		return this.ejecutarModificacion(null, id, this.etiEliminacion); 
	}
	
	//=========================================================
	//Manejadores embebidos de validación y errores de la entidad
	
	@Override
	protected Map<String, Object> getMapErroresValidacion(Proveedor entity, Long id, String etiModTipo) throws Exception {
		
		Map<String, Object> valMap = new HashMap<String, Object>();
		
		//Validación para creación y actualización
		if (etiModTipo.equals(this.etiCreacion) || etiModTipo.equals(this.etiActualizacion)) {
			
			if (entity.getNit() == 0) {
				valMap.put("nit", "No tiene un valor valido");
			}
			
			if (entity.getNombre().equals("") || entity.getNombre() == null) {
				valMap.put("nombre", "no puede estar vacio");	
			}
			
			if (entity.getTelefono().equals("") || entity.getTelefono() == null) {
				valMap.put("telefono", "no puede estar vacio");	
			}
			
			//Validación dedicada a creación
			if (etiModTipo.equals(this.etiCreacion) ) {

				if(this.service.existePorId(id)) {
					valMap.put("nit", "Ya existe");
				}				
				
				if (this.service.existePorId(entity.getNit())) {
					valMap.put("proveedor", "ese proveedor ya esta registrado");
				}
				
			}
			
			//Validación dedicada a actualización			
			if (etiModTipo.equals(this.etiActualizacion) ) {
			
			}
		}
		
		else if(etiModTipo.equals(this.etiEliminacion)){
			
			if(this.service.existePorId(id) == false) {
				valMap.put("nit", "no existe");
			}
			
			if (id <= 0) {
				valMap.put("nit", "no tiene un valor valido");
			}				
		}
		
		else {
			throw new Exception("no se especifico tipo de modificacion"); //no se sabe que modificacion hacer
		}
		
		return valMap;
		
	}	
}