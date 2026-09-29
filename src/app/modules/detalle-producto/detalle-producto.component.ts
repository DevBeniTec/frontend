import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../../components/header/header.component';

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
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenubarModule,
    TagModule,
    CardModule,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent implements OnInit {

    producto?: Producto;

    /*
     * TODO 1.1 - Detalle de producto (ver docs/actividades.txt).
     *   Esta lista escrita a mano tiene que desaparecer: el detalle se pide a
     *   la API con GET http://localhost:2502/api/products/{id}
     *     - metodo obtener(id) en el ProductoService (el mismo de 0.2),
     *     - se llama desde el ngOnInit con el id de la ruta,
     *     - 200 -> se pinta el producto,
     *     - 404 -> "ese producto no existe" (ya hay un ng-template #noEncontrado),
     *     - error de red / API caida -> mensaje distinto ("sin conexion"),
     *       se distingue por el status 0 del HttpErrorResponse.
     *   Prueba: http://localhost:4200/productos/9999
     *
     *   Directivas: *ngIf con else para elegir entre detalle, "no encontrado"
     *   y error de conexion.
     */
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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            this.producto = this.productos.find(producto => producto.id === id);
        });

    }

    get severidadStock(): 'success' | 'info' | 'warning' | 'danger' {
        if (!this.producto) {
            return 'info';
        }
        if (this.producto.stockQuantity === 0) {
            return 'danger';
        }
        return this.producto.stockQuantity < 10 ? 'warning' : 'success';
    }

    /** Un producto dado de baja tiene fecha de desactivacion. */
    get estaActivo(): boolean {
        return !this.producto?.deactivatedAt;
    }

}
