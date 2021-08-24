import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingPageRoutingModule } from './shipping-routing.module';

import { ShippingPage } from './shipping.page';
import { CommonsModule } from '../../modules/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    FormsModule,
    IonicModule,
    ShippingPageRoutingModule,
  ],
  declarations: [ShippingPage],
})
export class ShippingPageModule {}
