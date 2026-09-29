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

    categorias: Categoria[] = [
        {
            id: 1,
            name: 'Smartphones',
            description: 'Telefonos moviles de ultima generacion'
        },
        {
            id: 2,
            name: 'Ordenadores',
            description: 'Portatiles y equipos de sobremesa para trabajo y estudio'
        },
        {
            id: 3,
            name: 'Auriculares',
            description: 'Auriculares con y sin cable, con cancelacion de ruido'
        },
        {
            id: 4,
            name: 'Smartwatches',
            description: 'Relojes inteligentes con seguimiento de actividad y salud'
        }
    ];

    /** Filas de la tabla: la propia p-table las agrupa por categoryName. */
    productos: Producto[] = [
        {
            id: 1,
            name: 'iPhone 15',
            description: 'Smartphone de Apple Super Retina XDR',
            price: 800,
            stockQuantity: 10,
            createdAt: '2026-01-15T09:00:00.000Z',
            updatedAt: '2026-01-15T09:00:00.000Z',
            deactivatedAt: null,
            categoryId: 1,
            categoryName: 'Smartphones'
        },
        {
            id: 2,
            name: 'Samsung Galaxy S24',
            description: 'Smartphone Samsung de gama alta con pantalla AMOLED y camara profesional',
            price: 900,
            stockQuantity: 9,
            createdAt: '2026-01-20T09:00:00.000Z',
            updatedAt: '2026-01-20T09:00:00.000Z',
            deactivatedAt: null,
            categoryId: 1,
            categoryName: 'Smartphones'
        },
        {
            id: 3,
            name: 'MacBook Air M3',
            description: 'Portatil ligero y potente con chip Apple M3, ideal para trabajo y estudio',
            price: 1199,
            stockQuantity: 50,
            createdAt: '2026-02-03T09:00:00.000Z',
            updatedAt: '2026-02-03T09:00:00.000Z',
            deactivatedAt: null,
            categoryId: 2,
            categoryName: 'Ordenadores'
        },
        {
            id: 4,
            name: 'Dell XPS 15',
            description: 'Portatil de alto rendimiento con pantalla de gran calidad y procesador Intel',
            price: 1499,
            stockQuantity: 33,
            createdAt: '2026-02-10T09:00:00.000Z',
            updatedAt: '2026-02-10T09:00:00.000Z',
            deactivatedAt: null,
            categoryId: 2,
            categoryName: 'Ordenadores'
        },
        {
            id: 5,
            name: 'Sony WH-1000XM5',
            description: 'Auriculares inalambricos con cancelacion de ruido y sonido de alta calidad',
            price: 349,
            stockQuantity: 7,
            createdAt: '2026-03-01T09:00:00.000Z',
            updatedAt: '2026-03-01T09:00:00.000Z',
            deactivatedAt: null,
            categoryId: 3,
            categoryName: 'Auriculares'
        },
        {
            id: 6,
            name: 'Apple Watch Series 9',
            description: 'Smartwatch con seguimiento de actividad fisica, salud y notificaciones',
            price: 429,
            stockQuantity: 12,
            createdAt: '2026-03-12T09:00:00.000Z',
            updatedAt: '2026-03-12T09:00:00.000Z',
            deactivatedAt: null,
            categoryId: 4,
            categoryName: 'Smartwatches'
        }
    ];

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
