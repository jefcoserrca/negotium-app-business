import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
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
      return true;
    } catch {
      return false;
    }
  }

  private async saveUserData(user: firebase.User): Promise<void> {
    await this.af.doc(`users/${user.uid}`).set({
      id: user.uid,
      email: user.email,
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
}
