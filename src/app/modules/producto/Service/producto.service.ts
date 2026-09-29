import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Producto } from '../producto.component';
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
}
