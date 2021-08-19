import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { Store } from '../models/store';
import { User } from '../models/user';
import { first } from 'rxjs/operators';
import { UserProgress } from '../models/progress';
import { ProductsService } from './products.service';
import { QrCodesService } from './qr-codes.service';
import { CouponsService } from './coupons.service';
import { Builder } from 'builder-pattern';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  user: User;
  store: Store;
  constructor(
    private af: AngularFirestore,
    private authSrv: AuthenticationService,
    private storeSrv: StoreService,
    private productsSrv: ProductsService,
    private qrcodesSrv: QrCodesService,
    private couponsSrv: CouponsService
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

  async getProgress(): Promise<UserProgress> {
    this.user = this.user
      ? this.user
      : await this.authSrv.user.pipe(first()).toPromise();
    this.store = this.store
      ? this.store
      : await this.storeSrv.store.pipe(first()).toPromise();

    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/progress`)
      .get()
      .toPromise();
    if (doc.exists) {
      const data = doc.data();
      return data as UserProgress;
    } else {
      return await this.updateProgress();
    }
  }

  async updateProgress(): Promise<UserProgress> {
    this.user = this.user
      ? this.user
      : await this.authSrv.user.pipe(first()).toPromise();
    this.store = this.store
      ? this.store
      : await this.storeSrv.store.pipe(first()).toPromise();
    const coupons = await this.couponsSrv.getCoupons();
    const products = await this.productsSrv.getProducts();
    const qrCodes = await this.qrcodesSrv.getQrCodes();
    const progress = Builder(UserProgress)
      .coupons(coupons?.length > 0 ? true : false)
      .products(products?.length > 0 ? true : false)
      .qrCodes(qrCodes?.qrCodeFormat ? true : false)
      .store(this.store.styles ? true : false)
      .build();
    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/progress`)
      .set(progress.toObj());
    return progress;
  }
}
