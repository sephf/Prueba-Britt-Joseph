import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductList } from '../models/product';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root',
})
export class BillingService {

  private baseUrl = environment.apiUrl;
  private token = environment.token;

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) {}

  getProductList(): Observable<ProductList> {
    const url = `${this.baseUrl}method=BuscarProducto&token=${this.token}`;

    return this.http
      .get<ProductList>(url)
      .pipe(catchError(this.handleError.bind(this)));
  }

  createBill(billNumber: string, date: string): Observable<any> {
    const url = `${this.baseUrl}method=CreaFactura&token=${this.token}&numero_factura=${billNumber}&fecha=${date}`;

    return this.http
      .post<any>(url, null)
      .pipe(catchError(this.handleError.bind(this)));
  }

  createNewLine(
    billNumber: string,
    articleCode: string,
    qty: number
  ): Observable<any> {
    const url = `${this.baseUrl}method=AgregaDetalle&token=${this.token}&codigo_articulo=${articleCode}&cantidad=${qty}&numero_factura=${billNumber}`;

    return this.http
      .post<any>(url, null)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getFactura(billNumber: string): Observable<Factura> {
    const url = `${this.baseUrl}method=ObtieneFactura&token=${this.token}&numero_factura=${billNumber}`;

    return this.http
      .get<Factura>(url)
      .pipe(catchError(this.handleError.bind(this)));
  }

  removeNewLine(line: number, billNumber: string): Observable<any> {
    const url = `${this.baseUrl}method=BorrarDetalle&token=${this.token}&linea=${line}&numero_factura=${billNumber}`;

    return this.http
      .post<any>(url, null)
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    const message =
      error.error?.message ||
      error.error?.error ||
      'Error inesperado';

    this.alertService.error(message);
    return throwError(() => error);
  }
}