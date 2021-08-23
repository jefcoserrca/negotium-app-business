import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Builder } from 'builder-pattern';
import { Client, ClientsSettings } from 'src/app/models/client';
import { ClientsService } from 'src/app/services/clients.service';
import { ModalsService } from '../../services/modals.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  searchTerm: string;
  allClients: Array<Client>;
  clients: Array<Client> = [];
  showLoading: boolean;
  form: FormGroup;
  settings: ClientsSettings;
  constructor(
    private clientsSrv: ClientsService,
    private fb: FormBuilder,
    private modalsSrv: ModalsService,
    private toastSrv: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.showLoading = true;
    this.initForm();
    this.allClients = await this.clientsSrv.getClients();
    this.clients = [...this.allClients];
    this.settings = await this.clientsSrv.getSettings();
    if (this.settings) {
      this.updateForm();
    }
    this.showLoading = false;
  }

  private initForm(): void {
    this.form = this.fb.group({
      autoSave: [true, [Validators.required]],
      eWallet: [false, [Validators.required]],
      percentage: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    });
  }

  private updateForm(): void {
    this.form.setValue({
      autoSave: this.settings.autoSave,
      eWallet: this.settings.eWallet,
      percentage: this.settings.percentage,
    });
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
      this.showLoading = true;
      this.clients = [...this.allClients];
      this.showLoading = false;
    }
  }

  async openCreatNewClient(): Promise<void> {
    const res = await this.modalsSrv.openRegisterUser('client');
    if (res) {
      this.allClients = await this.clientsSrv.getClients();
      this.clients = [...this.allClients];
    }
  }

  async saveSettings(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const data = this.form.value;
      const settings = Builder(ClientsSettings)
        .autoSave(data.autoSave)
        .eWallet(data.eWallet)
        .percentage(data.percentage && data.eWallet ? data.percentage : 0)
        .build();

      await this.clientsSrv.updateSettings(settings);
      await this.modalsSrv.dismissLoadingModal();
      this.settings = settings;
      await this.toastSrv.showDefaultNotify(
        'Los cambios fueron publicados!',
        'success'
      );
    } catch (error) {
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal, intenta más tarde'
      );
    }
  }

  async openPreview(client: Client, i: number): Promise<void> {
    const newClient = await this.modalsSrv.openClientPreviewModal(
      client,
      this.settings
    );
    if (newClient === true) {
      this.allClients.splice(i, 1);
    } else if (newClient && typeof (newClient === Client)) {
      this.allClients[i] = newClient;
    }
    this.clients = [...this.allClients];
  }
}
