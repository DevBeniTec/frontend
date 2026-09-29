import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { MenubarModule } from 'primeng/menubar'
import { TagModule } from 'primeng/tag'
import { DialogModule } from 'primeng/dialog'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { DropdownModule } from 'primeng/dropdown'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from './producto.service';

/*
 * =====================================================================
 *  ACTIVIDADES DE ESTA PANTALLA  (detalle completo en docs/actividades.txt)
 * =====================================================================
 *
 *  El backend NO se toca: la API ASP.NET Core ya tiene el CRUD hecho.
 *  Aqui solo se consume.  Base: http://localhost:2502/api/products
 *  Swagger para probar los endpoints: http://localhost:2502/swagger
 *
 *   0.2  Conectar con la API (GET /api/products) y quitar el array de ejemplo.
 *   0.4  Refrescar la tabla (boton manual  o  recarga tras cada operacion).
 *   1.1  Detalle de producto        GET    /api/products/{id}
 *   1.2  Alta de producto           POST   /api/products        -> 201 + Location
 *   1.3  Modificacion de producto   PUT    /api/products/{id}   -> 204
 *   1.4  Baja de producto           DELETE /api/products/{id}   -> 204
 *   1.5  Avisos al usuario con toast (4 segundos).
 *   3.1  Paginacion con PrimeNG.
 *   3.2  Ordenacion por columnas (pSortableColumn).
 *   3.3  Confirmacion con p-confirmDialog antes de borrar.
 *   4.1  Formulario reactivo en lugar de ngModel.
 *   4.2  DESCARTADA la ruta propia: el formulario de alta y edicion vive en
 *        un p-dialog modal dentro de esta misma pantalla.
 *   4.3  Indicador de carga mientras hay peticiones en curso.
 *
 *  DIRECTIVAS (obligatorio): la pantalla se resuelve con directivas, no
 *  tocando el DOM a mano: *ngIf / *ngFor , ngClass, ngStyle,
 *  ngModel o formControlName, routerLink, y las de PrimeNG (pTemplate,
 *  pButton, pSortableColumn). 
 */

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

/* Lo que se puede elegir en el desplegable de categoria del formulario. */
interface Categoria {
    id: number;
    name: string;
}

/* Datos editables del formulario.  Son EXACTAMENTE los campos que acepta la
   API en POST y PUT: el id, las fechas y categoryName los pone el servidor.
   Los numericos arrancan a null para que el input salga vacio en el alta en
   lugar de con un 0. */
