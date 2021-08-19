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
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
  @ViewChild('search') searchElementRef: ElementRef;
  address: string;
  website: string;
  name: string;
  zipCode: string;
  latitude: any = 20.5887932;
  longitude: any = -100.3898881;
  zoom: number = 12;
  show = false;
  zones: Array<DeliveryZone> = [
    {
      address: 'Santiago de Querétaro, Qro., México',
      latitude: 20.5887932,
      longitude: -100.3898881,
      radius: 2000,
      extraFee: 0,
    },
  ];
  constructor(private modalsSrv: ModalsService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {}

  stepperChange(ev: any) {
    if (ev.selectedIndex === 1) {
    }
  }

  editZone(zone: DeliveryZone, index: number) {}

  async addZone(): Promise<void> {
    const newZone = await this.modalsSrv.openDeliveryZoneModal();
    console.log(newZone);
  }
}
