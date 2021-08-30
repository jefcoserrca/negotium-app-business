import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'create-product',
        loadChildren: () =>
          import('../create-product/create-product.module').then(
            (m) => m.CreateProductPageModule
          ),
      },
      {
        path: 'edit-product/:id',
        loadChildren: () =>
          import('../create-product/create-product.module').then(
            (m) => m.CreateProductPageModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../products/products.module').then(
            (m) => m.ProductsPageModule
          ),
      },
      {
        path: 'store',
        loadChildren: () =>
          import('../store/store.module').then((m) => m.StorePageModule),
      },
      {
        path: 'my-qr-code',
        loadChildren: () =>
          import('../my-qr-code/my-qr-code.module').then(
            (m) => m.MyQrCodePageModule
          ),
      },

      {
        path: 'discount-coupons',
        loadChildren: () =>
          import('../discount-coupons/discount-coupons.module').then(
            (m) => m.DiscountCouponsPageModule
          ),
      },
      {
        path: 'create-coupon',
        loadChildren: () =>
          import('../create-coupon/create-coupon.module').then(
            (m) => m.CreateCouponPageModule
          ),
      },
      {
        path: 'edit-coupon/:id',
        loadChildren: () =>
          import('../create-coupon/create-coupon.module').then(
            (m) => m.CreateCouponPageModule
          ),
      },
      {
        path: 'delivery',
        loadChildren: () =>
          import('../delivery/delivery.module').then(
            (m) => m.DeliveryPageModule
          ),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('../clients/clients.module').then((m) => m.ClientsPageModule),
      },
      {
        path: 'shipping',
        loadChildren: () =>
          import('../shipping/shipping.module').then(
            (m) => m.ShippingPageModule
          ),
      },
      {
        path: 'sales',
        loadChildren: () => import('../payments/payments.module').then( m => m.PaymentsPageModule)
      },
      {
        path: 'sales/:path',
        loadChildren: () => import('../payments/payments.module').then( m => m.PaymentsPageModule)
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
