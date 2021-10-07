package co.edu.unbosque.tiendaGenerica.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import co.edu.unbosque.tiendaGenerica.model.Venta;
import co.edu.unbosque.tiendaGenerica.service.VentaService;

@RestController // esta es una clase REST
@RequestMapping("venta")
public class VentaApi extends Api<Venta, Long>{	
	
	/**Servicio (especializado) que accede a las consultas*/
	private VentaService service; 

	@Autowired // 	
	public VentaApi(VentaService service) {
		super(service, "venta", "ventas");
		this.service = service;
	}
	
	@Override
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(@RequestParam(name = "codigo") Long codigo) {		
		return super.leerPorId(codigo);		
	}		
	
	@Override
	@PostMapping("/guardar") 
	public ResponseEntity<Map<String, Object>> guardar(@RequestBody Venta entity) {
		return this.ejecutarModificacion(entity, entity.getCodigo(), this.etiCreacion);			
	}	
	
	@Override
	@PutMapping("/actualizar")
	public ResponseEntity<Map<String, Object>>  actualizar(@RequestBody Venta entity) {
		return this.ejecutarModificacion(entity, entity.getCodigo(), this.etiActualizacion);			
	}
	
	@Override
	@DeleteMapping("/eliminar/{codigo}")
	public ResponseEntity<Map<String, Object>> eliminar(@PathVariable("codigo") Long id) {
		return this.ejecutarModificacion(null, id, this.etiEliminacion);		
	}

	//======================================================================
	//Manejadores embebidos de validacion y errores de la entidad	
	
	@Override
	protected Map<String, Object> getMapErroresValidacion(Venta entity, Long id, String etiModTipo) throws Exception {
		Map<String, Object> valMap = new HashMap<String, Object>();
		
		//validacion para creacion y actualizacion
		if (etiModTipo.equals(this.etiCreacion) 
				|| etiModTipo.equals(this.etiActualizacion)
			) {
			
//			if (entity.getCodigo() == 0) {
//				valMap.put("codigo", "no tiene un valor valido");
//			}
			
			if (entity.getIvaVenta() <= 0) {
				valMap.put("ivaVenta", "ser mayor a 0");	
			}
			
			if (entity.getValorVenta() <= 0) {
				valMap.put("valorVenta", "ser mayor a 0");	
			}		
			
			if (entity.getTotalVenta() <= 0) {
				valMap.put("totalVenta", "ser mayor a 0");	
			}				
			
		} else if(etiModTipo.equals(this.etiEliminacion)) {
			
			if (this.service.existePorId(id) == false) {
				valMap.put("codigo", "no existe");
			}				
			
			if (id <= 0) {
				valMap.put("codigo", "no tiene un valor valido");
			}
						
		} else {
			throw new Exception("no se especifico tipo de modificacion"); //no se sabe que modificacion hacer
		}

		return valMap;
	}
	
}
	
	

