import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ModalsService } from '../../services/modals.service';
import { Sale } from '../../models/sale';
import { PaymentsService } from 'src/app/services/payments.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  range: FormGroup;
  maxDate = moment().toISOString();
  sales: Array<Sale>;
  allSales: Array<Sale>;
  balance: number = 0;
  constructor(
    private fb: FormBuilder,
    private modalsSrv: ModalsService,
    private paymentsSrv: PaymentsService
  ) {}

  async ngOnInit() {
    this.initDateForm();
    await this.getSales();
  }

  initDateForm(): void {
    const start: moment.Moment = moment().subtract(7, 'd');
    const end: moment.Moment = moment();
    this.range = this.fb.group({
      start: [start.toDate(), Validators.required],
      end: [end.toDate(), Validators.required],
    });
  }

  async dateChanged(ev: any): Promise<void> {
    if (this.range.value.end) {
      await this.getSales();
    }
  }

  async createNewSale(): Promise<void> {
    const newSale = await this.modalsSrv.openCreateSaleModal();
    if (newSale) {
      await this.getSales();
    }
  }

  getBalance(): void {
    this.balance = 0;
    this.sales.map((sale) => (this.balance = this.balance + sale.amount));
  }

  private async getSales(): Promise<void> {
    this.sales = await (
      await this.paymentsSrv.getSales(
        moment(this.range.value.start).toISOString(),
        moment(this.range.value.end)
          .set('hour', 23)
          .set('minute', 59)
          .toISOString()
      )
    )
      .pipe(first())
      .toPromise();
    this.getBalance();
  }

  async openPreviewSaleModal(sale: Sale): Promise<void> {
    await this.modalsSrv.openSalePreviewModal(sale);
  }
}
