package co.edu.unbosque.tiendaGenerica.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.tiendaGenerica.model.Usuario;

public interface IUsuarioDao extends JpaRepository<Usuario, Long> {

	public List<Usuario> findByUsuario(String usuario);

	public List<Usuario> findByEmail(String email);
	
	public boolean existsByUsuario(String usuario);
	
	public boolean existsByEmail(String email);

	public List<Usuario> findByUsuarioAndPassword(String usuario, String password);
	
}
