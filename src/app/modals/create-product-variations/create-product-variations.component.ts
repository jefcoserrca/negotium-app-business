import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { VariantOption } from '../../interfaces/option';
import { Builder } from 'builder-pattern';
import { ProductVariant } from 'src/app/models/product';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-create-product-variations',
  templateUrl: './create-product-variations.component.html',
  styleUrls: ['./create-product-variations.component.scss'],
})
export class CreateProductVariationsComponent implements OnInit {
  @Input() productVaraint: ProductVariant;
  @Input() dynamicPrice: boolean;
  alertOpts = {
    header: 'Tipo de pregunta',
    message: 'Selecciona un tipo de pregunta',
  };
  form: FormGroup;
  options: Array<VariantOption> = [{ label: '', price: 150, color: '#19abf1' }];
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastSrv: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.productVaraint) {
      this.updateForm();
    }
  }

  /**
   * The close() function dismisses the modal and then returns a promise
   */
  close(): void {
    this.modalCtrl.dismiss().then();
  }

  /**
   * The function takes two parameters, the first is the event object and the second is the index of
   * the option. The function then sets the color property of the option at the given index to the hex
   * value of the color selected by the user
   * [DEPRECATED]
   *
   * @param {any} ev - The event that was triggered.
   * @param {number} i - the index of the option in the array
   */
  setColor(ev: any, i: number) {
    this.options[i].color = ev.color.hex;
  }

  /**
   * It adds a new option to the options array
   */
  addOption() {
    this.options.push({
      label: '',
      price: this.dynamicPrice ? 100 : 0,
      color: '#000000',
    });
  }

  /**
   * It creates an alert with an input field, and when the user clicks the "Accept" button, it sets the
   * price of the selected option to the value entered by the user
   *
   * @param {VariantOption} option - VariantOption - The option that was selected
   */
  async setPrice(option: VariantOption): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.dynamicPrice ? 'Precio' : 'Cargo extra',
      message: this.dynamicPrice
        ? 'Añade el precio del producto en este variante'
        : 'Añade el precio a sumar por seleccionar esta opción',
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

  /**
   * It takes a VariantOption object as an argument, and sets the price property of that object to null
   *
   * @param {VariantOption} option - VariantOption - The option that is being removed.
   * @returns The price of the option is being set to null.
   */
  removePrice(option: VariantOption) {
    return (option.price = null);
  }

  /**
   * It removes the option at the index i from the options array
   *
   * @param {number} i - number - the index of the option to remove
   */
  removeOption(i: number) {
    console.log(i);
    this.options.splice(i, 1);
  }

  /**
   * It takes a VariantOption object, clones it, and adds it to the options array
   *
   * @param {VariantOption} option - VariantOption - The option to be cloned.
   */
  cloneOption(option: VariantOption) {
    const clone = { ...option };
    this.options.push(clone);
  }

  /**
   * If the form is valid, we build a new ProductVariant object and pass it to the modal controller's
   * dismiss function
   *
   * @returns A variant object
   */
  async saveVariant(): Promise<void> {
    if (
      this.verifyOptions() &&
      (this.form.value.type === 'radio' || this.form.value.type === 'checkbox')
    ) {
      this.toastSrv.showErrorNotify('Añade un texto a cada opción');
      return;
    }
    if (this.form.valid) {
      const variant: ProductVariant = this.buildVariant();
      await this.modalCtrl.dismiss(variant);
    } else {
      return;
    }
  }

  /**
   * We're creating a form group with three form controls: title, type, and required. The title form
   * control is required and must contain at least one non-whitespace character. The type form control
   * is required and must be set to either radio or checkbox. The required form control is required and
   * must be set to either true or false
   */
  private initForm(): void {
    this.form = this.fb.group({
      title: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      type: ['radio', [Validators.required]],
      required: [this.dynamicPrice, Validators.required],
    });
  }

  /**
   * It takes the options array from the productVariant object and pushes it into the options array in
   * the component
   */
  private updateForm(): void {
    this.options = [];
    this.productVaraint.options.forEach((item) =>
      this.options.push({ ...item })
    );
    this.form.setValue({
      title: this.productVaraint.title,
      type: this.productVaraint.type,
      required: this.productVaraint.required,
    });
  }

  /**
   * It returns true if there is an empty option in the options array
   *
   * @returns A boolean value.
   */
  private verifyOptions(): boolean {
    const emptyOption = this.options.find(
      (item) =>
        item.label === '' || item.label === undefined || item.label === null
    );
    return emptyOption ? true : false;
  }

  /**
   * It creates a new ProductVariant object, sets its properties, and returns it
   *
   * @returns A new ProductVariant object with the values from the form.
   */
  private buildVariant(): ProductVariant {
    return Builder(ProductVariant)
      .title(this.form.value.title)
      .type(this.form.value.type)
      .options(this.form.value.type === 'text' ? [] : this.options)
      .required(this.form.value.required)
      .build();
  }
}
