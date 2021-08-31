import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PricingPlansPage } from './pricing-plans.page';

const routes: Routes = [
  {
    path: '',
    component: PricingPlansPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PricingPlansPageRoutingModule {}
