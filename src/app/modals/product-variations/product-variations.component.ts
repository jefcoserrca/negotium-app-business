import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalsService } from '../../services/modals.service';
import { ProductVariant } from '../../models/product';
import { Builder } from 'builder-pattern';
import { VariantOption } from '../../interfaces/option';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-product-variations',
  templateUrl: './product-variations.component.html',
  styleUrls: ['./product-variations.component.scss'],
})
export class ProductVariationsComponent implements OnInit {
  @Input() variants: Array<ProductVariant> = [];
  productVariantsHistory: Array<ProductVariant> = [];
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private modalSrv: ModalsService,
    private storageSrv: StorageService
  ) {}

  async ngOnInit() {
    this.productVariantsHistory = await this.storageSrv.getVariants(false);
  }

  /**
   * The function is async, it returns a promise of type void, and it calls the dismiss() function on
   * the modalCtrl object
   */
  async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  /**
   * It opens a modal, and if the modal returns a value, it pushes that value to an array
   */
  async openCreateVariant(): Promise<void> {
    const newVariant = await this.modalSrv.openCreateProductVariations(
      null,
      false,
      'no-blur'
    );
    if (newVariant) {
      this.variants.push(newVariant);
      this.productVariantsHistory = await this.storageSrv.getVariants(false);
    }
  }

  /**
   * It opens a modal, and if the modal returns a new variant, it replaces the old variant with the new
   * one
   *
   * @param {ProductVariant} variant - ProductVariant - The variant object that is being edited
   * @param {number} i - number - the index of the variant in the array
   */
  async editVariant(variant: ProductVariant, i: number) {
    const newVariant = await this.modalSrv.openCreateProductVariations(
      {
        ...variant,
      },
      false,
      'no-blur'
    );
    this.variants[i] = newVariant ? newVariant : variant;
    this.productVariantsHistory = await this.storageSrv.getVariants(false);
  }

  /**
   * It creates an alert, and if the user clicks the "Yes, delete" button, it deletes the variant from
   * the array
   *
   * @param {number} i - number
   */
  async deleteVariant(i: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message: 'Esta acción es irreversible. ¿Estás seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, borrar',
          handler: async () => {
            this.variants.splice(i, 1);
            //await this.saveVariants();
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * We're creating a new array, pushing a clone of each option into it, then pushing a clone of the
   * variant into the variants array
   *
   * @param {ProductVariant} variant - ProductVariant - The variant to be cloned
   * @returns The index of the new element in the array.
   */
  cloneVariant(variant: ProductVariant) {
    const cloneOpts = [];
    variant.options.forEach((item) => cloneOpts.push({ ...item }));
    const clone = { ...variant };
    clone.options = cloneOpts;
    clone.title = clone.title + ' copia';
    return this.variants.push(clone);
  }

  /**
   * It takes a string as an argument and returns a ProductVariant object
   *
   * @param {string} type - The type of variant. This can be either `checkbox` or `radio`.
   */
  pickDefaultVariant(type: string) {
    let exampleVariant: ProductVariant;
    switch (type) {
      case 'ingredients':
        exampleVariant = Builder(ProductVariant)
          .options([
            { label: 'Lechuga', color: '#19abf1', price: 0 },
            { label: 'Pepinillos', color: '#2fdc6c', price: 0 },
            { label: 'Queso Cheddar', color: '#8626d0', price: 15 },
            { label: 'Queso Manchego', color: '#000000', price: 15 },
          ])
          .title('Añade los ingredientes!')
          .required(false)
          .type('checkbox')
          .build();
        break;
      case 'sauces':
        exampleVariant = Builder(ProductVariant)
          .options([
            { label: 'BBQ', color: '', price: 0 },
            { label: 'Mango Habanero', color: '', price: 0 },
            { label: 'BBQ Hot', color: '', price: 0 },
            { label: 'Honey Mustard', color: '', price: 0 },
          ])
          .title('Selecciona un tamaño')
          .required(true)
          .type('radio')
          .build();
        break;
    }

    this.variants.push(exampleVariant);
  }

  /**
   * It takes a variant as an argument and pushes it into the variants array
   *
   * @param {ProductVariant} variant - ProductVariant - The variant that was selected by the user.
   */
  pickVariantFromHistory(variant: ProductVariant) {
    this.variants.push(variant);
  }

  /**
   * The function is called when the user clicks the save button in the modal. It closes the modal and
   * passes the variants array back to the page that opened the modal
   */
  async saveVariants(): Promise<void> {
    await this.modalCtrl.dismiss(this.variants);
  }
}
