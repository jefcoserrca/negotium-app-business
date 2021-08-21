import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ModalsService } from '../../services/modals.service';
import { DeliveryZone } from 'src/app/interfaces/delivery-zone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { StoreService } from '../../services/store.service';
import { Store, Delivery } from '../../models/store';
import { first } from 'rxjs/operators';
import { DeliveryService } from '../../services/delivery.service';
import { Builder } from 'builder-pattern';
import { ToastService } from '../../services/toast.service';
import { Deliverier } from 'src/app/models/deliverier';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class DeliveryPage implements OnInit {
  latitude: any = 20.5887932;
  longitude: any = -100.3898881;
  zoom: number = 12;
  zones: Array<DeliveryZone> = [
    {
      address: 'Santiago de Querétaro, Qro., México',
      latitude: 20.5887932,
      longitude: -100.3898881,
      radius: 2000,
      extraFee: 0,
      color: '#71f076',
    },
  ];
  step1: FormGroup;
  private store: Store;
  showLoading: boolean = true;
  delivery: Delivery;
  searchTerm: string;
  account: string = 'free';
  newChanges = false;
  isActive: boolean;
  isRevertedChanges = false;
  deliveriers: Array<Deliverier>;
  allDeliveriers: Array<Deliverier>;
  constructor(
    private deliverySrv: DeliveryService,
    private fb: FormBuilder,
    private modalsSrv: ModalsService,
    private storeSrv: StoreService,
    private taostSrv: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initStep1Form();
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.account = this.store.typeAccount;
    this.delivery = this.store.delivery;
    if (this.delivery) {
      this.zones = this.delivery.zones.map((zone) => {
        return { ...zone };
      });
      this.latitude = this.zones[0].latitude;
      this.longitude = this.zones[0].longitude;
      this.isActive = this.store.delivery.isActive;
      this.updateForm();
      if (this.store.typeAccount !== 'free') {
        this.deliveriers = await this.deliverySrv.getDeliveriers();
        this.allDeliveriers = [...this.deliveriers];
      }
    }
  }

  updateForm(): void {
    this.step1.setValue({
      deliveryCost: this.delivery.deliveryCost,
      minPurchaseAmount: this.delivery.minPurchaseAmount
        ? this.delivery.minPurchaseAmount
        : null,
      freeShippingAmount: this.delivery.freeShippingAmount
        ? this.delivery.freeShippingAmount
        : null,
    });
  }

  initStep1Form(): void {
    this.step1 = this.fb.group({
      deliveryCost: ['', Validators.required],
      minPurchaseAmount: [''],
      freeShippingAmount: [''],
    });
  }

  stepperChange(ev: any) {
    if (ev.selectedIndex === 1) {
    }
  }

  async editZone(zone: DeliveryZone, index: number): Promise<void> {
    const color = zone.color;
    const newZone = await this.modalsSrv.openDeliveryZoneModal(zone, index);
    if (typeof newZone === 'string') {
      this.zones.splice(index, 1);
    } else if (newZone) {
      newZone.color = color;
      this.zones[index] = newZone;
      this.latitude = newZone.latitude;
      this.longitude = newZone.longitude;
      this.newChanges = true;
    }
  }

  async addZone(): Promise<void> {
    if (this.zones.length && this.store.typeAccount === 'free') {
      await this.modalsSrv.openActivateProModal(
        'Para añadir más zonas debes ser un negocio PRO. hazlo ahora!'
      );
    } else {
      const newZone = await this.modalsSrv.openDeliveryZoneModal();
      if (newZone) {
        newZone.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        this.zones.push(newZone);
        this.latitude = newZone.latitude;
        this.longitude = newZone.longitude;
        this.newChanges = true;
      }
    }
  }

  markerDragEnd(ev: any, index: number) {
    const newLat = ev.latLng.lat();
    const newLng = ev.latLng.lng();
    console.log(newLat, newLng);
    this.zones[index].latitude = newLat;
    this.zones[index].longitude = newLng;
    this.newChanges = true;
  }

  async setDelivery(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const delivery = Builder(Delivery)
        .deliveryCost(this.step1.value.deliveryCost)
        .freeShippingAmount(this.step1.value.freeShippingAmount)
        .isActive(this.delivery ? this.delivery.isActive : true)
        .minPurchaseAmount(this.step1.value.minPurchaseAmount)
        .zones(this.zones)
        .build();
      await this.deliverySrv.updateDelivery(delivery);
      await this.modalsSrv.dismissLoadingModal();
      this.delivery = delivery;
      await this.taostSrv.showDefaultNotify(
        'Servicio a domicilio publicado',
        'success'
      );
      this.newChanges = false;
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      this.taostSrv.showErrorNotify('Ops! ocurrió un error intenta más tarde');
    }
  }

  searchByTerm(): void {
    if (this.searchTerm) {
      this.deliveriers = this.allDeliveriers.filter((item) => {
        return (
          item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 ||
          item.phone.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
            -1 ||
          item.email.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        );
      });
    } else {
      this.showLoading = true;
      this.deliveriers = [...this.allDeliveriers];
      this.showLoading = false;
    }
  }

  setNewChanges(): void {
    if (!this.isRevertedChanges) {
      this.newChanges = true;
    }
    this.isRevertedChanges = false;
  }

  async revertChanges() {
    const store = await this.storeSrv.store.pipe(first()).toPromise();
    this.delivery = store.delivery;
    this.isActive = store.delivery.isActive;
    this.zones = this.delivery.zones.map((zone) => {
      return { ...zone };
    });

    this.isRevertedChanges = true;
    this.updateForm();
    this.newChanges = false;
  }

  async openCreateOrUpdateDeliverier(
    deliverier: Deliverier = null
  ): Promise<void> {
    const update = await this.modalsSrv.openRegisterUser(
      'deliverier',
      deliverier
    );
    if (update) {
      this.deliveriers = await this.deliverySrv.getDeliveriers();
    }
  }
}
