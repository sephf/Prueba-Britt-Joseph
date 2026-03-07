import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    );
  }

  public createBill(billNumber: string, date: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=CreaFactura&token=${environment.token}&numero_factura=${billNumber}&fecha=${date}`,
      null
    );
  }

  public createNewLine(billNumber: string, articleCode: string, qty: number): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=AgregaDetalle&token=${environment.token}&codigo_articulo=${articleCode}&cantidad=${qty}&numero_factura=${billNumber}`,
      null
    );
  }

  public getBillingLis(billNumber: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}method=ObtieneFactura&token=${environment.token}&numero_factura=${billNumber}`
    );
  }

  public removeNewLine(line: number, billNumber: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}method=BorrarDetalle&token=${environment.token}&linea=${line}&numero_factura=${billNumber}`,
      null
    );
  }
}
