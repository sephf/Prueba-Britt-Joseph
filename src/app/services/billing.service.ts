import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ProductList } from '../models/product';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private readonly baseUrl = environment.apiUrl;
  private readonly token = environment.token;
  private productListCache$: Observable<ProductList> | null = null;

  constructor(private http: HttpClient, private alertService: AlertService) {}

  /**
   * Obtiene la lista de productos con caché para evitar solicitudes redundantes
   */
  getProductList(): Observable<ProductList> {
    if (!this.productListCache$) {
      this.productListCache$ = this.http
        .get<ProductList>(this.buildUrl('BuscarProducto'))
        .pipe(
          shareReplay(1),
          catchError(this.handleError.bind(this))
        );
    }
    return this.productListCache$;
  }

  /**
   * Limpia el caché de productos
   */
  clearProductCache(): void {
    this.productListCache$ = null;
  }

  /**
   * Crea una nueva factura
   */
  public createBill(billNumber: string, date: string): Observable<any> {
    const params = { numero_factura: billNumber, fecha: date };
    return this.http
      .post<any>(this.buildUrl('CreaFactura', params), null)
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Agrega un detalle (línea) a una factura
   */
  public createNewLine(
    billNumber: string,
    articleCode: string,
    qty: number
  ): Observable<any> {
    const params = {
      numero_factura: billNumber,
      codigo_articulo: articleCode,
      cantidad: qty,
    };
    return this.http
      .post<any>(this.buildUrl('AgregaDetalle', params), null)
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Obtiene los detalles de una factura
   */
  public getFactura(billNumber: string): Observable<Factura> {
    const params = { numero_factura: billNumber };
    return this.http
      .get<Factura>(this.buildUrl('ObtieneFactura', params))
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Elimina una línea de detalle de una factura
   */
  public removeNewLine(line: number, billNumber: string): Observable<any> {
    const params = { linea: line, numero_factura: billNumber };
    return this.http
      .post<any>(this.buildUrl('BorrarDetalle', params), null)
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Construye la URL con método, parámetros y token
   */
  private buildUrl(method: string, params?: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    queryParams.append('method', method);
    queryParams.append('token', this.token);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
    }

    return `${this.baseUrl}${queryParams.toString()}`;
  }

  /**
   * Maneja errores HTTP de forma centralizada
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.error?.message || error.error?.error || 'Error inesperado';
    this.alertService.error(message);
    return throwError(() => error);
  }
}
