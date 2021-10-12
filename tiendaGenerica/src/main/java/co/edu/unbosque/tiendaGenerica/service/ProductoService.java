package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.tiendaGenerica.dao.*;
import co.edu.unbosque.tiendaGenerica.model.*;

@Service
public class ProductoService extends MyService<Producto, Long> {
	
	IProductoDao dao;
	
	@Autowired	
	public ProductoService(IProductoDao dao) {
		super(dao);
		this.dao = dao;
	}

	public void crearMultiple(List<Producto> entities) {
		this.dao.saveAll(entities);
		return;
	}
	

}
