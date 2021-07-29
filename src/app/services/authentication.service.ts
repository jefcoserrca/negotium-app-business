import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { Builder } from 'builder-pattern';
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
    private loadingCtrl: LoadingController
  ) {
    this.listenUserSession();
  }

  public async signInWithEmailAndPassword(data: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.afAuth.signInWithEmailAndPassword(
      data.email,
      data.password
    );

    this.setUserSession(user.user);
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
    this.setUserSession(credential.user);
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
          .provider(user.providerData.map((provider) => provider.providerId))
          .build()
      );
    } else {
      this.user$.next(null);
    }
  };

  public async logout(): Promise<void> {
    await this.afAuth.signOut();
  }
}

export function factoryUserSession(authSrv: AuthenticationService) {
  return async () => {
    await authSrv.factoryLoadUserSession();
  };
}
