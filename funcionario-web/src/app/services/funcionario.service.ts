import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { FuncionarioResponse } from "../models/funcionarioResponse";
import { FuncionarioRequest } from "../models/funcionarioRequest";

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly baseUrl = `${environment.apiUrl}/funcionarios`;

  // Estado reativo básico (loading e cache simples)
  loading = signal(false);
  private _cache$ = new BehaviorSubject<FuncionarioResponse[] | null>(null);
  cache$ = this._cache$.asObservable();

  constructor(private http: HttpClient) { }

  listar(params?: { cargo?: string; ativo?: boolean }): Observable<FuncionarioResponse[]> {
    let httpParams = new HttpParams();
    if (params?.cargo) httpParams = httpParams.set('cargo', params.cargo);
    if (params?.ativo !== undefined && params?.ativo !== null) {
      httpParams = httpParams.set('ativo', params.ativo);
    }
    return this.http.get<FuncionarioResponse[]>(this.baseUrl, { params: httpParams });
  }

  buscarPorId(id: number): Observable<FuncionarioResponse> {
    return this.http.get<FuncionarioResponse>(`${this.baseUrl}/${id}`);
  }

  criar(req: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(this.baseUrl, req);
  }

  atualizar(id: number, req: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.put<FuncionarioResponse>(`${this.baseUrl}/${id}`, req);
  }

  inativar(id: number): Observable<FuncionarioResponse> {
    return this.http.patch<FuncionarioResponse>(`${this.baseUrl}/${id}/inativar`, {});
  }

  // helpers
  setCache(list: FuncionarioResponse[]) { this._cache$.next(list); }
  clearCache() { this._cache$.next(null); }
}
