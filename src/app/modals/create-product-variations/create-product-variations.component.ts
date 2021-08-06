import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { VariantOption } from '../../interfaces/option';
import { Builder } from 'builder-pattern';
import { ProductVariant } from 'src/app/models/product';

@Component({
  selector: 'app-create-product-variations',
  templateUrl: './create-product-variations.component.html',
  styleUrls: ['./create-product-variations.component.scss'],
})
export class CreateProductVariationsComponent implements OnInit {
  @Input() productVaraint: ProductVariant;
  alertOpts = {
    header: 'Tipo de pregunta',
    message: 'Selecciona un tipo de pregunta',
  };
  form: FormGroup;
  options: Array<VariantOption> = [{ label: '', price: 0, color: '#19abf1' }];
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.productVaraint) {
      this.updateForm();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      type: ['radio', [Validators.required]],
      required: [false, Validators.required],
    });
  }

  private updateForm(): void {
    this.options = [];
    this.productVaraint.options.forEach((item) => this.options.push({...item}));
    this.form.setValue({
      title: this.productVaraint.title,
      type: this.productVaraint.type,
      required: this.productVaraint.required,
    });
  }
  close(): void {
    this.modalCtrl.dismiss().then();
  }

  setColor(ev: any, i: number) {
    this.options[i].color = ev.color.hex;
  }

  addOption() {
    this.options.push({ label: '', price: 0, color: '#19abf1' });
  }

  async setPrice(option: VariantOption): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cargo extra',
      message: 'Añade el precio a sumar por seleccionar esta opción',
      inputs: [
        {
          name: 'newPrice',
          type: 'number',
          value: option.price > 0 ? option.price : '',
          placeholder: '$15.00',
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
            option.price = data.newPrice > 0 ? data.newPrice : option.price;
          },
        },
      ],
    });

    await alert.present();
  }

  removePrice(option: VariantOption) {
    return (option.price = 0);
  }

  removeOption(i: number) {
    console.log(i);
    this.options.splice(i, 1);
  }

  cloneOption(option: VariantOption) {
    const clone = { ...option };
    this.options.push(clone);
  }

  async saveVariant(): Promise<void> {
    if (this.form.valid) {
      const variant: ProductVariant = Builder(ProductVariant)
        .title(this.form.value.title)
        .type(this.form.value.type)
        .options(this.form.value.type === 'text' ? [] : this.options)
        .required(this.form.value.required)
        .build();
      await this.modalCtrl.dismiss(variant);
    } else {
      return;
    }
  }
}
