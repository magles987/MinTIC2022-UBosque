package co.edu.unbosque.tiendaGenerica.api;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import co.edu.unbosque.tiendaGenerica.model.*;
import co.edu.unbosque.tiendaGenerica.service.*;


@RestController // esta es una clase REST
@RequestMapping("producto")
public class ProductoApi extends Api<Producto, Long>{
		
	/**Servicio (especializado) que accede a las consultas*/
	private ProductoService service; 
	
	@Autowired
	private ProveedorService proveedorService;
	
	@Autowired // 
	public ProductoApi(ProductoService service) {
		super(service, "producto", "productos");
		this.service = service;
	}
	
	
	@Override
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(@RequestParam(name = "codigo") Long codigo) {		
		return super.leerPorId(codigo);
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
	
	@PostMapping("/cargar-archivo")
	public ResponseEntity<Map<String, Object>> cargarArchivo(@RequestParam ("file") MultipartFile file) {

		Map<String, Object> metadataResMap = new HashMap<String, Object>();
		
		metadataResMap.put(this.nomTipoConsulta, etiCreacion);	
		
		String cSeparadorFila = "\r\n"; //caracter separador
		String cSeparadorColumna = ","; //caracter separador
		
		if (file.isEmpty()) {
			metadataResMap.put(this.nomErrorValidacion, "csv file");
			metadataResMap.put(this.nomMsn, "el archivo esta vacio");
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.BAD_REQUEST);
		}
		
		//---Cuidado: no se puede verificar la extension----
				
		//procesar archivo
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
						
		//procesar registros del archivo
		try {
			
			String[] filasPro = bf.split(cSeparadorFila);
			int cantProds = filasPro.length;
			ArrayList<Producto> productos = new ArrayList<Producto>();
			Map<String, Object> valsMap = new HashMap<String, Object>();
			
			for (int i = 0; i < cantProds; i++) {
				String[] columnasPro = filasPro[i].split(cSeparadorColumna);

				if(columnasPro.length <= 0) {
					break;
				}
				
				Producto producto = new Producto();
				 				
				//---cuidado con el orden de las columnas---
				producto.setCodigo(Long.parseLong(columnasPro[0]));
				producto.setNombre(columnasPro[1]);
				Proveedor pdr = new Proveedor();
				pdr.setNit(Long.parseLong(columnasPro[2]));
				producto.setProveedor(pdr);
				producto.setPrecioCompra(Double.parseDouble(columnasPro[3]));
				producto.setIvacompra(Double.parseDouble(columnasPro[4]));		
				producto.setPrecioVenta(Double.parseDouble(columnasPro[5]));
				
				var valMap = this.getMapErroresValidacion(producto, producto.getCodigo(), this.etiCreacion);
				
				if(valMap.size() > 0) {					
					String k = "producto" + i;
					valsMap.put(k, valMap);
					continue;	
				}else {
					productos.add(producto);
				}								
			}
								
			//determina si todos los producto no son validos
			if(cantProds == valsMap.size()) {
				metadataResMap.put(this.nomErrorValidacion, valsMap);
				metadataResMap.put(this.nomMsn, "se encontraron errores de validacion en todos los productos del archivo o ya estan creados");
				return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.BAD_REQUEST);					
			}
					
			//determina si algunos productos no son validos
			if(valsMap.size() > 0) {				
				metadataResMap.put(this.nomErrorValidacion, valsMap);				
			}				
			
			//se algunos o todos se almacenan los registros validos
			
			this.service.crearMultiple(productos);
			
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
			
			if (entity.getIvacompra() <= 0) {
				valMap.put("ivaCompra", "ser mayor a 0");	
			}
			
			if (entity.getNombre().equals("") || entity.getNombre() == null) {
				valMap.put("nombre", "ser mayor a 0");	
			}		
			
			if (entity.getPrecioVenta() <= 0) {
				valMap.put("precioVenta", "ser mayor a 0");	
			}			

			if (entity.getPrecioCompra() <= 0) {
				valMap.put("valorTotal", "ser mayor a 0");	
			}			
			
			//validacion dedicada a Creacion			
			if (etiModTipo.equals(this.etiCreacion) ) {

				if(this.service.existePorId(id)) {
					valMap.put("codigo", "Ya existe");
				}				
							
			}
			
			//validacion dedicada a Actualizacion			
			if (etiModTipo.equals(this.etiActualizacion) ) {
				
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