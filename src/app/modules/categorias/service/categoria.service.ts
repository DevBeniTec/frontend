import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../producto/producto.component';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor() { }


    private http=inject(HttpClient);
    private apiUrl=environment.apiUrl;
  
    getCategorias(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(`${this.apiUrl}/categories`);
    }

}
