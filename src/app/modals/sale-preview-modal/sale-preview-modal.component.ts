import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Sale } from '../../models/sale';
import { ModalsService } from '../../services/modals.service';
import { Product } from '../../models/product';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store';
import { first } from 'rxjs/operators';
import { Client } from '../../models/client';
import { ClientsService } from '../../services/clients.service';
import { PaymentsService } from '../../services/payments.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sale-preview-modal',
  templateUrl: './sale-preview-modal.component.html',
  styleUrls: ['./sale-preview-modal.component.scss'],
})
export class SalePreviewModalComponent implements OnInit {
  @Input() sale: Sale;
  store: Store;
  client: Client;
  constructor(
    private alertCtrl: AlertController,
    private clientsSrv: ClientsService,
    private modalCtrl: ModalController,
    private modalsSrv: ModalsService,
    private paymentsSrv: PaymentsService,
    private storeSrv: StoreService,
    private toastSrv: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.getTotalByProduct();
    if (this.sale.client) {
      this.client = await this.clientsSrv.getClientById(this.sale.client);
    }
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  private async delete(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      await this.paymentsSrv.deleteSale(this.sale.id);
      await this.modalsSrv.dismissLoadingModal();
      await this.modalCtrl.dismiss(true);
      await this.toastSrv.showDefaultNotify('La venta se ha eliminado', 'success');
    } catch (e) {
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal, intenta más tarde'
      );
    }
  }

  async openAlertDelete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message: 'Esta acción es irrevocable. ¿Estás seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, borrar',
          handler: async () => {
            await this.delete();
          },
        },
      ],
    });

    await alert.present();
  }

  getTotalByProduct(): void {
    console.log(this.sale.products);
    this.sale.products?.map((product: Product) => {
      if (product.variations?.length) {
        product.variations.map((variant) => {
          if (variant.type === 'checkbox') {
            variant.optionSelected.map((option) => {
              if (option.checked) {
                product.total = product.total + option.price;
              }
            });
          } else if (variant.type !== 'text') {
            product.total = product.total + +variant.optionSelected.price;
          }
        });
      }
    });
  }
}
