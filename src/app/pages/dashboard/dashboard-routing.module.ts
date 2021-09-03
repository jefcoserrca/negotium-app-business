import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { AuthGuardService } from '../../guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'create-product',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../create-product/create-product.module').then(
            (m) => m.CreateProductPageModule
          ),
      },
      {
        path: 'edit-product/:id',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../create-product/create-product.module').then(
            (m) => m.CreateProductPageModule
          ),
      },
      {
        path: 'products',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../products/products.module').then(
            (m) => m.ProductsPageModule
          ),
      },
      {
        path: 'store',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../store/store.module').then((m) => m.StorePageModule),
      },
      {
        path: 'my-qr-code',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../my-qr-code/my-qr-code.module').then(
            (m) => m.MyQrCodePageModule
          ),
      },

      {
        path: 'discount-coupons',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../discount-coupons/discount-coupons.module').then(
            (m) => m.DiscountCouponsPageModule
          ),
      },
      {
        path: 'create-coupon',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../create-coupon/create-coupon.module').then(
            (m) => m.CreateCouponPageModule
          ),
      },
      {
        path: 'edit-coupon/:id',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../create-coupon/create-coupon.module').then(
            (m) => m.CreateCouponPageModule
          ),
      },
      {
        path: 'delivery',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../delivery/delivery.module').then(
            (m) => m.DeliveryPageModule
          ),
      },
      {
        path: 'clients',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../clients/clients.module').then((m) => m.ClientsPageModule),
      },
      {
        path: 'shipping',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../shipping/shipping.module').then(
            (m) => m.ShippingPageModule
          ),
      },
      {
        path: 'sales',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../payments/payments.module').then(
            (m) => m.PaymentsPageModule
          ),
      },
      {
        path: 'sales/:path',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('../payments/payments.module').then(
            (m) => m.PaymentsPageModule
          ),
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
