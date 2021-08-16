import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { User } from '../models/user';
import { Store } from '../models/store';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QrCodesService {
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

  public async getQrCodes(): Promise<any> {

    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/qr-codes`)
      .get()
      .toPromise();
    const data = doc.data();
    return data;
  }

  public async updateQrCodes(qrCode: {
    qrCodeFormat: any;
    socialQrCodes: Array<any>;
  }): Promise<any> {
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/qr-codes`)
      .set(qrCode);
  }
}
