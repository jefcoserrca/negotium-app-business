import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountCouponsPageRoutingModule } from './discount-coupons-routing.module';

import { DiscountCouponsPage } from './discount-coupons.page';
import { CommonsModule } from '../../modules/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    FormsModule,
    IonicModule,
    DiscountCouponsPageRoutingModule
  ],
  declarations: [DiscountCouponsPage]
})
export class DiscountCouponsPageModule {}
