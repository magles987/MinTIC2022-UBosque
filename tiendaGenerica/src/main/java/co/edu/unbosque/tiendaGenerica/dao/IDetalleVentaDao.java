package co.edu.unbosque.tiendaGenerica.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.tiendaGenerica.model.DetalleVenta;

public interface IDetalleVentaDao extends JpaRepository<DetalleVenta, Long> {

}