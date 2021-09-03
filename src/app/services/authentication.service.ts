import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { Builder } from 'builder-pattern';
import { AngularFirestore } from '@angular/fire/firestore';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  get user(): Observable<User> {
    return this.user$.asObservable();
  }

  constructor(
    private afAuth: AngularFireAuth,
    private af: AngularFirestore,
    private loadingCtrl: LoadingController,
    private storageSrv: StorageService
  ) {
    this.listenUserSession();
  }

  private currentUserChanges(userId: string): void {
    this.af
      .doc(`users/${userId}`)
      .valueChanges()
      .subscribe((data: User) => {
        if (data) {
          this.updateSubscriptionData(
            data.subscriptionStatus,
            data.subscription
          );
        }
      });
  }

  public async signInWithEmailAndPassword(data: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.afAuth.signInWithEmailAndPassword(
      data.email,
      data.password
    );

    await this.setUserSession(user.user);
  }

  public async signUpWithEmail(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<firebase.User> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      data.email,
      data.password
    );
    await credential.user.updateProfile({ displayName: data.name });
    //this.setUserSession(credential.user);
    return credential.user;
  }

  public async factoryLoadUserSession(): Promise<void> {
    const loadingRef = await this.loadingCtrl.create({
      cssClass: 'app-loading',
      message: 'Recuperando información...',
      showBackdrop: true,
      spinner: 'crescent',
      duration: 0,
    });
    await loadingRef.present();
    const userSession = await this.getUserSession().pipe(first()).toPromise();
    await this.setUserSession(userSession);
    await loadingRef.dismiss();
  }

  private listenUserSession(): void {
    this.getUserSession().subscribe(this.setUserSession);
  }

  private getUserSession(): Observable<firebase.User> {
    return this.afAuth.user;
  }

  private static getFirstAndLastName(fullname: string): {
    firstName: string;
    lastName: string;
  } {
    let firstName: string;
    let lastName: string;

    const nameList = fullname ? fullname.split(' ') : [];

    if (nameList.length === 0) {
      firstName = '';
      lastName = '';
    } else if (nameList.length === 1) {
      firstName = nameList[0];
      lastName = '';
    } else if (nameList.length === 2) {
      firstName = nameList[0];
      lastName = nameList[1];
    } else if (nameList.length === 3) {
      firstName = nameList[0];
      lastName = nameList.slice(1, nameList.length).join(' ');
    } else if (nameList.length === 4) {
      firstName = nameList.slice(0, 2).join(' ');
      lastName = nameList.slice(2, nameList.length).join(' ');
    } else {
      firstName = nameList.slice(0, nameList.length - 2).join(' ');
      lastName = nameList.slice(nameList.length - 2, nameList.length).join(' ');
    }

    return {
      firstName,
      lastName,
    };
  }

  private setUserSession = async (user: firebase.User) => {
    if (user) {
      const { firstName, lastName } = AuthenticationService.getFirstAndLastName(
        user.displayName
      );
      const getUser: any = await this.af
        .doc(`users/${user.uid}`)
        .get()
        .toPromise();
      this.currentUserChanges(user.uid);
      this.user$.next(
        Builder(User)
          .id(user.uid)
          .token(await user.getIdToken())
          .fullName(user.displayName)
          .firstName(firstName)
          .lastName(lastName)
          .picture(user.photoURL)
          .email(user.email)
          .emailVerified(user.emailVerified)
          .subscriptionId(getUser.exists ? getUser.data().subscriptionId : null)
          .subscriptionStatus(
            getUser.exists ? getUser.data().subscriptionStatus : null
          )
          .subscription(getUser.exists ? getUser.data().subscription : 'free')
          .stripeCustomer(getUser.exists ? getUser.data().stripeCustomer : null)
          .provider(user.providerData.map((provider) => provider.providerId))
          .build()
      );
    } else {
      this.user$.next(null);
    }
  };

  public async logout(): Promise<void> {
    await this.storageSrv.removeStoreId();
    await this.afAuth.signOut();
  }

  private updateSubscriptionData(
    status: string,
    type: 'free' | 'pro' | 'vip'
  ): void {
    this.user$.next({
      ...this.user$.value,
      subscriptionStatus: status ? status : null,
      subscription: type ? type : null,
    });
  }

  public async resetPassword(email: string): Promise<void> {
    await this.afAuth.sendPasswordResetEmail(email);
  }
}

export function factoryUserSession(authSrv: AuthenticationService) {
  return async () => {
    await authSrv.factoryLoadUserSession();
  };
}
