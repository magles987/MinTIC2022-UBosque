package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.tiendaGenerica.dao.*;
import co.edu.unbosque.tiendaGenerica.model.*;


@Service
public class ProveedorService extends MyService<Proveedor, Long>{
	
	private IProveedorDao dao;

	@Autowired	
	public ProveedorService(IProveedorDao dao) {
		super(dao);
		this.dao = dao;
	}

	public boolean existePorTelefono(String telefono) throws Exception{
		return this.dao.existsByTelefono(telefono);
	}	

}