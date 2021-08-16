import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyQrCodePageRoutingModule } from './my-qr-code-routing.module';

import { MyQrCodePage } from './my-qr-code.page';
import { CommonsModule } from 'src/app/modules/commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    FormsModule,
    IonicModule,
    MyQrCodePageRoutingModule,
  ],
  declarations: [MyQrCodePage],
})
export class MyQrCodePageModule {}
