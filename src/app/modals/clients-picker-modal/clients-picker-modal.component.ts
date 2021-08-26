import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Client } from 'src/app/models/client';
import { ModalsService } from '../../services/modals.service';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-clients-picker-modal',
  templateUrl: './clients-picker-modal.component.html',
  styleUrls: ['./clients-picker-modal.component.scss'],
})
export class ClientsPickerModalComponent implements OnInit {
  clients: Array<Client>;
  searchTerm: string;
  allClients: Array<Client>;
  showLoading = true;
  constructor(
    private modalCtrl: ModalController,
    private modalsSrv: ModalsService,
    private clientsSrv: ClientsService
  ) {}

  async ngOnInit() {
    this.showLoading = true;
    this.clients = await this.clientsSrv.getClients();
    this.allClients = [...this.clients];
    this.showLoading = false;
  }
  close(): void {
    this.modalCtrl.dismiss().then();
  }

  async selectUser(client: Client): Promise<void> {
    await this.modalCtrl.dismiss(client);
  }

  searchByTerm(): void {
    if (this.searchTerm) {
      this.clients = this.allClients.filter((item) => {
        return (
          item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 ||
          item.phone.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1 ||
          item.email.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        );
      });
    } else {
      this.clients = [...this.allClients];
    }
  }

  async openCreatNewClient(): Promise<void> {
    const res = await this.modalsSrv.openRegisterUser('client');
    if (res) {
      this.allClients = await this.clientsSrv.getClients();
      this.clients = [...this.allClients];
    }
  }
}
