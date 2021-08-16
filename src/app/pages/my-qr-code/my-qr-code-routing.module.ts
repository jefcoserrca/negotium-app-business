import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyQrCodePage } from './my-qr-code.page';

const routes: Routes = [
  {
    path: '',
    component: MyQrCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyQrCodePageRoutingModule {}
