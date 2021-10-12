package co.edu.unbosque.tiendaGenerica.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.tiendaGenerica.model.Producto;

public interface IProductoDao extends JpaRepository<Producto, Long> {

}