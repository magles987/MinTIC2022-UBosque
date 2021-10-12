package co.edu.unbosque.tiendaGenerica.model;

import java.io.Serializable;
import java.util.*;

import javax.persistence.*;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity(name="ventas")
public class Venta implements Serializable{

	private static final long serialVersionUID = -3297671241414217165L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
	@GenericGenerator(name = "native", strategy = "native")
	@Column(name="codigo_venta")	
	private long codigo;	
		
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_cliente", nullable = false)
	private Cliente cliente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_usuario", nullable = false)
	private Usuario usuario;        

	@Column(name="iva_venta", nullable = false)	
	private double ivaVenta;
	
	@Column(name="total_venta", nullable = false)	
	private double totalVenta;
	
	@Column(name="valor_venta", nullable = false)	
	private double valorVenta;

	//relacion bidireccional para la relacion cliente-venta
    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleVenta> detalleVentas;

	public long getCodigo() {
		return codigo;
	}

	public void setCodigo(long codigo) {
		this.codigo = codigo;
	}

	@JsonBackReference(value="cliente-venta") //--evita recusrsividad infinita
	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	@JsonBackReference(value="usuario-venta") //--evita recusrsividad infinita
	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public double getIvaVenta() {
		return ivaVenta;
	}

	public void setIvaVenta(double ivaVenta) {
		this.ivaVenta = ivaVenta;
	}

	public double getTotalVenta() {
		return totalVenta;
	}

	public void setTotalVenta(double totalVenta) {
		this.totalVenta = totalVenta;
	}

	public double getValorVenta() {
		return valorVenta;
	}

	public void setValorVenta(double valorVenta) {
		this.valorVenta = valorVenta;
	}

	@JsonManagedReference(value="venta-detalleVenta") //evita bucle de JSON infinito
	public List<DetalleVenta> getDetalleVentas() {
		return detalleVentas;
	}

	public void setDetalleVentas(List<DetalleVenta> detalleVentas) {
		this.detalleVentas = detalleVentas;
	}
			
    
}
