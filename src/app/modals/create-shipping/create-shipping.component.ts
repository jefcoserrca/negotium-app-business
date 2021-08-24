import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ShippingData } from '../../interfaces/store-shipping';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Builder } from 'builder-pattern';

@Component({
  selector: 'app-create-shipping',
  templateUrl: './create-shipping.component.html',
  styleUrls: ['./create-shipping.component.scss'],
})
export class CreateShippingComponent implements OnInit {
  @Input() shipping: ShippingData;
  form: FormGroup;
  constructor(
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.shipping) {
      this.updateForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      cost: ['', [Validators.required]],
      freeShippingAmount: [''],
      minPurchaseAmount: [''],
      applyEachProduct: [true, Validators.required],
      availableDays: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
    });
  }

  updateForm(): void {
    this.form.setValue({
      name: this.shipping.name,
      cost: this.shipping.cost,
      freeShippingAmount: this.shipping.freeShippingAmount,
      minPurchaseAmount: this.shipping.minPurchaseAmount,
      applyEachProduct: this.shipping.applyEachProduct,
      availableDays: this.shipping.availableDays,
    });
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  async openAlertDelete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message: 'Esta acción es irrevocable. ¿Estás seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: async () => await this.deleteShipping() },
      ],
    });
    await alert.present();
  }

  async deleteShipping(): Promise<void> {
    await this.modalCtrl.dismiss('deleted');
  }

  async saveShipping(): Promise<void> {
    if (this.form.valid) {
      const data = this.form.value;
      const newShipping: ShippingData = {
        name: data.name,
        cost: data.cost,
        freeShippingAmount: data.freeShippingAmount,
        minPurchaseAmount: data.minPurchaseAmount,
        applyEachProduct: data.applyEachProduct,
        availableDays: data.availableDays,
      };
      await this.modalCtrl.dismiss(newShipping);
    } else {
    }
  }
}
