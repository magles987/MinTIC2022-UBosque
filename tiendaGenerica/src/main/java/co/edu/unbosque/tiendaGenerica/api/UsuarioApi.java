package co.edu.unbosque.tiendaGenerica.api;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import co.edu.unbosque.tiendaGenerica.service.UsuarioService;
import co.edu.unbosque.tiendaGenerica.model.Usuario;

@RestController // esta es una clase REST
@RequestMapping("usuario")
public class UsuarioApi extends Api<Usuario, Long>{

	/**instancia de Servicio (especializado) que accede a las consultas*/
	private UsuarioService service; 
	
	@Autowired
	public UsuarioApi(UsuarioService service) {
		super(service, "usuario", "usuarios");
		this.service = service;
	}
	
	@Override
	@GetMapping("/leerPorId")
	public ResponseEntity<Map<String, Object>> leerPorId(@RequestParam(name = "cedula") Long cedula) {		
		var r = super.leerPorId(cedula);
		return r;
	}		
		
	@Override
	@GetMapping("/listar")
	public ResponseEntity<Map<String, Object>> listar() {		
		var r = super.listar();
		return r;
	}	
	
	//exclusivo para el login:
	@GetMapping("login")
	public ResponseEntity<Map<String, Object>> login(@RequestParam(name = "usuario") String usuario, @RequestParam(name = "password") String password){
		
		Usuario entity = new Usuario();		
		entity.setUsuario(usuario);
		entity.setPassword(password);
		
		Map<String, Object> metadataResMap = new HashMap<String, Object>();
		
		try {
			
			Map<String, Object> valMap = this.getMapErroresValidacionLogin(entity);
			if(valMap.size() > 0) {
				metadataResMap.put(this.nomErrorValidacion, valMap);
				metadataResMap.put(this.nomMsn, "algunos campos estan vacios");
				return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.BAD_REQUEST);
			}
			
			List<Usuario> uLogin = this.service.leerPorUsuarioYPass(entity.getUsuario(), entity.getPassword());			
			
			if(uLogin.size() <= 0 || uLogin == null) {
				metadataResMap.put(this.nomMsn, "usuario o contraseña erroneos");
				return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.BAD_REQUEST);
			}			
					
			//DTO artesanal --- falta optimizacion---
			//reiniciar la instancia entity
			entity = uLogin.get(0);
			entity.setPassword(""); //NO ENVIAR EL PASSWORD
			metadataResMap.put(this.nomModel_p, entity);
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.OK);			
			
		} catch (Exception e) {
			e.printStackTrace();
			metadataResMap.put(this.nomErrorInterno, e.getCause().getMessage());
			return new ResponseEntity<Map<String, Object>>(metadataResMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Override
	@PostMapping("/guardar") 
	public ResponseEntity<Map<String, Object>> guardar(@RequestBody Usuario entity) {

		return this.ejecutarModificacion(entity, entity.getCedula(), this.etiCreacion);		
	}	
	
	@Override
	@PutMapping("/actualizar")
	public ResponseEntity<Map<String, Object>>  actualizar(@RequestBody Usuario entity) {
		
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
	protected Map<String, Object> getMapErroresValidacion(Usuario entity, Long id, String etiModTipo) throws Exception {
		
		Map<String, Object> valMap = new HashMap<String, Object>();
			
		//validacion para creacion y actualizacion
		if (etiModTipo.equals(this.etiCreacion) 
				|| etiModTipo.equals(this.etiActualizacion)
			) {
		
			if (entity.getCedula() == 0) {
				valMap.put("cedula", "no tiene un valor valido");
			}
			
			if (entity.getNombre().equals("") || entity.getNombre() == null) {
				valMap.put("nombre", "no puede estar vacio");	
			}
			
			if (entity.getEmail().equals("") || entity.getEmail() == null) {
				valMap.put("email", "no puede estar vacio");	
			}		
			
			if (entity.getUsuario().equals("") || entity.getUsuario() == null) {
				valMap.put("usuario", "no puede estar vacio");	
			}			

			if (entity.getPassword().equals("") || entity.getPassword() == null) {
				valMap.put("password", "no puede estar vacio");	
			}						
				
			//validacion dedicada a Creacion			
			if (etiModTipo.equals(this.etiCreacion) ) {

				if (this.service.existePorUsuario(entity.getUsuario())) {
					valMap.put("usuario", "ese usuario ya esta registrado");
				}
				
				if (this.service.existePorEmail(entity.getEmail())) {
					valMap.put("email", "ese email ya esta registrado");
				}				
			}
			
			//validacion dedicada a Actualizacion			
			if (etiModTipo.equals(this.etiActualizacion) ) {
				
			}			
			
			
		} else if(etiModTipo.equals(this.etiEliminacion)){
			
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
	
	//exclusivo para el login
	
	private Map<String, Object> getMapErroresValidacionLogin(Usuario entity){
		
		Map<String, Object> valMap = new HashMap<String, Object>();
		
		if(entity.getUsuario().equals("") || entity.getUsuario() == null) {
			valMap.put("usuario", "no puede estar vacio");
		}

		if(entity.getPassword().equals("") || entity.getPassword() == null) {
			valMap.put("password", "no puede estar vacio");
		}		
		
		return valMap;
	} 
	
}

