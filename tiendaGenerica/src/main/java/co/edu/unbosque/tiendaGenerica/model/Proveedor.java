package co.edu.unbosque.tiendaGenerica.model;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity(name="proveedores")
public class Proveedor implements Serializable{
	
	private static final long serialVersionUID = -1006717063014183119L;
	
	@Id
	@Column(name="nitproveedor")
	private long nit;
	
	@Column(name="nombre_proveedor", length = 255, nullable = false)	
	private String nombre;
	
	@Column(name="direccion_proveedor", length = 255, nullable = false)
	private String direccion;
	
	@Column(name="telefono_proveedor", length = 255, nullable = false)
	private String telefono;
	
	@Column(name="ciudad_proveedor", length = 255, nullable = false)
	private String ciudad;
	
	@OneToMany(mappedBy = "proveedor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Producto> productos;

	public long getNit() {
		return nit;
	}

	public void setNit(long nit) {
		this.nit = nit;
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

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

	//relacion bidireccional para la relacion proveedor-producto
	@JsonManagedReference(value="proveedor-producto") //evita bucle de JSON infinito
	public List<Producto> getProductos() {
		return productos;
	}

	public void setProductos(List<Producto> productos) {
		this.productos = productos;
	}

	
}