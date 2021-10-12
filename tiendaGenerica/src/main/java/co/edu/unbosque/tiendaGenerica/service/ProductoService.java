package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.tiendaGenerica.dao.IProductoDao;
import co.edu.unbosque.tiendaGenerica.model.Producto;


@Service
public class ProductoService extends MyService<Producto, Long>{
	
	/**interface  instanciada e inyectada por spring boot para el acceso a metodos-consulta*/
	private IProductoDao dao;	

	@Autowired
	public ProductoService(IProductoDao dao) {
		super(dao);
		this.dao = dao;		
	}
	
}
