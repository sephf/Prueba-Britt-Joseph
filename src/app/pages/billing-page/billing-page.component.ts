import { ProductList } from './../../models/product';
import { BillingService } from './../../services/billing.service';
import { AlertService } from './../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Factura } from '../../models/factura.model';

@Component({
  selector: 'app-billing-page',
  templateUrl: './billing-page.component.html',
  styleUrls: ['./billing-page.component.css'],
})
export class BillingPageComponent implements OnInit {
  formBill!: FormGroup;
  sendBill!: string;
  sendDate!: string;
  formDetail!: FormGroup;
  productList!: ProductList;
  billingList!: Factura;
  total: number = 0;

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
    this.getProductList();
  }

  public save(): void {
    if (this.formBill.valid) {
      this.sendBill = this.formBill.get('billNumber')?.value;
      this.sendDate = this.formBill.get('date')?.value;

      this.billingService.createBill(this.sendBill, this.sendDate).subscribe({
        next: (res: any) => {
          this.alertService.success(res.ALERTA);
          this.formBill.reset();
          this.getBillingList();
        },
        error:(error) => {
          console.error(error);
        }
      });
    } else {
      this.markFormGroupTouched(this.formBill);
      this.alertService.error('Por favor complete todos los campos requeridos');
    }
  }

  public getProductList(): void {
    this.billingService.getProductList().subscribe({
      next:(res: ProductList) => {
        this.productList = res;
      },
      error:(error) => {
        console.error(error);
      }
    });
  }

  public sendNewLine(): void {
    if (this.formDetail.valid && this.sendBill) {
      let qty = this.formDetail.get('qty')?.value;
      let code = this.formDetail.get('articleCode')?.value;

      this.billingService.createNewLine(this.sendBill, code, qty).subscribe({
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
    this.billingService.getFactura(this.sendBill).subscribe({
      next:(res: Factura) => {
        this.billingList = res;
        this.total = this.sumTotal(res);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public removeLine(line: number, billNumber: string): void {
    this.billingService.removeNewLine(line, billNumber).subscribe({
      next: (res: any) => {
        this.alertService.success(res.ALERTA);
        this.getBillingList();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private sumTotal(bill: Factura): number {
    let suma = 0;

    bill.DETALLES.forEach(
      (element) => (suma += element.TOTAL_LINEA)
    );
    return suma;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