interface FormularioProducto {
    name: string;
    description: string;
    price: number | null;
    stockQuantity: number | null;
    categoryId: number | null;
}

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MenubarModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    FormsModule,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {

    productosFiltrados: Producto[] = [];
    categoriaSeleccionada: string | null = null;

    /* Estado del formulario de alta / edicion (decision de 4.2: va en un
       p-dialog modal de esta misma pantalla, no en una ruta aparte).
       mostrarFormulario  -> abre y cierra el dialog.
       productoEnEdicion  -> null = alta (POST), con valor = edicion (PUT). */
    mostrarFormulario = false;
    productoEnEdicion: Producto | null = null;

    /* Modelo al que se atan los ngModel del dialog. */
    formulario: FormularioProducto = this.formularioVacio();

    /*
     * TODO 0.2 - Categorias escritas a mano para que el desplegable tenga
     *   algo que ofrecer.  Cuando exista el servicio hay que traerlas de
     *   GET /api/categories (son las mismas que pinta categorias.component).
     */


    categorias: Categoria[] = [
        { id: 1, name: 'Smartphones' },
        { id: 2, name: 'Ordenadores' },
        { id: 3, name: 'Auriculares' },
        { id: 4, name: 'Smartwatches' }
    ];

    // TODO 4.3 - Indicador de carga: una propiedad "cargando" que se pone a
    //   true antes de suscribirse y a false en el next Y en el error; se ata
    //   al [loading] de la p-table o a un p-progressSpinner con *ngIf.

    /*
     * TODO 0.2 - Estos productos estan escritos a mano solo para que la
     *   pantalla pinte algo.  Hay que borrarlos y traerlos de la API:
     *     - crear ProductoService con listar(): Observable<Producto[]>
     *       -> this.http.get<Producto[]>('http://localhost:2502/api/products')
     *     - inyectarlo aqui y rellenar this.productos en un metodo cargar()
     *       llamado desde ngOnInit.
     *   La interfaz Producto de arriba ya coincide con lo que devuelve la API.
     */

    cargar(): void {
        this.productoService.listar().subscribe({
            next: (productos) => {
                this.productos = productos;
                this.filtrarProductos();
            },
            error: (error) => {
                console.error('Error al cargar los productos:', error);
            }
        });
    }



    productos: Producto[] = [];

    constructor(private route: ActivatedRoute,
        private productoService: ProductoService
    ) { }

    ngOnInit(): void {
    this.cargar();   

        this.route.queryParamMap.subscribe(params => {
            this.categoriaSeleccionada = params.get('categoria');
            this.filtrarProductos();
        });
    }

    /* La copia con [...] no sobra: la p-table ordena in situ el array que
       recibe en [value], asi que en cuanto se active la ordenacion por
       columnas (3.2) estaria reordenando this.productos, la lista original. */
    filtrarProductos(): void {
        this.productosFiltrados = this.categoriaSeleccionada
            ? this.productos.filter(producto => producto.categoryName === this.categoriaSeleccionada)
            : [...this.productos];
    }

    /** Formulario en blanco: se usa en el alta y al cerrar el dialog. */
    private formularioVacio(): FormularioProducto {
        return {
            name: '',
            description: '',
            price: null,
            stockQuantity: null,
            categoryId: null
        };
    }

    /** Abre el dialog vacio en modo alta (al guardar sera un POST). */
    abrirAlta(): void {
        this.productoEnEdicion = null;
        this.formulario = this.formularioVacio();
        this.mostrarFormulario = true;
    }

    /**
     * Abre el MISMO dialog con los datos de la fila (al guardar sera un PUT).
     */
    abrirEdicion(producto: Producto): void {
        this.productoEnEdicion = producto;
        this.formulario = {
            name: producto.name,
            description: producto.description,
            price: producto.price,
            stockQuantity: producto.stockQuantity,
            categoryId: producto.categoryId
        };
        this.mostrarFormulario = true;
    }

    cerrarFormulario(): void {
        this.mostrarFormulario = false;
        this.productoEnEdicion = null;
        this.formulario = this.formularioVacio();
    }

    /*
     * TODO 1.2 / 1.3 - Validacion del formulario.
     *   Hay que comprobar los datos ANTES de llamar a la API, con las mismas
     *   reglas que aplica el backend (asi el 400 del servidor es la excepcion
     *   y no lo normal):
     *     - name           obligatorio y maximo 100 caracteres
     *     - price          obligatorio, entre 0,01 y 1.000.000
     *     - stockQuantity  obligatorio y no negativo
     *     - categoryId     obligatorio
     *   Hara falta ademas una marca tipo "intentoGuardar" que se ponga a true
     *   en guardar(); si no, los errores saltarian nada mas abrir el alta, con
     *   el formulario todavia vacio.
     */

    /** Se dispara con el boton Guardar del dialog. */
    guardar(): void {
        /*
         * TODO 1.2 / 1.3 - Validar aqui lo primero: si algo falla, destapar
         *   los mensajes de error y salir SIN llamar a la API, asi evitamos llamadas innecesarias.
         */

        /*
         * TODO 1.2 / 1.3 - Llamada a la API.
         *   Alta     (this.productoEnEdicion === null):
         *     POST /api/products con this.formulario tal cual.
         *   Modificacion:
         *     PUT /api/products/{id} con { id: this.productoEnEdicion.id,
         *     ...this.formulario }; el id del cuerpo DEBE coincidir con el
         *     de la ruta o la API responde 400.
         *   En el next: cerrarFormulario(), cargar() para refrescar la tabla
         *   (0.4) y toast de exito (1.5).
         *   En el error: NO cerrar el dialog; si el 400 trae
         *   { errors: { Name: [...] } }, pintar cada mensaje en su campo.
         */
    }

    /*
     * TODO 0.4 - Refresco de la tabla.  Metodo cargar() que vuelve a pedir
     *   la lista a la API.  Opcion A: se llama desde un boton "Refrescar".
     *   Opcion B: se llama en el next de crear/actualizar/eliminar (nunca en
     *   el error), para que la tabla muestre lo que devuelve el servidor.
     *
     * TODO 1.2 - crear(producto)   -> POST /api/products.  Se envian name,
     *   description, price, stockQuantity y categoryId; NO se envian id ni
     *   fechas (los pone la API).  Si el 400 trae { errors: { Name: [...] } },
     *   pinta ese mensaje en el campo correspondiente.
     *
     * TODO 1.3 - actualizar(producto) -> PUT /api/products/{id}.  El cuerpo
     *   DEBE incluir el id y coincidir con el de la ruta, si no responde 400.
     *   Responde 204 sin cuerpo: para ver el cambio hay que recargar (0.4).
     *
     * TODO 1.4 - eliminar(id) -> DELETE /api/products/{id} (204 o 404), con
     *   confirmacion previa (3.3).
     *   La API tambien permite baja logica con POST /api/products/deactivate/{id}
     *   y /reactivate/{id}, que rellenan o limpian deactivatedAt.
     *
     * TODO 1.5 - Avisar del resultado con message + toast
     *
     * TODO 3.1 - Paginacion.  La API acepta ?pageNumber=1&pageSize=20, asi que
     *   se puede paginar en cliente ([paginator]="true" con toda la lista) o
     *   contra el servidor ([lazy]="true" + onLazyLoad).
     */

    severidadStock(stockQuantity: number): 'success' | 'warning' | 'danger' {
        if (stockQuantity === 0) {
            return 'danger';
        }
        return stockQuantity < 10 ? 'warning' : 'success';
    }

}
