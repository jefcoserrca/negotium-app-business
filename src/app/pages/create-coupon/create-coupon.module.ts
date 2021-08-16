import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCouponPageRoutingModule } from './create-coupon-routing.module';

import { CreateCouponPage } from './create-coupon.page';
import { CommonsModule } from 'src/app/modules/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    FormsModule,
    IonicModule,
    CreateCouponPageRoutingModule,
  ],
  declarations: [CreateCouponPage],
})
export class CreateCouponPageModule {}
