import { Injectable } from '@angular/core';
import { Store } from '../models/store';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { Sale } from '../models/sale';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
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

  async createSale(sale: Sale): Promise<void> {
    await this.getSetupData();
    const newSale = sale.toObj();
    console.log(newSale);
    const id = this.af.createId();
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/sales/${id}`)
      .set(newSale);
  }

  async getSales(start: string, end: string): Promise<Observable<Array<any>>> {
    await this.getSetupData();
    return this.af
      .collection(
        `users/${this.user.id}/stores/${this.store.id}/sales/`,
        (ref) =>
          ref
            .orderBy('date', 'desc')
            .where('date', '>=', start)
            .where('date', '<=', end)
      )
      .valueChanges({ idField: 'id' });
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
