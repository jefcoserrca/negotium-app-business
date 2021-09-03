import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { AccountService } from '../../services/account.service';
import { ModalsService } from '../../services/modals.service';
import { StoreService } from '../../services/store.service';
import { first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '../../models/store';
import { ToastService } from '../../services/toast.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  @Input() data: { role: 'cancel' | 'update'; newSubscription: 'pro' | 'vip' };
  user: User;
  constructor(
    private modalCtrl: ModalController,
    private authSrv: AuthenticationService,
    private accountSrv: AccountService,
    private modalsSrv: ModalsService,
    private storeSrv: StoreService,
    private toastSrv: ToastService,
    private toolsSrv: ToolsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authSrv.user.pipe(first()).toPromise();
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  async changeSubscription(): Promise<void> {
    try {
      this.close();
      this.modalsSrv.openLoadingModal('Actualizando plan. Por favor espere...');
      const newPlan =
        this.data.newSubscription === 'pro'
          ? environment.stripeProducts.pro
          : environment.stripeProducts.vip;
      let stores: Store[] = null;
      if (this.data.newSubscription === 'pro') {
        stores = await this.storeSrv.getStores(this.user.id);
      }
      if (
        this.user.subscription !== 'free' &&
        this.user.subscriptionStatus !== 'canceled'
      ) {
        const list = await this.accountSrv
          .getItemsList({ subscriptionId: this.user.subscriptionId })
          .toPromise();
        console.log(newPlan);
        const data = {
          itemId: list.data[0].id,
          priceId: newPlan,
          quantity: this.data.newSubscription === 'pro' ? stores.length : 1,
        };
        const updateResponse = await this.accountSrv
          .updateItem(data)
          .toPromise();
        console.log(updateResponse);
        await this.modalsSrv.dismissLoadingModal();
        await this.toolsSrv.goToDashboard();
        await this.toastSrv.showDefaultNotify('Su plan se ha actualizado!');
      } else {
        await this.modalsSrv.dismissLoadingModal();
        await this.toastSrv.showErrorNotify(
          'No se pudo actualizar el plan. Intente más tarde'
        );
      }
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'No se pudo actualizar el plan. Intente más tarde'
      );
    }
  }
}
