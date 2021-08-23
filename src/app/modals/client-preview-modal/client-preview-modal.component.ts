import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Client, ClientsSettings } from '../../models/client';
import { ModalsService } from '../../services/modals.service';
import { ClientsService } from '../../services/clients.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-client-preview-modal',
  templateUrl: './client-preview-modal.component.html',
  styleUrls: ['./client-preview-modal.component.scss'],
})
export class ClientPreviewModalComponent implements OnInit {
  @Input() client: Client;
  @Input() settings: ClientsSettings;
  orders: Array<any> = [];
  constructor(
    private alertCtrl: AlertController,
    private clientsSrv: ClientsService,
    private modalCtrl: ModalController,
    private modalsSrv: ModalsService,
    private toastSrv: ToastService
  ) {}

  ngOnInit() {}

  close(): void {
    this.modalCtrl.dismiss(this.client).then();
  }

  async openAlertDelete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message: 'Esta acción es irrevocable. ¿Estás seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: async () => await this.deleteUser() },
      ],
    });
    await alert.present();
  }

  async deleteUser(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      await this.clientsSrv.deleteClient(this.client.id);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showDefaultNotify(
        'Se ha eliminado con éxito',
        'success'
      );

      await this.modalCtrl.dismiss(true);
    } catch (error) {
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal, intentalo más tarde'
      );
    }
  }

  async editUser(): Promise<void> {
    const newClient = await this.modalsSrv.openRegisterUser(
      'client',
      this.client
    );
    if (newClient) {
      this.client = newClient;
    } else {
      return;
    }
  }
}
