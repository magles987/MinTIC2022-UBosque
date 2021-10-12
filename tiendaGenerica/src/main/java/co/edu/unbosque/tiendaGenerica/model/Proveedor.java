package co.edu.unbosque.tiendaGenerica.model;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity(name="proveedores")
public class Proveedor implements Serializable{

	private static final long serialVersionUID = 7030610712180806782L;
	
	@Id
	@Column(name="nitproveedor")
	private long nit;

	@Column(name="ciudad_proveedor", length = 255, nullable = false)
	private String ciudad;		
	
	@Column(name="direccion_proveedor", length = 255, nullable = false)
	private String direccion;			
			
	@Column(name="nombre_proveedor", length = 255, nullable = false)	
	private String nombre;
	
	@Column(name="telefono_proveedor", length = 255, nullable = false, unique = true)
	private String telefono;

	//relacion bidireccional para la relacion proveedor-producto	
	@OneToMany(mappedBy = "proveedor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)    
    private List<Producto> productos;		
	
	public long getNit() {
		return nit;
	}

	public void setNit(long nit) {
		this.nit = nit;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
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
	
	@JsonManagedReference(value="proveedor-producto") //evita bucle de JSON infinito
	public List<Producto> getProductos() {
		return productos;
	}

	public void setProductos(List<Producto> productos) {
		this.productos = productos;
	}

	@Override
	public String toString() {
		return "Proveedor [cedula=" + nit + ", ciudad=" + ciudad + ", direccion=" + direccion + ", nombre=" + nombre
				+ ", telefono=" + telefono + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(ciudad, direccion, nit, nombre, productos, telefono);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Proveedor other = (Proveedor) obj;
		return Objects.equals(ciudad, other.ciudad) && Objects.equals(direccion, other.direccion) && nit == other.nit
				&& Objects.equals(nombre, other.nombre) && Objects.equals(productos, other.productos)
				&& Objects.equals(telefono, other.telefono);
	}

}
