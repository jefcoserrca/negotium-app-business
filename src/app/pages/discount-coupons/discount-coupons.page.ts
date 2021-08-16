import { Component, OnInit } from '@angular/core';
import { Coupon } from 'src/app/models/coupon';
import { CouponsService } from '../../services/coupons.service';

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
  constructor(private couponsSrv: CouponsService) {}

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
    if(this.searchTerm){
      this.coupons = this.allCoupons.filter((item) => {
        return (
          item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        );
      });
    }else {
      this.coupons = [...this.allCoupons];
    }
  }

  tabChange(ev: any): void {}
}
