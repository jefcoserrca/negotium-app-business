import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../../services/modals.service';
import { StoreService } from '../../services/store.service';
import { Shipping, Store } from '../../models/store';
import { first } from 'rxjs/operators';
import { Builder } from 'builder-pattern';
import { ShippingData } from '../../interfaces/store-shipping';
import { ToastService } from '../../services/toast.service';
import { ShippingService } from '../../services/shipping.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.page.html',
  styleUrls: ['./shipping.page.scss'],
})
export class ShippingPage implements OnInit {
  private store: Store;
  shipping: Shipping = Builder(Shipping).isActive(false).shippings([]).build();
  newChanges: boolean = false;
  constructor(
    private modalsSrv: ModalsService,
    private shippingSrv: ShippingService,
    private storeSrv: StoreService,
    private toastSrv: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.shipping.isActive = this.store.shipping?.isActive
      ? this.store.shipping.isActive
      : false;
    this.shipping.shippings = this.store.shipping?.shippings.length
      ? this.store.shipping?.shippings.map((shipping) => {
          return { ...shipping };
        })
      : [];
  }

  async toggleChange(): Promise<void> {
    if (this.shipping.isActive && !this.shipping.shippings?.length) {
      await this.createNewShipping();
    }
    if (
      this.shipping.shippings.length &&
      this.shipping.isActive !== this.store.shipping.isActive
    ) {
      this.newChanges = true;
    }
  }

  async createNewShipping(): Promise<void> {
    if (
      this.store.typeAccount === 'free' &&
      this.shipping.shippings.length > 0
    ) {
      await this.modalsSrv.openActivateProModal(
        'Para añadir más opciones de envío, tienes que llevar tu negocio a un plan PRO'
      );
    } else {
      const newShipping = await this.modalsSrv.openCreateShippingModal();
      if (newShipping) {
        this.shipping.shippings.push(newShipping);
        this.newChanges = true;
        console.log(newShipping);
      }
      if (!this.shipping.shippings.length) {
        this.shipping.isActive = false;
      }
    }
  }

  async editShipping(shippingData: ShippingData, index: number) {
    const newShipping = await this.modalsSrv.openCreateShippingModal(
      shippingData
    );
    if (newShipping) {
      if (newShipping === 'deleted') {
        this.shipping.shippings.splice(index, 1);
        this.shipping.isActive = this.shipping.shippings.length ? true : false;
      } else {
        this.shipping.shippings[index] = newShipping;
      }
      this.newChanges = true;
    } else {
      return;
    }
  }

  revertChanges(): void {
    this.shipping.shippings = this.store.shipping
      ? [...this.store.shipping.shippings]
      : [];
    this.shipping.isActive = this.store.shipping
      ? this.store.shipping.isActive
      : false;
    this.newChanges = false;
  }

  async saveChanges(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const newShipping = Builder(Shipping)
        .isActive(this.shipping.isActive)
        .shippings(this.shipping.shippings)
        .build();
      await this.shippingSrv.updateShipping(newShipping);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showDefaultNotify(
        'Los cambios se han publicado!',
        'success'
      );
      this.newChanges = false;
    } catch (error) {
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal, intenta más tarde'
      );
    }
  }
}
