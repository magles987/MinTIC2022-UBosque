package co.edu.unbosque.tiendaGenerica.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.tiendaGenerica.model.Producto;


public interface IProductoDao extends JpaRepository<Producto, Long> {

	
}