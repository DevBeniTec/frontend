import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../../components/header/header.component';

/*
 * =====================================================================
 *  ACTIVIDADES DE ESTA PANTALLA  (detalle en docs/actividades.txt)
 * =====================================================================
 *
 *   0.3  Anadir un boton que lleve a la pantalla de productos (routerLink
 *        a /productos), en la barra de menu de esta pagina.
 *   2.1  CRUD de categorias contra /api/categories (GET, GET/{id}, POST,
 *        PUT/{id}, DELETE/{id}), con botones en cada fila.
 *
 *        OJO: el bloque 2 NO es obligatorio.  Si el CRUD de productos
 *        (bloque 1) ha quedado implementado y entendido de verdad, esto
 *        solo seria repetir lo mismo con otro nombre: es mejor continuar
 *        con el BLOQUE 3 (paginacion, ordenacion y confirmacion) y dejar
 *        las categorias para el final si sobra tiempo.
 *
 *  Igual que en productos, los datos de aqui estan escritos a mano: en
 *  cuanto exista el servicio del punto 0.2 conviene traerlos de la API
 *  (GET /api/categories y GET /api/products).
 */
interface Categoria {
    id: number;
    name: string;
    description: string;
}

/* Pendiente: la imagen del producto (imageUrl) se ha dejado fuera de momento.
   No esta descartada; si se retoma hay que anadirla en los tres componentes
   (producto, categorias y detalle-producto) y en el modelo del backend. */
interface Producto {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
    deactivatedAt: string | null;
    categoryId: number;
    categoryName: string;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MenubarModule,
    TagModule,
    CardModule,
    HeaderComponent
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {

    categorias: Categoria[] = [];

    /** Filas de la tabla: la propia p-table las agrupa por categoryName. */
    productos: Producto[] = [];

    /**
     * Grupos desplegados de la tabla, indexados por nombre de categoria.
     * Arranca con todas las categorias abiertas; el usuario puede plegar la que quiera.
     */
    categoriasDesplegadas: { [nombreCategoria: string]: boolean } = {};

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.desplegarTodas();
    }

    /** Deja todos los grupos de la tabla abiertos. */
    desplegarTodas(): void {
        this.categoriasDesplegadas = {};
        this.productos.forEach(producto => {
            this.categoriasDesplegadas[producto.categoryName] = true;
        });
    }

    getCategoria(nombreCategoria: string): Categoria | undefined {
        return this.categorias.find(categoria => categoria.name === nombreCategoria);
    }

    getProductosPorCategoria(nombreCategoria: string): Producto[] {
        return this.productos.filter(producto => producto.categoryName === nombreCategoria);
    }

    numProductos(nombreCategoria: string): number {
        return this.getProductosPorCategoria(nombreCategoria).length;
    }

    severidadStock(stockQuantity: number): 'success' | 'warning' | 'danger' {
        if (stockQuantity === 0) {
            return 'danger';
        }
        return stockQuantity < 10 ? 'warning' : 'success';
    }

    verDetalle(idProducto: number): void {
        this.router.navigate(['/productos', idProducto]);
    }

}
