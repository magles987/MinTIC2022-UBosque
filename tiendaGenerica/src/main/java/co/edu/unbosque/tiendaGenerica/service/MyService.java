package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

public abstract class MyService<TModel, Tid> {
	
	/**interface  instanciada e inyectada por spring boot para el acceso a metodos-consulta*/	
	private JpaRepository dao; //RECORDAR: JAVA NO SOBREESCRIBE VARIABLES
	
	public MyService(JpaRepository dao) {
		this.dao = dao;
	}

	/**
	 * @return todos los registros de la tabla
	 * */
	public List<TModel> leer() throws Exception {
		return this.dao.findAll(); 
	}
	
	/**
	 * @param id identificador a buscar
	 * @return el registro con ese identificador o null si no lo encontro
	 * */
	public TModel leerPorId(Tid id) throws Exception {
		Optional<TModel> oR = this.dao.findById(id);
		TModel r = oR.isEmpty() ? null : oR.get();
		return r;
	}	
	
	/**
	 * @param id identificador a buscar
	 * @return booleano que indica si existe o no el registro
	 * */	
	public boolean existePorId(Tid id) {
		return this.dao.existsById(id);
	}
	
	/**
	 * crear un nuevo registro
	 * @param entity registro a crear
	 */	
	public TModel crear(TModel entity) throws Exception {
		return (TModel) this.dao.save(entity); 
	}
	
	/**
	 * actualizar un registro
	 * @param entity registro a actualizar
	 */		
	public void actualizar(TModel entity) throws Exception {
		this.dao.save(entity);
		return;
	}	
	
	/**
	 * eliminar nuevo registro
	 * @param id identificador de registro a eliminar
	 */		
	public void eliminar(Tid id) throws Exception {
		this.dao.deleteById(id);
		return;
	}	
	
}
