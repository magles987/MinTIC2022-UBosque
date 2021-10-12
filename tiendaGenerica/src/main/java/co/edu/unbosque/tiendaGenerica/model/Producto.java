package co.edu.unbosque.tiendaGenerica.model;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity(name="productos")
public class Producto implements Serializable{
	
	private static final long serialVersionUID = 5358928206284123046L;

	@Id
	@Column(name="codigo_producto")
	private long codigo;
	
	@Column(name="ivacompra", nullable = false)	
	private double ivacompra;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nitproveedor", nullable = false)
	private Proveedor proveedor;	    
    	
	@Column(name="nombre_producto", length = 255, nullable = false)	
	private String nombre;
	
	@Column(name="precio_compra", nullable = false)	
	private double precioCompra;
	
	@Column(name="precio_venta", nullable = false)	
	private double precioVenta;	

	@OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleVenta> detalleVentas;
	
	public long getCodigo() {
		return codigo;
	}

	public void setCodigo(long codigo) {
		this.codigo = codigo;
	}

	public double getIvacompra() {
		return ivacompra;
	}

	public void setIvacompra(double ivacompra) {
		this.ivacompra = ivacompra;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public double getPrecioCompra() {
		return precioCompra;
	}

	public void setPrecioCompra(double precioCompra) {
		this.precioCompra = precioCompra;
	}

	public double getPrecioVenta() {
		return precioVenta;
	}

	public void setPrecioVenta(double precioVenta) {
		this.precioVenta = precioVenta;
	}

	@JsonBackReference(value="proveedor-producto") //evita bucle de JSON infinito	
	public Proveedor getProveedor() {
		return proveedor;
	}

	public void setProveedor(Proveedor proveedor) {
		this.proveedor = proveedor;
	}

	//relación bidireccional para producto-detalle venta 
	@JsonManagedReference(value="producto-detalleVenta") //evita bucle de JSON infinito
	public List<DetalleVenta> getDetalleVentas() {
		return detalleVentas;
	}

	public void setDetalleVentas(List<DetalleVenta> detalleVentas) {
		this.detalleVentas = detalleVentas;
	}
		
	
}