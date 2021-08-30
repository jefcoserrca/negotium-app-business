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
import { StoreService } from '../../services/store.service';
import { Store, StripeData } from '../../models/store';
import { AccountService } from '../../services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Builder } from 'builder-pattern';
import { LoadingController } from '@ionic/angular';
import { dashboardLink } from '../../../../functions/src/stripe/stripe-connect';
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
  store: Store;
  tabPosition = 0;
  stripeAccountData: any;
  errMsg: string;
  constructor(
    private accountSrv: AccountService,
    private authSrv: AuthenticationService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private modalsSrv: ModalsService,
    private paymentsSrv: PaymentsService,
    private activatedRoute: ActivatedRoute,
    private storeSrv: StoreService,
    private toastSrv: ToastService
  ) {}

  async ngOnInit() {
    this.initDateForm();
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.initAccountConnect();
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

  async initAccountConnect(): Promise<void> {
    if (this.store.stripeAccount) {
      const path = this.getPathFromParams();
      this.stripeAccountData = await this.accountSrv
        .getStripeAccount({ accountId: this.store.stripeAccount })
        .toPromise();
      if (path === 'saveAccount') {
        await this.saveStripeAccount();
      }
      this.stripeHandleErrors(this.stripeAccountData.requirements);
    }
  }

  getPathFromParams(): string {
    return this.activatedRoute.snapshot.paramMap.get('path');
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
    const deleted = await this.modalsSrv.openSalePreviewModal(sale);
    if (deleted) {
      await this.getSales();
    }
  }

  matTabChange(ev: any): void {
    this.tabPosition = ev.index;
  }

  async initPaymentsOnline(): Promise<void> {
    try {
      if (this.store.typeAccount === 'free') {
        await this.modalsSrv.openActivateProModal(
          'Esta función solo esta disponible si tu negocio es PRO. Lleva tu empresa al siguiente nivel!'
        );
      } else {
        await this.modalsSrv.openLoadingModal();
        const user = await this.authSrv.user.pipe(first()).toPromise();
        const account = await this.accountSrv
          .createAccountStripe({
            userId: user.id,
            storeId: this.store.id,
            email: user.email,
          })
          .pipe(first())
          .toPromise();
        this.stripeAccountData = account;
        await this.saveStripeAccount();
        await this.modalsSrv.dismissLoadingModal();
        console.log(this.stripeAccountData);
        this.store.stripeAccount = this.stripeAccountData.id;
      }
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify('Ops ha ocurrido un error!');
    }
  }

  async createAccountLink(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const accountLink = await this.accountSrv
        .createLinkAccount({
          accountId: this.store.stripeAccount,
          refreshUrl: 'http://localhost:8100/dashboard/sales',
          returnUrl: 'http://localhost:8100/dashboard/sales/saveAccount',
        })
        .pipe(first())
        .toPromise();

      window.location.href = accountLink.url;
      await this.modalsSrv.dismissLoadingModal();
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify('Ops ha ocurrido un error!');
    }
  }

  async saveStripeAccount(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando información. Por favor espere...',
      spinner: 'crescent',
    });
    await loading.present();
    const stripeAccount: StripeData = Builder(StripeData)
      .chargesEnabled(this.stripeAccountData.charges_enabled)
      .payoutsEnabled(this.stripeAccountData.payouts_enabled)
      .isActive(this.store.stripeData ? this.store.stripeData.isActive : true)
      .build();
    const user = await this.authSrv.user.pipe(first()).toPromise();
    this.accountSrv.updateStripeData(user.id, this.store.id, stripeAccount);
    await loading.dismiss();
    this.store.stripeData = stripeAccount;
  }

  async createDashboardLink(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const dashboardLink = await this.accountSrv
        .getDashboardLink({
          accountId: this.store.stripeAccount,
        })
        .pipe(first())
        .toPromise();
        console.log(dashboardLink);
      window.location.href = dashboardLink.url;
      await this.modalsSrv.dismissLoadingModal();
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify('Ops ha ocurrido un error!');
    }
  }

  stripeHandleErrors(requirements: any): void {
    let message;
    if (requirements.disabled_reason) {
      switch (requirements.disabled_reason) {
        case 'requirements.past_due':
          message =
            'Se requiere información de verificación adicional para habilitar las capacidades de pago o cargo en esta cuenta.';
          break;
        case 'rejected.fraud':
          message =
            'La cuenta es rechazada por sospecha de fraude o actividad ilegal.';
          break;
        case 'rejected.terms_of_service':
          message =
            'La cuenta es rechazada debido a presuntas violaciones de los términos de servicio.';
          break;
        case 'rejected.listed':
          message =
            'La cuenta se rechaza porque está en una lista de empresas o personas prohibidas de terceros (como un proveedor de servicios financieros o un gobierno).';
          break;
        case 'rejected.other':
          message = 'La cuenta se rechaza por otro motivo.';
          break;
      }
      this.errMsg = message ? message : null;
    } else {
      this.errMsg = null;
    }
  }
}
