package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.tiendaGenerica.dao.IDetalleVentaDao;
import co.edu.unbosque.tiendaGenerica.model.DetalleVenta;

@Service
public class DetalleVentaService extends MyService<DetalleVenta, Long> {
	
	private IDetalleVentaDao dao;

	@Autowired	
	public DetalleVentaService(IDetalleVentaDao dao) {
		super(dao);
		this.dao = dao;
	}



}