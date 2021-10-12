package co.edu.unbosque.tiendaGenerica.api;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import co.edu.unbosque.tiendaGenerica.model.Producto;
import co.edu.unbosque.tiendaGenerica.service.ProductoService;



@RestController // esta es una clase REST
@RequestMapping("producto")
public class ProductoApi extends Api<Producto, Long>{

	/**instancia de Servicio (especializado) que accede a las consultas*/
	private ProductoService service; 
	
	@Autowired
	public ProductoApi(ProductoService service) {
		super(service, "producto", "productos");
		this.service = service;
	}
	
	@Override
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(@RequestParam(name = "codigo") Long codigo) {		
		var r = super.leerPorId(codigo);
		return r;
	}		
	
	@PostMapping("/cargar-archivo")
	public ResponseEntity<Map<String, Object>> cargarArchivo(@RequestParam ("file") MultipartFile file) {
		Map<String, Object> metadataResMap = new HashMap<String, Object>();
		
		String cSeparadorFila = "\r\n"; //caracter separador
		String cSeparadorColumna = ","; //caracter separador
		
		if (file.isEmpty()) {
			metadataResMap.put(this.nomErrorValidacion, "csv file");
			metadataResMap.put(this.nomMsn, "el archivo esta vacio");
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.BAD_REQUEST);
		}

		String bf; //buffer para el archivo
		
		try {
	        byte[] bytes = file.getBytes();
	        bf = new String(bytes, java.nio.charset.StandardCharsets.UTF_8);			
		} catch (Exception e) {
			e.printStackTrace();
			metadataResMap.put(this.nomErrorValidacion, ".csv file");
			metadataResMap.put(this.nomMsn, e.getCause().getMessage());
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.BAD_REQUEST);			
		}
		
		try {
			
			//aqui rearmarlo y procesarlo (construir el for para reorganizar el texto)
			
			metadataResMap.put(this.nomMsn, "la creacion de registros VALIDOS fue exitosa");
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
	
	@Override
	@PostMapping("/guardar") 
	public ResponseEntity<Map<String, Object>> guardar(@RequestBody Producto entity) {

		return this.ejecutarModificacion(entity, entity.getCodigo(), this.etiCreacion);		
	}	
	
	@Override
	@PutMapping("/actualizar")
	public ResponseEntity<Map<String, Object>>  actualizar(@RequestBody Producto entity) {
		
		return this.ejecutarModificacion(entity, entity.getCodigo(), this.etiActualizacion);
	}
	
	@Override
	@DeleteMapping("/eliminar/{codigo}")
	public ResponseEntity<Map<String, Object>> eliminar(@PathVariable("codigo") Long id) {
		
		return this.ejecutarModificacion(null, id, this.etiEliminacion);
	}

	//=========================================================
	//Manejadores embebidos de validacion y errores de la entidad
	
	@Override
	protected Map<String, Object> getMapErroresValidacion(Producto entity, Long id, String etiModTipo) throws Exception {
		
		Map<String, Object> valMap = new HashMap<String, Object>();
			
		//validacion para creacion y actualizacion
		if (etiModTipo.equals(this.etiCreacion) 
				|| etiModTipo.equals(this.etiActualizacion)
			) {
		
			if (entity.getCodigo() == 0) {
				valMap.put("codigo", "no tiene un valor valido");
			}
			
			if (entity.getIvacompra() == 0) {
				valMap.put("ivacompra", "no tiene un valor valido");
			}
			
			
			if (entity.getNombre().equals("")) {
				valMap.put("nombre", "no puede estar vacio");	
			}		
			
			if (entity.getPrecioCompra() == 0) {
				valMap.put("precioCompra", "no tiene un valor valido");
			}
			
			
			if (entity.getPrecioVenta() == 0) {
				valMap.put("precioVenta", "no tiene un valor valido");
			}				
				
			//validacion dedicada a Creacion			
			if (etiModTipo.equals(this.etiCreacion) ) {

				if (this.service.existePorId(entity.getCodigo())) {
					valMap.put("codigo", "ese codigo ya esta registrado");
				}
						
			}
			
			//validacion dedicada a Actualizacion			
			if (etiModTipo.equals(this.etiActualizacion) ) {
				
			}			
			
			
		} else if(etiModTipo.equals(this.etiEliminacion)){
			
			if(this.service.existePorId(id) == false) {
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
