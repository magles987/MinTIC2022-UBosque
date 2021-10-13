package co.edu.unbosque.tiendaGenerica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class TiendaGenericaApplication extends SpringBootServletInitializer{

	/**
	 * metodo alternativo SOLO para usar con tomcat externo y generar los .war
	 */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    	return application.sources(TiendaGenericaApplication.class);
    }	
	
	public static void main(String[] args) {
		String pathBase = "/Grupo02Eq06TiendaGenerica";
		System.setProperty("server.servlet.context-path", pathBase);
		SpringApplication.run(TiendaGenericaApplication.class, args);
	}

}
