import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { first } from 'rxjs/operators';
import { Builder } from 'builder-pattern';
import { Store, Tools, StoreStyles } from '../models/store';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private store$: BehaviorSubject<Store> = new BehaviorSubject<Store>(null);
  get store(): Observable<Store> {
    return this.store$.asObservable();
  }
  constructor(private af: AngularFirestore) {}

  async createStore(storeData: any, userId: string): Promise<string> {
    const storeId = this.af.createId();
    await this.af.doc(`users/${userId}/stores/${storeId}`).set({
      id: storeId,
      name: storeData.name,
      banner: null,
      picture: null,
      category: storeData.category,
      phone: storeData.phone,
      stripeAccount: null,
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
      .stripeAccount(data.stripeAccount)
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
        Builder(StoreStyles)
          .content(data.styles.content)
          .navbar(data.styles.navbar)
          .storeCard(data.styles.storeCard)
          .structureHighlights(data.styles.structureHighlights)
          .structureProducts(data.styles.structureProducts)
          .structureProductsByCategory(data.styles.structureProductsByCategory)
          .topbar(data.styles.topbar)
          .linearGradient(data.styles.linearGradient)
          .build()
      )
      .contactData(data.contactData)
      .build();
  }
}
