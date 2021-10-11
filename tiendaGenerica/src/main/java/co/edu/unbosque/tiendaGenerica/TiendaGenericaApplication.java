package co.edu.unbosque.tiendaGenerica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TiendaGenericaApplication {

	public static void main(String[] args) {
		String pathBase = "/Grupo02Eq06TiendaGenerica";
		System.setProperty("server.servlet.context-path", pathBase);
		SpringApplication.run(TiendaGenericaApplication.class, args);
	}

}
