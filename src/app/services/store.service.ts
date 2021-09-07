import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { first, map } from 'rxjs/operators';
import { Builder } from 'builder-pattern';
import {
  Store,
  Tools,
  StoreStyles,
  Delivery,
  Shipping,
  StripeData,
} from '../models/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../models/user';
import { ToastService } from './toast.service';
import { AuthenticationService } from './authentication.service';
import { ToolsService } from './tools.service';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private store$: BehaviorSubject<Store> = new BehaviorSubject<Store>(null);
  get store(): Observable<Store> {
    return this.store$.asObservable();
  }
  listener: Subscription;
  user: User;
  constructor(
    private af: AngularFirestore,
    private authSrv: AuthenticationService,
    private toastSrv: ToastService,
    private toolsSrv: ToolsService
  ) {
    this.authSrv.user.subscribe(async (user) => {
      this.user = user;
      if (user && this.store$.value) {
        this.updateAccount(user.subscription);
      }
    });
  }

  async createStore(storeData: any, userId: string): Promise<string> {
    const storeId = this.af.createId();
    await this.af.doc(`users/${userId}/stores/${storeId}`).set({
      id: storeId,
      name: storeData.name,
      banner: null,
      picture:
        'https://firebasestorage.googleapis.com/v0/b/digitaliza-tu-empresa.appspot.com/o/asstes%2Fdefault-logo.png?alt=media&token=de67cebf-27c1-4152-aa92-2fda42549fd6',
      category: storeData.category,
      phone: storeData.phone,
      stripeAccount: null,
      stripeCustomer: null,
      typeAccount: 'free',
      activeTools: { digitalMenu: true, couponSystem: true, qrCode: true },
      created_at: new Date().toISOString(),
    });

    return storeId;
  }

  async updateStore(
    storeData: any,
    userId: string,
    storeId: string
  ): Promise<boolean> {
    await this.af.doc(`users/${userId}/stores/${storeId}`).update(storeData);
    return true;
  }

  async getStore(userId: string, storeId: string): Promise<Store> {
    const doc = await this.af
      .doc(`users/${userId}/stores/${storeId}`)
      .get()
      .pipe(first())
      .toPromise();
    const data = doc.data() as any;
    return this.buildStoreModel(data);
  }

  async getStores(userId: string): Promise<Array<Store>> {
    const collection = await this.af
      .collection(`users/${userId}/stores/`)
      .get()
      .pipe(first())
      .toPromise();
    const stores = collection.docs.map((doc) => {
      const data = doc.data() as any;
      return this.buildStoreModel(data);
    });

    return stores;
  }

  setStore(store: Store) {
    this.store$.next(store);
  }

  private updateAccount(type: 'free' | 'pro' | 'vip') {
    this.store$.next({ ...this.store$.value, typeAccount: type });
  }

  getCurrentStore(
    userId: string,
    storeId: string,
    status: 'free' | 'pro' | 'vip'
  ): Subscription {
    console.log('me ejecute bro');
    return this.af
      .doc(`users/${userId}/stores/${storeId}`)
      .valueChanges()
      .subscribe(
        async (data: Store) => {
          if (this.user) {
            if (data) {
              data.typeAccount = status;
              const store = this.buildStoreModel(data);
              console.log('mande store');
              this.setStore(store);
            } else {
              await this.authSrv.logout();
              setTimeout(async () => {
                await this.toolsSrv.goToLogin();
              }, 100);
              await this.toastSrv.showErrorNotify(
                'No se pudo obtener la tienda'
              );
            }
          }
        },
        async (err) => {
          await this.toastSrv.showErrorNotify('Ops! Ha ocurrido un error');
        }
      );
  }

  async updatePictureStore(
    file: any,
    storeId: string,
    userId: string
  ): Promise<void> {
    const picture = await this.uploadImage({
      id: storeId,
      file: file,
      type: 'picture',
    });
    await this.af.doc(`users/${userId}/stores/${storeId}`).update({
      picture: picture,
    });
  }

  async updateBannerStore(
    file: any,
    storeId: string,
    userId: string
  ): Promise<void> {
    const banner = await this.uploadImage({
      id: storeId,
      file: file,
      type: 'banner',
    });
    await this.af.doc(`users/${userId}/stores/${storeId}`).update({
      banner: banner,
    });
  }

  uploadImage(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(data);
      let storeRef = firebase.storage().ref();
      const path = `storesImg/${data.id}-${data.type}`;
      let uploadTask: firebase.storage.UploadTask = storeRef
        .child(path)
        .putString(data.file, 'data_url', { contentType: 'image/jpeg' });

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          reject(err);
        },
        async () => {
          resolve(await storeRef.child(path).getDownloadURL());
        }
      );
    });
  }

  private buildStoreModel(data: any): Store {
    return Builder(Store)
      .banner(data.banner)
      .category(data.category)
      .id(data.id)
      .name(data.name)
      .phone(data.phone)
      .picture(data.picture)
      .stripeCustomer(data.stripeCustomer)
      .stripeAccount(data.stripeAccount ? data.stripeAccount : null)
      .typeAccount(data.typeAccount)
      .activeTools(
        Builder(Tools)
          .couponSystem(data.activeTools.couponSystem)
          .customDomain(data.activeTools.customDomain)
          .customStore(data.activeTools.customStore)
          .deliverySystem(data.activeTools.deliverySystem)
          .digitalMenu(data.activeTools.digitalMenu)
          .payments(data.activeTools.payments)
          .qrCode(data.activeTools.qrCode)
          .whatsappOrders(data.activeTools.whatsappOrders)
          .build()
      )
      .styles(
        data.styles
          ? Builder(StoreStyles)
              .content(data.styles.content)
              .navbar(data.styles.navbar)
              .storeCard(data.styles.storeCard)
              .structureHighlights(data.styles.structureHighlights)
              .structureProducts(data.styles.structureProducts)
              .structureProductsByCategory(
                data.styles.structureProductsByCategory
              )
              .topbar(data.styles.topbar)
              .linearGradient(data.styles.linearGradient)
              .build()
          : null
      )
      .contactData(data.contactData)
      .categoryIcon(data.categoryIcon)
      .delivery(
        !data.delivery
          ? null
          : Builder(Delivery)
              .deliveryCost(data.delivery?.deliveryCost)
              .freeShippingAmount(data.delivery?.freeShippingAmount)
              .isActive(data.delivery?.isActive)
              .minPurchaseAmount(data.delivery?.minPurchaseAmount)
              .zones(data.delivery?.zones)
              .build()
      )
      .shipping(
        !data.shipping
          ? null
          : Builder(Shipping)
              .isActive(data.shipping.isActive)
              .shippings(data.shipping.shippings)
              .build()
      )
      .stripeData(
        Builder(StripeData)
          .chargesEnabled(data.stripeData?.chargesEnabled)
          .payoutsEnabled(data.stripeData?.payoutsEnabled)
          .isActive(data.stripeData?.isActive)
          .build()
      )
      .build();
  }
}
