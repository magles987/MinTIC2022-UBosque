package co.edu.unbosque.tiendaGenerica.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * controlador generico
 * */
@Controller 
public class indexApi {

	/**
	 * recibe la peticion inicial
	 * */
	@GetMapping()
	public String descargarApi() {		
		return "index";	
	}
}

