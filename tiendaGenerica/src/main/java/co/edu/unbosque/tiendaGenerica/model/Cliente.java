package co.edu.unbosque.tiendaGenerica.model;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity(name = "clientes")
public class Cliente implements Serializable {


	private static final long serialVersionUID = 2029805538112887336L;

	@Id
	@Column(name = "cedula_cliente")
	private long cedula;

	@Column(name = "nombre_cliente", length = 255, nullable = false)
	private String nombre;

	@Column(name = "direccion_cliente", length = 255, nullable = false)
	private String direccion;

	@Column(name = "telefono_cliente", length = 255, nullable = false)
	private String telefono;

	@Column(name = "email_cliente", length = 255, nullable = false, unique = true)
	private String email;

	@OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Venta> ventas;

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

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	// relación bidireccional para la relación cliente-venta
	@JsonManagedReference(value="cliente-venta") //evita bucle de JSON infinito 
	public List<Venta> getVentas() {
		return ventas;
	}

	public void setVentas(List<Venta> ventas) {
		this.ventas = ventas;
	}
	
	

}



