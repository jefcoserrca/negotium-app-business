import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StripeData } from '../models/store';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private authSrv: AuthenticationService,
    private af: AngularFirestore,
    private http: HttpClient,
    private storeSrv: StoreService
  ) {}

  async createAccount(data: any): Promise<boolean> {
    try {
      const user = await this.authSrv.signUpWithEmail({
        name: '',
        email: data.account.email,
        password: data.account.password,
      });

      await this.saveUserData(user);
      const storeId = await this.storeSrv.createStore(data.store, user.uid);
      if (data.store.picture) {
        await this.storeSrv.updatePictureStore(
          data.store.picture,
          storeId,
          user.uid
        );
      }
      if (data.store.banner) {
        await this.storeSrv.updateBannerStore(
          data.store.banner,
          storeId,
          user.uid
        );
      }
      await this.createUserStripe({
        userId: user.uid,
        storeId,
        email: user.email,
      }).toPromise();

      await this.authSrv.signInWithEmailAndPassword({
        email: data.account.email,
        password: data.account.password,
      });
      return true;
    } catch {
      return false;
    }
  }

  private async saveUserData(user: firebase.User): Promise<void> {
    await this.af.doc(`users/${user.uid}`).set({
      id: user.uid,
      email: user.email,
      subscription: 'free',
      created_at: new Date().toISOString(),
    });
  }

  private createUserStripe(data: {
    userId: string;
    storeId: string;
    email: string;
  }): Observable<any> {
    return this.http
      .post(`${environment.api}/stripe-createCustomer`, data)
      .pipe();
  }

  public attachPaymentMethod(data: {
    customerId: string;
    paymentMethodId: string;
  }): Observable<any> {
    return this.http
      .post(`${environment.api}/stripe-attachPaymentMethod`, data)
      .pipe();
  }

  public updateItem(data: {
    itemId: string;
    priceId: string;
    quantity: number;
  }): Observable<any> {
    console.log(data.priceId)
    return this.http.post(`${environment.api}/stripe-updateItem`, data).pipe();
  }

  public getItemsList(data: { subscriptionId: string }): Observable<any> {
    return this.http
      .post(`${environment.api}/stripe-getItems`, data)
      .pipe();
  }

  public createSubscription(data: {
    customerId: string;
    paymentMethodId: string;
    priceId: string;
    type: 'pro' | 'vip';
    userId: string;
  }): Observable<any> {
    data.priceId =
      data.type === 'pro'
        ? environment.stripeProducts.pro
        : environment.stripeProducts.vip;
    return this.http
      .post(`${environment.api}/stripe-createSubscription`, data)
      .pipe();
  }

  public createAccountStripe(data: {
    userId: string;
    storeId: string;
    email: string;
  }): Observable<any> {
    return this.http
      .post(`${environment.api}/stripeConnect-createAccount`, data)
      .pipe();
  }

  public createLinkAccount(data: {
    accountId: string;
    refreshUrl: string;
    returnUrl: string;
  }): Observable<any> {
    return this.http
      .post(`${environment.api}/stripeConnect-accountLink`, data)
      .pipe();
  }

  public getStripeAccount(data: { accountId: string }): Observable<any> {
    return this.http
      .post(`${environment.api}/stripeConnect-getAccount`, data)
      .pipe();
  }

  public getDashboardLink(data: { accountId: string }): Observable<any> {
    return this.http
      .post(`${environment.api}/stripeConnect-dashboardLink`, data)
      .pipe();
  }

  public async updateStripeData(
    userId: string,
    storeId: string,
    stripeData: StripeData
  ): Promise<void> {
    const data = stripeData.toObj();
    await this.af
      .doc(`users/${userId}/stores/${storeId}`)
      .update({ stripeData: data });
  }
}
