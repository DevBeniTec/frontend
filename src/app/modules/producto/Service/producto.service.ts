import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormularioProducto, Producto } from '../producto.component';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor() { }

  private http=inject(HttpClient);
  private apiUrl=environment.apiUrl;

  getProducto(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/products`);
  }

  // GET: /api/products/{id}
  getPtoductoById(id: Number): Observable<Producto>
  {
    return this.http.get<Producto>(`${this.apiUrl}/products/${id}`);
  } 

  // POST: /api/products

  crearProducto(producto: FormularioProducto): Observable<Producto>
  {
    return this.http.post<Producto>(`${this.apiUrl}/products`, producto);
  } 

  // PUT: /api/products/{id}

  actualizaProducto(id: Number, producto: FormularioProducto): Observable<void>
  {
    return this.http.put<void>(`${this.apiUrl}/products/${id}`, producto);
  }

  // DELETE: /api/products/{id}

  eliminaProductoById(id: Number): Observable<void>
  {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

}
