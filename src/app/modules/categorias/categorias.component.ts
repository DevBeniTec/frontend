import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

import { HeaderComponent } from '../../components/header/header.component';

import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';

import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';

/*
 * =====================================================================
 *  ACTIVIDADES DE ESTA PANTALLA  (detalle en docs/actividades.txt)
 * =====================================================================
 *
 *   0.3  Añadir un boton que lleve a la pantalla de productos
 *        (routerLink a /productos), en la barra de menu de esta pagina.
 *
 *   2.1  CRUD de categorias contra /api/categories
 *        (GET, GET/{id}, POST, PUT/{id}, DELETE/{id}), con botones
 *        en cada fila.
 *
 *        OJO: el bloque 2 NO es obligatorio. Si el CRUD de productos
 *        (bloque 1) ha quedado implementado y entendido de verdad,
 *        esto solo seria repetir lo mismo con otro nombre.
 *
 *   Los datos de esta pantalla se obtienen ahora desde la API:
 *
 *        GET /api/categories
 *        GET /api/products
 *
 * =====================================================================
 */

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

    /*
     * Lista de categorias.
     *
     * Antes estaba escrita directamente en este componente.
     * Ahora empieza vacia porque los datos los obtenemos de:
     *
     * GET /api/categories
     */
    categorias: Categoria[] = [];

    /*
     * Lista de productos.
     *
     * Esta pantalla necesita los productos porque los muestra
     * agrupados dentro de cada categoria.
     *
     * Los obtenemos de:
     *
     * GET /api/products
     */
    productos: Producto[] = [];

    /*
     * Grupos desplegados de la tabla, indexados por nombre de categoria.
     *
     * Por ejemplo:
     *
     * {
     *     "Cafes": true,
     *     "Tes": true
     * }
     */
    categoriasDesplegadas: { [nombreCategoria: string]: boolean } = {};

    /*
     * Constructor.
     *
     * Router:
     * permite navegar a la pantalla de detalle de un producto.
     *
     * ProductoService:
     * permite obtener los productos desde la API.
     *
     * CategoriaService:
     * permite obtener las categorias desde la API.
     */
    constructor(
        private router: Router,
        private productoService: ProductoService,
        private categoriaService: CategoriaService
    ) { }

    /*
     * ngOnInit se ejecuta cuando Angular inicializa este componente.
     *
     * En este momento pedimos tanto las categorias como los productos.
     */
    ngOnInit(): void {
        this.cargarCategorias();
        this.cargarProductos();
    }

    /*
     * Obtiene las categorias desde la API.
     *
     * GET /api/categories
     */
    cargarCategorias(): void {
        this.categoriaService.listar().subscribe({
            next: (categorias) => {
                this.categorias = categorias;
            },
            error: (error) => {
                console.error(
                    'Error al cargar las categorías',
                    error
                );
            }
        });
    }

    /*
     * Obtiene los productos desde la API.
     *
     * GET /api/products
     *
     * Cuando llegan los productos los guardamos y despues
     * abrimos todos los grupos de categorias.
     */
    cargarProductos(): void {
        this.productoService.listar().subscribe({
            next: (productos) => {
                this.productos = productos;
                this.desplegarTodas();
            },
            error: (error) => {
                console.error(
                    'Error al cargar los productos',
                    error
                );
            }
        });
    }

    /*
     * Deja todos los grupos de la tabla abiertos.
     *
     * Se recorre la lista de productos porque cada producto
     * contiene el nombre de su categoria.
     */
    desplegarTodas(): void {
        this.categoriasDesplegadas = {};

        this.productos.forEach(producto => {
            this.categoriasDesplegadas[producto.categoryName] = true;
        });
    }

    /*
     * Busca una categoria por su nombre.
     *
     * Si la encuentra devuelve la categoria.
     * Si no existe devuelve undefined.
     */
    getCategoria(nombreCategoria: string): Categoria | undefined {
        return this.categorias.find(
            categoria => categoria.name === nombreCategoria
        );
    }

    /*
     * Devuelve todos los productos que pertenecen
     * a una determinada categoria.
     */
    getProductosPorCategoria(nombreCategoria: string): Producto[] {
        return this.productos.filter(
            producto => producto.categoryName === nombreCategoria
        );
    }

    /*
     * Cuenta cuantos productos tiene una categoria.
     */
    numProductos(nombreCategoria: string): number {
        return this.getProductosPorCategoria(nombreCategoria).length;
    }

    /*
     * Determina el estado visual del stock.
     *
     * 0 productos  -> danger
     * menos de 10  -> warning
     * 10 o mas     -> success
     */
    severidadStock(
        stockQuantity: number
    ): 'success' | 'warning' | 'danger' {

        if (stockQuantity === 0) {
            return 'danger';
        }

        return stockQuantity < 10
            ? 'warning'
            : 'success';
    }

    /*
     * Navega a la pantalla de detalle del producto.
     *
     * Ejemplo:
     *
     * /productos/5
     */
    verDetalle(idProducto: number): void {
        this.router.navigate([
            '/productos',
            idProducto
        ]);
    }
}


