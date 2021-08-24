import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Shipping, Store } from '../models/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
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

  async updateShipping(shipping: Shipping): Promise<void> {
    const shippingObj = shipping.toObj();
    this.user = this.user
      ? this.user
      : await this.authSrv.user.pipe(first()).toPromise();
    this.store = this.store
      ? this.store
      : await this.storeSrv.store.pipe(first()).toPromise();

    await this.af.doc(`users/${this.user.id}/stores/${this.store.id}`).update({
      shipping: shippingObj,
    });

    return;
  }
}
