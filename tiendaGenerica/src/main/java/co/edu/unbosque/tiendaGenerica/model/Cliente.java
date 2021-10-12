
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
	@Column(name="cedula_cliente")
	private long cedula;
	
	@Column(name="direccion_cliente", length = 255, nullable = false)
	private String direccion;			
	
	@Column(name="email_cliente", length = 255, nullable = false, unique = true)
	private String email;		
	
	@Column(name="nombre_cliente", length = 255, nullable = false)	
	private String nombre;
	
	@Column(name="telefono_cliente", length = 255, nullable = false, unique = true)
	private String telefono;

	//relacion bidireccional para la relacion cliente-venta
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Venta> ventas;

	public long getCedula() {
		return cedula;
	}

	public void setCedula(long cedula) {
		this.cedula = cedula;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	@JsonManagedReference(value="cliente-venta") //evita bucle de JSON infinito 	
	public List<Venta> getVentas() {
		return ventas;
	}

	public void setVentas(List<Venta> ventas) {
		this.ventas = ventas;
	}	

	
	@Override
	public String toString() {
		return "Cliente [cedula=" + cedula + ", direccion=" + direccion + ", email=" + email + ", nombre=" + nombre
				+ ", telefono=" + telefono + ", ventas=" + ventas + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(cedula, direccion, email, nombre, telefono, ventas);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Cliente other = (Cliente) obj;
		return cedula == other.cedula && Objects.equals(direccion, other.direccion)
				&& Objects.equals(email, other.email) && Objects.equals(nombre, other.nombre)
				&& Objects.equals(telefono, other.telefono) && Objects.equals(ventas, other.ventas);
	}	

}

