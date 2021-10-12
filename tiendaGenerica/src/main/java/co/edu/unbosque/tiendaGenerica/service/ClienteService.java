package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.edu.unbosque.tiendaGenerica.dao.*;
import co.edu.unbosque.tiendaGenerica.model.*;

@Service
public class ClienteService extends MyService<Cliente, Long>{

	private IClienteDao dao;

	@Autowired
	public ClienteService(IClienteDao dao) {
		super(dao);
		this.dao = dao;
	}
	
	public boolean existePorEmail(String email) throws Exception{
		return this.dao.existsByEmail(email);
	}

}