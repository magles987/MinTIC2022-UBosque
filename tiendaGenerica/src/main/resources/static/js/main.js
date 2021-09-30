import * as AuthVista from "./vistas/authVista.js";
import * as UsuarioVista from "./vistas/usuarioVista.js";
import * as ProveedorVista from "./vistas/proveedorVista.js";
import * as ClienteVista from "./vistas/clienteVista.js";
import * as ProductoVista from "./vistas/productoVista.js";
import * as VentaVista from "./vistas/ventaVista.js";
//--reportes vista falta---

//================================================
$(document).ready(function(){
    //
    $(`nav a`).click((e)=>{
        let selIdVista = `#${e.target.getAttribute("for")}`;
        actualizarVista(selIdVista)
    });

    //actualiza a la vista incial al momento de iniciar la aplicacion
    //actualizarVista(AuthVista.selIdVista);

    //solo en pruebas:
    AuthVista.activarVista();  
    UsuarioVista.activarVista();   
    ClienteVista.activarVista(); 
    ProveedorVista.activarVista();  
    VentaVista.activarVista();   
    ProductoVista.activarVista();
});

//================================================
/**
 * permite inicializar la vista escogida y cerrar 
 * las otras
 * @param selIdVista el id del elemento html que 
 * le corresponde la vista selccionada por el 
 * usuario
 */
function actualizarVista(selIdVista) {
    
    cerrarVistas();

    //seleccion de vista a mostrar
    switch (selIdVista) {

        case AuthVista.selIdVista:
            AuthVista.activarVista();            
            break;   

        case UsuarioVista.selIdVista:
            UsuarioVista.activarVista();            
            break;    
            
        case ClienteVista.selIdVista:
            ClienteVista.activarVista();            
            break;       
            
        case ProveedorVista.selIdVista:
            ProveedorVista.activarVista();            
            break;               
            
        case ProductoVista.selIdVista:
            ProductoVista.activarVista();            
            break; 

        case VentaVista.selIdVista:
            VentaVista.activarVista();            
            break;     

        default:
            break;
    }

    $(selIdVista).show();
}

/**
 * cierra Todas las vistas sin excepcion
 */
function cerrarVistas() {
    
    AuthVista.desactivarVista();
    $(AuthVista.selIdVista).hide();

    UsuarioVista.desactivarVista();
    $(UsuarioVista.selIdVista).hide();

    ClienteVista.desactivarVista();
    $(ClienteVista.selIdVista).hide();    

    ProveedorVista.desactivarVista();
    $(ProveedorVista.selIdVista).hide();      

    ProductoVista.desactivarVista();
    $(ProductoVista.selIdVista).hide();      

    VentaVista.desactivarVista();
    $(VentaVista.selIdVista).hide();     
}