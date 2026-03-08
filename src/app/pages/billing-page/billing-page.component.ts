import { ProductList } from './../../models/product';
import { BillingService } from './../../services/billing.service';
import { AlertService } from './../../services/alert.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Factura } from '../../models/factura.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-billing-page',
  templateUrl: './billing-page.component.html',
  styleUrls: ['./billing-page.component.css'],
})
export class BillingPageComponent implements OnInit, OnDestroy {
  formBill!: FormGroup;
  sendBill!: string;
  sendDate!: string;
  formDetail!: FormGroup;
  productList!: ProductList;
  billingList!: Factura;
  total: number = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private billingService: BillingService,
    private alertService: AlertService
  ) {
    this.formBill = this.formBuilder.group({
      billNumber: ['', [Validators.required, Validators.minLength(1)]],
      date: ['', Validators.required],
    });

    this.formDetail = this.formBuilder.group({
      qty: ['', [Validators.required, Validators.min(1)]],
      articleCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProductList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga la lista de productos una sola vez al inicializar
   * El caché se mantiene en el servicio para evitar solicitudes redundantes
   */
  private loadProductList(): void {
    this.billingService.getProductList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ProductList) => {
          this.productList = res;
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  public save(): void {
    if (this.formBill.valid) {
      this.sendBill = this.formBill.get('billNumber')?.value;
      this.sendDate = this.formBill.get('date')?.value;

      this.billingService.createBill(this.sendBill, this.sendDate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.alertService.success(res.ALERTA);
            this.formBill.reset();
            this.getBillingList();
          },
          error: (error) => {
            console.error(error);
          }
        });
    } else {
      this.markFormGroupTouched(this.formBill);
      this.alertService.error('Por favor complete todos los campos requeridos');
    }
  }

  public sendNewLine(): void {
    if (this.formDetail.valid && this.sendBill) {
      const qty = this.formDetail.get('qty')?.value;
      const code = this.formDetail.get('articleCode')?.value;

      this.billingService.createNewLine(this.sendBill, code, qty)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.alertService.success(res.ALERTA);
            this.getBillingList();
            this.formDetail.reset();
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      this.markFormGroupTouched(this.formDetail);
      this.alertService.error('Por favor complete todos los campos requeridos y asegúrese de tener una factura activa');
    }
  }

  public getBillingList(): void {
    this.billingService.getFactura(this.sendBill)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Factura) => {
          this.billingList = res;
          this.total = this.sumTotal(res);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public removeLine(line: number, billNumber: string): void {
    this.billingService.removeNewLine(line, billNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.alertService.success(res.ALERTA);
          this.getBillingList();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  /**
   * Calcula el total de la factura sumando todas las líneas
   */
  private sumTotal(bill: Factura): number {
    return bill.DETALLES.reduce(
      (suma, element) => suma + element.TOTAL_LINEA,
      0
    );
  }

  /**
   * Marca todos los controles del formulario como tocados
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
