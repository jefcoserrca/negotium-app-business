import { Injectable } from '@angular/core';
import { Builder } from 'builder-pattern';
import { Coupon } from '../models/coupon';
import { User } from '../models/user';
import { Store } from '../models/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CouponsService {
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

  public async getCoupons(): Promise<Array<Coupon>> {
    this.user = this.user
      ? this.user
      : await this.authSrv.user.pipe(first()).toPromise();
    this.store = this.store
      ? this.store
      : await this.storeSrv.store.pipe(first()).toPromise();
    const doc = await this.af
      .collection(`users/${this.user.id}/stores/${this.store.id}/coupons`)
      .get()
      .toPromise();
    const data = doc.docs;
    return data.map((data) => {
      const coupon = data.data() as Coupon;
      return this.convertToCoupon(coupon);
    });
  }

  public async getCouponById(couponId: string): Promise<Coupon> {
    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/coupons/${couponId}`)
      .get()
      .toPromise();
    const data = doc.data();
    return this.convertToCoupon(data);
  }

  public async createNewCoupon(coupon: Coupon): Promise<any> {
    const data = coupon.toObject();
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/coupons/${coupon.id}`)
      .set(data);
  }

  public async updateCoupon(coupon: Coupon): Promise<any> {
    const data = coupon.toObject();
    await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/coupons/${coupon.id}`)
      .update(data);
  }

  public addRedeemed(couponId: string, userId: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const coupon = await this.getCouponById(couponId);
        if (coupon && coupon?.isActive) {
          const id = this.af.createId();
          await this.af
            .doc(
              `users/${this.user.id}/stores/${this.store.id}/coupons/${coupon.id}/redeemed/${id}`
            )
            .set({
              userId: userId,
              couponId: couponId,
              date: new Date().toISOString(),
            });
          resolve(true);
        } else {
          reject('Este cupón no es válido');
        }
      } catch (error) {
        reject('Este cupón no es válido');
      }
    });
  }

  async deleteCoupon(couponId: string): Promise<void> {
    return await this.af
      .collection(`users/${this.user.id}/stores/${this.store.id}/coupons`)
      .doc(couponId)
      .delete();
  }

  convertToCoupon(data: any): Coupon {
    return Builder(Coupon)
      .availableDays(data.availableDays)
      .availableEndHour(data.availableEndHour)
      .availableHours(data.availableHours)
      .availableStartHour(data.availableStartHour)
      .id(data.id)
      .isActive(data.isActive)
      .products(data.products)
      .redeemableInStore(data.redeemableInStore)
      .redeemableInWeb(data.redeemableInWeb)
      .styles(data.styles)
      .text(data.text)
      .title(data.title)
      .type(data.type)
      .value(data.value)
      .build();
  }
}
