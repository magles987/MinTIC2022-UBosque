package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.tiendaGenerica.dao.IVentaDao;
import co.edu.unbosque.tiendaGenerica.model.Venta;

@Service
public class VentaService extends MyService<Venta, Long> {
		
	private IVentaDao dao;
	
	@Autowired
	public VentaService(IVentaDao dao) {
		super(dao);
		this.dao = dao;
	}

	

}