import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Store, StoreSimpleData } from '../../models/store';
import { first } from 'rxjs/operators';
import { FormatColor } from '../../interfaces/format-color';
import { ModalsService } from '../../services/modals.service';
import { DownloadsMakerService } from '../../services/downloads-maker.service';
import { AlertController } from '@ionic/angular';
import { QrCodesService } from '../../services/qr-codes.service';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-my-qr-code',
  templateUrl: './my-qr-code.page.html',
  styleUrls: ['./my-qr-code.page.scss'],
})
export class MyQrCodePage implements OnInit {
  private store: Store;
  storeData: StoreSimpleData;
  qrCodeFormat: {
    type: 'full-top' | 'logo-only' | 'full-bottom' | 'text-only' | 'code-only';
    styles: FormatColor;
    text: string;
    link: string;
  } = {
    type: 'full-top',
    styles: { bgColor: '#000000', txtColor: '#ffffff' },
    text: 'Esacanéame y ordena vía online!',
    link: 'http://192.168.16.23:8100/dashboard',
  };
  contactData: Array<any> = [];
  itemSelected: string = null;
  constructor(
    private storeSrv: StoreService,
    private modalsSrv: ModalsService,
    private downloadsMakerSrv: DownloadsMakerService,
    private alertCtrl: AlertController,
    private qrCodesSrv: QrCodesService,
    private toastSrv: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.storeData = {
      name: this.store.name,
      category: this.store.category,
      picture: this.store.picture,
      banner: this.store.banner,
      phone: this.store.phone,
    };
    const format = await this.qrCodesSrv.getQrCodes();
    console.log(format);
    this.qrCodeFormat = format?.qrCodeFormat
      ? format?.qrCodeFormat
      : this.qrCodeFormat;
    if (format?.socialQrCodes) {
      this.contactData = format.socialQrCodes;
    } else {
      this.contactData = this.store.contactData?.length
        ? this.store.contactData.map((contact) => {
            contact.link = contact.link === null ? 'Sin link' : contact.link;
            return { ...contact, label: contact.name };
          })
        : [];
    }
  }

  async formatColor(): Promise<void> {
    const newFormat = await this.modalsSrv.openColorPickerModal(
      this.qrCodeFormat.styles
    );
    this.qrCodeFormat.styles = newFormat ? newFormat : this.qrCodeFormat.styles;
  }

  async editText(): Promise<void> {
    if (this.store.typeAccount === 'free') {
      await this.modalsSrv.openActivateProModal();
    } else {
      const newMsg = await this.modalsSrv.openAlertInputModal({
        header: 'Editar mensaje',
        value: this.qrCodeFormat.text,
        maxLength: 200,
        label: 'Mensaje de tarjeta',
        placeholder: 'pj: Escanéame!...',
      });
      this.qrCodeFormat.text = newMsg ? newMsg.name : this.qrCodeFormat.text;
    }
  }

  setType(): void {
    switch (this.qrCodeFormat.type) {
      case 'full-top':
        this.qrCodeFormat.type = 'full-bottom';
        break;
      case 'full-bottom':
        this.qrCodeFormat.type = 'logo-only';
        break;
      case 'logo-only':
        this.qrCodeFormat.type = 'text-only';
        break;
      case 'text-only':
        this.qrCodeFormat.type = 'code-only';
        break;
      case 'code-only':
        this.qrCodeFormat.type = 'full-top';
        break;
    }
  }

  async downloadPng(): Promise<void> {
    try {
      const name = this.itemSelected
        ? this.itemSelected
        : this.qrCodeFormat.type;
      const elemnt = this.itemSelected
        ? document.getElementById(name)
        : document.getElementById('qr-code');
      await this.downloadsMakerSrv.domToPng(
        elemnt,
        name + '_' + new Date().valueOf().toString()
      );
    } catch (e) {
      window.alert(e);
    }
  }
  async downloadSvg(): Promise<void> {
    try {
      const name = this.itemSelected
        ? this.itemSelected
        : this.qrCodeFormat.type;
      const elemnt = this.itemSelected
        ? document.getElementById(name)
        : document.getElementById('qr-code');
      await this.downloadsMakerSrv.domToSvg(
        elemnt,
        name + '_' + new Date().valueOf().toString()
      );
    } catch (e) {
      window.alert(e);
    }
  }

  setItem(contactName: string) {
    this.itemSelected = contactName;
    console.log(this.itemSelected);
  }

  async addContactLink(item: any): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Contacto',
      message:
        item.name === 'whatsapp' || item.name === 'phone'
          ? 'Añade el número de teléfono para ' + item.name
          : 'Pega aquí el link de la cuenta de ' + item.name,
      inputs: [
        {
          type:
            item.name === 'whatsapp' || item.name === 'phone' ? 'tel' : 'text',
          name: 'link',
          value: item.link ? item.link : 'https://instagram.com',
          placeholder:
            item.name === 'whatsapp' || item.name === 'phone'
              ? '524421000102'
              : 'Link de ' + item.name,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            console.log(item, data);
            item.link = data.link ? data.link : item.link;
            item.show = data.link ? true : false;
          },
        },
      ],
    });

    await alert.present();
  }

  async editTextSocialQr(item: any): Promise<void> {
    if (this.store.typeAccount === 'free') {
      await this.modalsSrv.openActivateProModal();
    } else {
      const newMsg = await this.modalsSrv.openAlertInputModal({
        header: 'Editar mensaje',
        value: item.label,
        maxLength: 200,
        label: 'Mensaje de tarjeta',
        placeholder: 'pj: Escanéame!...',
      });
      item.label = newMsg ? newMsg.name : item.label;
    }
  }

  async saveFormat(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      await this.qrCodesSrv.updateQrCodes({
        qrCodeFormat: this.qrCodeFormat,
        socialQrCodes: this.contactData,
      });
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showDefaultNotify(
        'Los datos se han guardado',
        'success'
      );
    } catch (e) {
      console.log(e);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Ops! ha ocurrido un error intentalo más tarde'
      );
    }
  }
}
