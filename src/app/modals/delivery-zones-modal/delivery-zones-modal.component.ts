import { MapsAPILoader } from '@agm/core';
import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeliveryZone } from 'src/app/interfaces/delivery-zone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-delivery-zones-modal',
  templateUrl: './delivery-zones-modal.component.html',
  styleUrls: ['./delivery-zones-modal.component.scss'],
})
export class DeliveryZonesModalComponent implements OnInit {
  address: string;
  extraFee: number = 0;
  latitude: any;
  longitude: any;
  name: string;
  radius: number = 1000;
  @ViewChild('search') searchElementRef: ElementRef;
  @Input() zone: DeliveryZone;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private mapsApiLoader: MapsAPILoader,
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    private toastSrv: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
    this.address = this.zone ? this.zone.address : null;
    this.latitude = this.zone ? this.zone.latitude : null;
    this.longitude = this.zone ? this.zone.longitude : null;
  }

  ngAfterViewInit(): void {
    this.findAdress();
  }

  initForm(): void {
    this.form = this.fb.group({
      radius: [
        this.zone ? this.zone.radius : '',
        [Validators.required, Validators.max(5000)],
      ],
      extraFee: [this.zone ? this.zone.extraFee : '', []],
    });
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  findAdress() {
    this.mapsApiLoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address = place.formatted_address;
          this.name = place.name;
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(this.address, this.latitude, this.longitude);
        });
      });
    });
  }

  async addZone(): Promise<void> {
    if (this.form.valid && this.address && this.latitude && this.longitude) {
      const newZone: DeliveryZone = {
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude,
        radius: this.form.value.radius,
        extraFee: this.form.value.extraFee ? this.form.value.extraFee : 0,
      };
      await this.modalCtrl.dismiss(newZone);
    } else {
      await this.toastSrv.showErrorNotify('Completa todos los campos');
    }
  }

  searcherChange(): void {
    if (this.address === '' || this.address == null || !this.address) {
      this.latitude = null;
      this.longitude = null;
    }
    return;
  }

  async remove(): Promise<void> {
    await this.modalCtrl.dismiss('remove');
  }
}
