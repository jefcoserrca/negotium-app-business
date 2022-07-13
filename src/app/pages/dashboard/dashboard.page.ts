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
  storeId: string;
  listener: Subscription;
  storeListener: Subscription;
  private tools: Tools;
  constructor(
    public authSrv: AuthenticationService,
    public storageSrv: StorageService,
    public storeSrv: StoreService
  ) {
    this.initStoreSubscription();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a
   * directive.
   */
  async ngOnInit(): Promise<void> {
    await this.initStoreSetup();
  }

  /**
   * If the storeListener is closed, then we need to initialize the store subscription
   */
  ionViewDidEnter() {
    if (this.storeListener.closed) {
      this.initStoreSubscription();
    }
  }

  /**
   * We unsubscribe from the store listener and the listener
   */
  ionViewWillLeave() {
    this.storeListener.unsubscribe();
    this.listener.unsubscribe();
    this.store = undefined;
    this.storeId = null;
  }

  /**
   * It gets the user, gets the storeId from storage, if there is no storeId, it gets the stores from
   * the server, sets the storeId to the first store in the list, and saves the storeId to storage
   */
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

  /**
   * We're subscribing to the store and when we get data back, we're setting the tools to the active
   * tools in the store, getting the tools, and setting the store to the data we got back
   */
  private initStoreSubscription(): void {
    this.storeListener = this.storeSrv.store.subscribe(
      (data) => {
        if (data) {
          this.tools = data.activeTools;
          this.getTools();
          this.store = data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * It creates an array of objects that contain the icon, label, and path for each menu item
   */
  private getTools(): void {
    this.menuItems = [];
    if (this.tools.digitalMenu) {
      this.menuItems.push({
        icon: 'storefront',
        label: 'Mi e-Pizzeria',
        path: '/dashboard/store',
      });
    }
    if (false) {
      this.menuItems.push({
        icon: 'ticket',
        label: 'Ofertas y cupones',
        path: '/dashboard/discount-coupons',
      });
    }
    if (false) {
      this.menuItems.push({
        icon: 'storefront',
        label: 'Mi tienda',
        path: '/dashboard/store',
      });
    }
    if (true) {
      this.menuItems.push({
        icon: 'bicycle',
        label: 'Servicio a domicilio',
        path: '/dashboard/delivery',
      });
    }
    this.menuItems.push({
      icon: 'barcode',
      label: 'Punto de venta',
      path: '/dashboard/sales',
    });
    if (true) {
      this.menuItems.push({
        icon: 'clipboard',
        label: 'Ordenes',
        path: '/dashboard/orders',
      });
    }
    this.menuItems.push({
      icon: 'people',
      label: 'Clientes',
      path: '/dashboard/clients',
    });
    this.menuItems.push({
      icon: 'notifications',
      label: 'Notificaciones',
      path: '/dashboard/notifications',
    });
    this.menuItems.push({
      icon: 'qr-code',
      label: 'Generar QR',
      path: '/dashboard/my-qr-code',
    });
  }
}
