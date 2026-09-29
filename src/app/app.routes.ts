import { Routes } from '@angular/router';
import { ProductoComponent } from './modules/producto/producto.component';
import { CategoriasComponent } from './modules/categorias/categorias.component';
import { DetalleProductoComponent } from './modules/detalle-producto/detalle-producto.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'categorias',
        pathMatch: 'full'
    },
    {
        path: 'productos',
        component: ProductoComponent
    },
    {
        path: 'productos/:id',
        component: DetalleProductoComponent
    },
    {
        path: 'categorias',
        component: CategoriasComponent
    },
    {
        path: '**',
        redirectTo: 'categorias'
    }
];
