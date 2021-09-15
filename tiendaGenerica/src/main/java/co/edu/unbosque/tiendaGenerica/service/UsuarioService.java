package co.edu.unbosque.tiendaGenerica.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import co.edu.unbosque.tiendaGenerica.dao.IUsuarioDao;
import co.edu.unbosque.tiendaGenerica.model.Usuario;

@Service
public class UsuarioService extends MyService<Usuario, Long>{
	
	/**interface  instanciada e inyectada por spring boot para el acceso a metodos-consulta*/
	private IUsuarioDao dao;	

	@Autowired
	public UsuarioService(IUsuarioDao dao) {
		super(dao);
		this.dao = dao;		
	}
	
	/**
	 * ejecuta la lectura personalizada (por usuario y password)
	 * @param usuario a buscar
	 * @param password a buscar
	 * @return una list de Usuarios encontrados
	 * */
	public List<Usuario> leerPorUsuarioYPass(String usuario, String password) throws Exception{
		return this.dao.findByUsuarioAndPassword(usuario, password);
	}
	
	/**
	 * ejecuta la lectura personalizada (por usuario)
	 * @param usuario  a buscar
	 * @return una list de Usuarios encontrados
	 * */	
	public List<Usuario> leerPorUsuario(String usuario) throws Exception{
		return this.dao.findByUsuario(usuario);
	}
		
	/**
	 * ejecuta la lectura personalizada (por email)
	 * @param email a buscar
	 * @return una list de Usuarios encontrados
	 * */		
	public List<Usuario> leerPorEmail(String email) throws Exception{
		return this.dao.findByEmail(email);
	}		
	
	/**
	 * ejecuta la lectura personalizada (por usuario)
	 * @param usuario a buscar
	 * @return un boolean indicando si el usuario existe
	 * */		
	public boolean existePorUsuario(String usuario) throws Exception{
		return this.dao.existsByUsuario(usuario);
	}	
	
	/**
	 * ejecuta la lectura personalizada (por email)
	 * @param email a buscar
	 * @return un boolean indicando si el email existe
	 * */		
	public boolean existePorEmail(String email) throws Exception{
		return this.dao.existsByEmail(email);
	}		
	
}
