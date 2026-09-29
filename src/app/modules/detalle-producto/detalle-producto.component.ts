import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductoService, Producto } from '../producto/producto.service';


/* Pendiente: la imagen del producto (imageUrl) se ha dejado fuera de momento.
   No esta descartada; si se retoma hay que anadirla en los tres componentes
   (producto, categorias y detalle-producto) y en el modelo del backend. */


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

    noEncontrado = false;
    errorConexion = false;

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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productoService: ProductoService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            
            this.productoService.obtenerPorId(id).subscribe({
                 next: (producto) => { 
                    this.producto = producto;
                    this.noEncontrado = false;
                    this.errorConexion = false;
                }, 
                error: (error) => {
                    console.error('Error al obtener el producto:', error);

                    this.producto = undefined;

                    if (error.status === 404) {
                        this.noEncontrado = true;
                        this.errorConexion = false;
                    } else if (error.status === 0) {
                        this.noEncontrado = false;
                        this.errorConexion = true;
                    }
                } 
            });
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
