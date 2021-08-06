import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store';
import { first } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { FormatColor } from '../../interfaces/format-color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
  @Input() background: string;
  @Input() colorText: string = '#000000';
  private store: Store;
  account: string = 'free';
  private defaultColors = [
    '#e4e4e4',
    '#85b6ff',
    '#9898ff',
    '#45db96',
    '#fff8a2',
    '#fa8f8f',
    '#ffb66b',
    '#fd94c0',
  ];
  constructor(
    private storeSrv: StoreService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit(): Promise<void> {
    this.background = this.background ? this.background : '#ffffff';
    this.colorText = this.colorText ? this.colorText : '#000000';
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.account = this.store.typeAccount;
  }

  setColorBackground(ev: any) {
    if (this.store.typeAccount === 'free') {
      const colorSelected = this.defaultColors.find(
        (color) => color === ev.color.hex
      );
      this.background = colorSelected ? colorSelected : '#ffffff';
    } else {
      this.background = ev.color.hex;
    }
  }

  setColorText(ev: any) {
    this.colorText =
      this.store.typeAccount === 'free' ? '#000000' : ev.color.hex;
  }

  setWhite() {
    this.background = '#ffffff';
    this.colorText = '#000000';
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  async saveColor(): Promise<void> {
    const formatColor: FormatColor = {
      bgColor: this.background,
      txtColor: this.colorText,
    };

    await this.modalCtrl.dismiss(formatColor);
  }
}
