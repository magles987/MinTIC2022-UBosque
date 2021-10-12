package co.edu.unbosque.tiendaGenerica.model;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity(name="detalle_ventas")
public class DetalleVenta implements Serializable{

	private static final long serialVersionUID = -4665625882872084050L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
	@GenericGenerator(name = "native", strategy = "native")	
	@Column(name="codigo_detalle_venta")
	private long codigo;
	
	@Column(name="cantidad_producto", nullable = false)
	private int cantidadProducto;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codigo_producto", nullable = false)
	private Producto producto;  

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codigo_venta", nullable = false)
	private Venta venta;     
    
	@Column(name="valor_total", nullable = false)	
	private double valorTotal;
	
	@Column(name="valor_venta", nullable = false)	
	private double valorVenta;
	
	@Column(name="valor_iva", nullable = false)	
	private double valorIva;

	public long getCodigo() {
		return codigo;
	}

	public void setCodigo(long codigo) {
		this.codigo = codigo;
	}

	public int getCantidadProducto() {
		return cantidadProducto;
	}

	public void setCantidadProducto(int cantidadProducto) {
		this.cantidadProducto = cantidadProducto;
	}

	@JsonBackReference(value="producto-detalleVenta") //evita bucle de JSON infinito	
	public Producto getProducto() {
		return producto;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	@JsonBackReference(value="venta-detalleVenta") //evita bucle de JSON infinito
	public Venta getVenta() {
		return venta;
	}

	public void setVenta(Venta venta) {
		this.venta = venta;
	}

	public double getValorTotal() {
		return valorTotal;
	}

	public void setValorTotal(double valorTotal) {
		this.valorTotal = valorTotal;
	}

	public double getValorlVenta() {
		return valorVenta;
	}

	public void setValorlVenta(double valorlVenta) {
		this.valorVenta = valorlVenta;
	}

	public double getValorIva() {
		return valorIva;
	}

	public void setValorIva(double valorIva) {
		this.valorIva = valorIva;
	}

	@Override
	public String toString() {
		return "DetalleVenta [codigo=" + codigo + ", cantidadProducto=" + cantidadProducto + ", producto=" + producto
				+ ", venta=" + venta + ", valorTotal=" + valorTotal + ", valorlVenta=" + valorVenta + ", valorIva="
				+ valorIva + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(cantidadProducto, codigo, producto, valorIva, valorTotal, valorVenta, venta);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DetalleVenta other = (DetalleVenta) obj;
		return cantidadProducto == other.cantidadProducto && codigo == other.codigo
				&& Objects.equals(producto, other.producto)
				&& Double.doubleToLongBits(valorIva) == Double.doubleToLongBits(other.valorIva)
				&& Double.doubleToLongBits(valorTotal) == Double.doubleToLongBits(other.valorTotal)
				&& Double.doubleToLongBits(valorVenta) == Double.doubleToLongBits(other.valorVenta)
				&& Objects.equals(venta, other.venta);
	}
	
}