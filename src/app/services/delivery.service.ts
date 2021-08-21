import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Store, Delivery } from '../models/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { first } from 'rxjs/operators';
import { Deliverier } from '../models/deliverier';
import { Builder } from 'builder-pattern';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  user: User;
  store: Store;
  constructor(
    private af: AngularFirestore,
    private authSrv: AuthenticationService,
    private storeSrv: StoreService
  ) {
    this.authSrv.user
      .pipe(first())
      .toPromise()
      .then((data) => (this.user = data));
    this.storeSrv.store
      .pipe(first())
      .toPromise()
      .then((data) => (this.store = data));
  }

  async updateDelivery(delivery: Delivery): Promise<void> {
    const deliveryObj = delivery.toObj();
    this.user = this.user
      ? this.user
      : await this.authSrv.user.pipe(first()).toPromise();
    this.store = this.store
      ? this.store
      : await this.storeSrv.store.pipe(first()).toPromise();

    await this.af.doc(`users/${this.user.id}/stores/${this.store.id}`).update({
      delivery: deliveryObj,
    });

    return;
  }

  async createDeliverier(deliverier: Deliverier): Promise<void> {
    const newDeliverier = deliverier.toObj();
    const id = this.af.createId();
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/deliveriers/${id}`)
      .set(newDeliverier);
  }

  async updateDeliverier(deliverier: Deliverier): Promise<void> {
    const newDeliverier = deliverier.toObj();
    const id = deliverier.id;
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/deliveriers/${id}`)
      .set(newDeliverier);
  }

  async deleteDeliverier(id: string): Promise<void> {
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/deliveriers/${id}`)
      .delete();
  }

  public async getDeliveriers(): Promise<Array<Deliverier>> {
    await this.getSetupData();
    const doc = await this.af
      .collection(`users/${this.user.id}/stores/${this.store.id}/deliveriers`)
      .get()
      .toPromise();
    const data = doc.docs;
    return data.map((data) => {
      const deliverier = data.data() as Deliverier;
      deliverier.id = data.id;
      return Builder(Deliverier)
        .email(deliverier.email)
        .id(deliverier.id)
        .label(deliverier.label)
        .lada(deliverier.lada)
        .name(deliverier.name)
        .phone(deliverier.phone)
        .style(deliverier.style)
        .build();
    });
  }

  private async getSetupData(): Promise<void> {
    this.user = this.user
      ? this.user
      : await this.authSrv.user.pipe(first()).toPromise();
    this.store = this.store
      ? this.store
      : await this.storeSrv.store.pipe(first()).toPromise();
  }
}
