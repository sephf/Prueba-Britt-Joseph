import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductList } from '../models/product';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BillingService {
  constructor(private http: HttpClient) {}

  getProductList(): Observable<ProductList> {
    return this.http.get<ProductList>(
      `${environment.apiUrl}method=BuscarProducto&token=${environment.token}`
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          error.error?.error ||
          "Error inesperado";
        // TODO: this.alertService.error(message);
        return throwError(() => error);
      })
    );
  }

  public createBill(billNumber: string, date: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=CreaFactura&token=${environment.token}&numero_factura=${billNumber}&fecha=${date}`,
      null
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          error.error?.error ||
          "Error inesperado";
        // TODO: this.alertService.error(message);
        return throwError(() => error);
      })
    );
  }

  public createNewLine(billNumber: string, articleCode: string, qty: number): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=AgregaDetalle&token=${environment.token}&codigo_articulo=${articleCode}&cantidad=${qty}&numero_factura=${billNumber}`,
      null
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          error.error?.error ||
          "Error inesperado";
        // TODO: this.alertService.error(message);
        return throwError(() => error);
      })
    );
  }

  public getBillingLis(billNumber: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}method=ObtieneFactura&token=${environment.token}&numero_factura=${billNumber}`
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          error.error?.error ||
          "Error inesperado";
        // TODO: this.alertService.error(message);
        return throwError(() => error);
      })
    );
  }

  public removeNewLine(line: number, billNumber: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=BorrarDetalle&token=${environment.token}&linea=${line}&numero_factura=${billNumber}`,
      null
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          error.error?.error ||
          "Error inesperado";
        // TODO: this.alertService.error(message);
        return throwError(() => error);
      })
    );
  }
}
