import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { StoreService } from '../../services/store.service';
import { first } from 'rxjs/operators';
import { Store, Tools } from '../../models/store';
import { StorageService } from '../../services/storage.service';

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
  constructor(
    private authSrv: AuthenticationService,
    private storeSrv: StoreService,
    private storageSrv: StorageService
  ) {
    this.storeSrv.store.subscribe((data) => {
      if (data) {
        this.tools = data.activeTools;
        this.getTools();
        this.store = data;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.initStoreSetup();
  }

  private async initStoreSetup(): Promise<void> {
    const user = await this.authSrv.user.pipe(first()).toPromise();
    console.log(user);
    this.stores = await this.storeSrv.getStores(user.id);
    const storeId = await this.storageSrv.getStoreId();
    if (storeId) {
      const getStore = await this.storeSrv.getStore(user.id, storeId);
      getStore.typeAccount = user.subscription;
      this.storeSrv.setStore(getStore);
    } else {
      const storeDefault = this.stores[0];
      storeDefault.typeAccount = user.subscription;
      await this.storageSrv.saveStoreId(storeDefault.id);
      this.storeSrv.setStore(storeDefault);
    }
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
