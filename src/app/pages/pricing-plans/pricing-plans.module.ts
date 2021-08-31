import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PricingPlansPageRoutingModule } from './pricing-plans-routing.module';

import { PricingPlansPage } from './pricing-plans.page';
import { CommonsModule } from '../../modules/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    FormsModule,
    IonicModule,
    PricingPlansPageRoutingModule
  ],
  declarations: [PricingPlansPage]
})
export class PricingPlansPageModule {}
