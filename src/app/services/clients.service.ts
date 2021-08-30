import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { User } from '../models/user';
import { Store } from '../models/store';
import { first } from 'rxjs/operators';
import { Client, ClientsSettings } from '../models/client';
import { Builder } from 'builder-pattern';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  user: User;
  store: Store;
  constructor(
    private af: AngularFirestore,
    private authSrv: AuthenticationService,
    private storeSrv: StoreService
  ) {}

  private async getSetupData(): Promise<void> {
    this.user = this.user
      ? this.user
      : await this.authSrv.user.pipe(first()).toPromise();
    this.store = this.store
      ? this.store
      : await this.storeSrv.store.pipe(first()).toPromise();
  }

  public async getClients(): Promise<Array<Client>> {
    await this.getSetupData();
    const doc = await this.af
      .collection(`users/${this.user.id}/stores/${this.store.id}/clients`)
      .get()
      .toPromise();
    const data = doc.docs;
    return data.map((data) => {
      const client = data.data() as Client;
      client.id = data.id;
      return Builder(Client)
        .email(client.email)
        .id(client.id)
        .label(client.label)
        .lada(client.lada)
        .name(client.name)
        .phone(client.phone)
        .style(client.style)
        .positiveBalance(client.positiveBalance)
        .build();
    });
  }

  async createClient(client: Client): Promise<void> {
    const newClient = client.toObj();
    const id = this.af.createId();
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/clients/${id}`)
      .set(newClient);
  }

  async updateClient(client: Client): Promise<void> {
    const newClient = client.toObj();
    const id = client.id;
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/clients/${id}`)
      .set(newClient);
  }

  async deleteClient(id: string): Promise<void> {
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/clients/${id}`)
      .delete();
  }

  async getClientById(id: string): Promise<Client> {
    await this.getSetupData();
    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/clients/${id}`)
      .get()
      .toPromise();
    if (doc.exists) {
      return doc.data() as Client;
    } else {
      return null;
    }
  }

  async updateSettings(settings: ClientsSettings): Promise<void> {
    const newSettings = settings.toObj();
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/clients`)
      .set(newSettings);
  }

  async getSettings(): Promise<ClientsSettings> {
    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/clients`)
      .get()
      .toPromise();
    if (doc.exists) {
      const data = doc.data() as ClientsSettings;
      return data;
    } else {
      return null;
    }
  }
}
