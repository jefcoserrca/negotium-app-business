import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorePageRoutingModule } from './store-routing.module';

import { StorePage } from './store.page';
import { CommonsModule } from '../../modules/commons/commons.module';
import { StoreHeaderDirective } from '../../directives/store-header.directive';
import { CommonDirectivesModule } from '../../directives/common-directives.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    CommonDirectivesModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule
  ],
  declarations: [StorePage]
})
export class StorePageModule {}
