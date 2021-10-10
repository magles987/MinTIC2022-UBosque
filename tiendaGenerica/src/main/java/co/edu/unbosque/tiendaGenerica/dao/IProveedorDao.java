package co.edu.unbosque.tiendaGenerica.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.tiendaGenerica.model.Proveedor;

public interface IProveedorDao extends JpaRepository<Proveedor, Long> {

}


