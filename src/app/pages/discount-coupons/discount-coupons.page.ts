import { Component, OnInit } from '@angular/core';
import { Coupon } from 'src/app/models/coupon';
import { CouponsService } from '../../services/coupons.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-discount-coupons',
  templateUrl: './discount-coupons.page.html',
  styleUrls: ['./discount-coupons.page.scss'],
})
export class DiscountCouponsPage implements OnInit {
  coupons: Array<Coupon> = [];
  allCoupons: Array<Coupon>;
  searchTerm: string;
  showLoading: boolean = true;
  init: boolean;
  scannerEnable = false;
  showAlert: boolean;
  alertType: 'error' | 'success';
  constructor(
    private couponsSrv: CouponsService,
    private toastSrv: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.init = true;
    this.showLoading = true;
    this.coupons = await this.couponsSrv.getCoupons();
    this.allCoupons = [...this.coupons];
    this.showLoading = false;
  }

  async ionViewDidEnter() {
    if (this.init) {
      this.init = false;
    } else {
      this.coupons = await this.couponsSrv.getCoupons();
      this.allCoupons = [...this.coupons];
    }
  }

  searchByTerm(): void {
    if (this.searchTerm) {
      this.coupons = this.allCoupons.filter((item) => {
        return (
          item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        );
      });
    } else {
      this.coupons = [...this.allCoupons];
    }
  }

  tabChange(ev: any): void {
    if (ev.index === 1) {
      this.scannerEnable = true;
    } else {
      this.showLoading = false;
      this.scannerEnable = false;
    }
  }

  async scanCompleteHandler(ev: any): Promise<void> {
    if (ev) {
      const data = ev.text;
      if (data.split('_')?.length > 1) {
        try {
          this.scannerEnable = false;
          this.showLoading = true;
          const couponId = data.split('_')[0];
          const userId = data.split('_')[1];
          await this.couponsSrv.addRedeemed(couponId, userId);
          this.alertType = 'success';
          this.showAlert = true;
          this.showLoading = false;
          this.toastSrv.showDefaultNotify(
            'El cupón ha sido aplicado',
            'success'
          );
        } catch (error) {
          this.alertType = 'error';
          this.showAlert = true;
          this.showLoading = false;
          this.toastSrv.showErrorNotify(
            'El cupón no es válido, Intenta de nuevo.'
          );
        }
      } else {
        return;
      }
    }
  }

  reset(): void {
    this.scannerEnable = true;
    this.showLoading = false;
    this.showAlert = false;
  }
}
