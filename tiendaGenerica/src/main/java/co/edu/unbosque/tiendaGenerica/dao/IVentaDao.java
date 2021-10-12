package co.edu.unbosque.tiendaGenerica.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.tiendaGenerica.model.Venta;

public interface IVentaDao extends JpaRepository<Venta, Long> {

}