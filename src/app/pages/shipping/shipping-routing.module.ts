import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingPage } from './shipping.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingPageRoutingModule {}
