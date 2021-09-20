package co.edu.unbosque.tiendaGenerica.model;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity(name="usuarios")
public class Usuario implements Serializable{
	
	private static final long serialVersionUID = 5266060726788611982L;
	
	@Id
	@Column(name="cedula_usuario")
	private long cedula;
	
	@Column(name="nombre_usuario", length = 255, nullable = false)	
	private String nombre;
	
	@Column(name="email_usuario", length = 255, nullable = false, unique = true)
	private String email;
	
	@Column(name="usuario", length = 255, nullable = false, unique = true)
	private String usuario;
	
	@Column(name="password", length = 255, nullable = false)
	private String password;	

	//relacion bidireccional para la relacion usuario-venta
//	@JsonManagedReference //evita bucle de JSON infinito
//	@JsonIgnore
//    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<Venta> ventas;		

	public long getCedula() {
		return cedula;
	}

	public void setCedula(long cedula) {
		this.cedula = cedula;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsuario() {
		return usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

//	@JsonManagedReference //evita bucle de JSON infinito
//	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//	public List<Venta> getVentas() {
//		return ventas;
//	}
//
//	public void setVentas(List<Venta> venta) {
//		this.ventas = venta;
//	}

	
	
}
