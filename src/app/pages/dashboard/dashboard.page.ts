import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { StoreService } from '../../services/store.service';
import { first } from 'rxjs/operators';
import { Store, Tools } from '../../models/store';
import { StorageService } from '../../services/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  store: Store;
  stores: Array<Store> = [];
  menuItems: any = [];
  private tools: Tools;
  storeId: string;
  listener: Subscription;
  storeListener: Subscription;
  constructor(
    public authSrv: AuthenticationService,
    public storageSrv: StorageService,
    public storeSrv: StoreService
  ) {
    this.storeListener = this.storeSrv.store.subscribe((data) => {
      if (data) {
        console.log(data);
        this.tools = data.activeTools;
        this.getTools();
        this.store = data;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initStoreSetup();
  }

  ionViewWillLeave() {
    this.storeListener.unsubscribe();
    this.listener.unsubscribe();
    this.store = undefined;
    this.storeId = null;
  }

  private async initStoreSetup(): Promise<void> {
    const user = await this.authSrv.user.pipe(first()).toPromise();
    this.storeId = await this.storageSrv.getStoreId();
    if (!this.storeId) {
      this.stores = await this.storeSrv.getStores(user.id);
      this.storeId = this.stores[0].id;
      await this.storageSrv.saveStoreId(this.storeId);
    }
    this.listener = this.storeSrv.getCurrentStore(
      user.id,
      this.storeId,
      user.subscription
    );
  }

  private getTools(): void {
    this.menuItems = [];
    if (this.tools.digitalMenu)
      this.menuItems.push({
        icon: 'storefront',
        label: 'Mi tienda online',
        path: '/dashboard/store',
      });
    this.menuItems.push({
      icon: 'qr-code',
      label: 'Mi QR',
      path: '/dashboard/my-qr-code',
    });
    if (this.tools.couponSystem)
      this.menuItems.push({
        icon: 'ticket',
        label: 'Ofertas y cupones',
        path: '/dashboard/discount-coupons',
      });
    if (this.tools.customStore)
      this.menuItems.push({
        icon: 'storefront',
        label: 'Mi tienda',
        path: '/dashboard/store',
      });
    if (true)
      this.menuItems.push({
        icon: 'clipboard',
        label: 'Ordenes',
        path: '/dashboard/orders',
      });

    if (true)
      this.menuItems.push({
        icon: 'bicycle',
        label: 'Servicio a domicilio',
        path: '/dashboard/delivery',
      });
  }
}
