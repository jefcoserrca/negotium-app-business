import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ProductStock } from '../../models/product';

@Component({
  selector: 'app-stock-modal',
  templateUrl: './stock-modal.component.html',
  styleUrls: ['./stock-modal.component.scss'],
})
export class StockModalComponent implements OnInit {
  @Input() stock: ProductStock;
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  async saveStock(): Promise<void> {
    if (this.stock.availableStock === 0 && this.stock.stockController) {
      await this.showAlert();
    } else {
      await this.modalCtrl.dismiss(this.stock);
    }
  }

  async showAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message:
        'Si tu stock esta en cero(0) tus clientes no podrán añadir este producto a su carrito. ¿Deseas continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Si, continuar',
          handler: async () => {
            await this.modalCtrl.dismiss(this.stock);
          },
        },
      ],
    });

    await alert.present();
  }
}
