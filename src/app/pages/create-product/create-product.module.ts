import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateProductPageRoutingModule } from './create-product-routing.module';

import { CreateProductPage } from './create-product.page';
import { CommonsModule } from '../../modules/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateProductPageRoutingModule
  ],
  declarations: [CreateProductPage]
})
export class CreateProductPageModule {}
