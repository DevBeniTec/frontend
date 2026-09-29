import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Categoria {
    id: number;
    name: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {

    private apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) {}

    listar(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.apiUrl);
    }

    obtenerPorId(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
    }
}