package co.edu.unbosque.tiendaGenerica.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller 
public class indexApi {

	@GetMapping()
	public String descargarApi() {		
		return "index";	
	}
}
