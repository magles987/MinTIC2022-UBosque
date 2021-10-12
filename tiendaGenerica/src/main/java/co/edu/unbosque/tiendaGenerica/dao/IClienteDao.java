package co.edu.unbosque.tiendaGenerica.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.tiendaGenerica.model.Cliente;

public interface IClienteDao extends JpaRepository<Cliente, Long> {

	boolean existsByEmail(String email);

}