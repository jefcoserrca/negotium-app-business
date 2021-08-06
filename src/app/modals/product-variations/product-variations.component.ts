import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalsService } from '../../services/modals.service';
import { ProductVariant } from '../../models/product';
import { Builder } from 'builder-pattern';
import { VariantOption } from '../../interfaces/option';

@Component({
  selector: 'app-product-variations',
  templateUrl: './product-variations.component.html',
  styleUrls: ['./product-variations.component.scss'],
})
export class ProductVariationsComponent implements OnInit {
  searchTerm: string;
  @Input() variants: Array<ProductVariant> = [];
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private modalSrv: ModalsService
  ) {}

  ngOnInit() {}

  async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  searchByTerm(): void {}

  async openCreateVariant(): Promise<void> {
    const newVariant = await this.modalSrv.openCreateProductVariations();
    if (newVariant) {
      this.variants.push(newVariant);
    }
  }

  async editVariant(variant: ProductVariant, i: number) {
    const newVariant = await this.modalSrv.openCreateProductVariations({
      ...variant,
    });
    this.variants[i] = newVariant ? newVariant : variant;
  }

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
            await this.saveVariants();
          },
        },
      ],
    });
    await alert.present();
  }

  cloneVariant(variant: ProductVariant) {
    const cloneOpts = [];
    variant.options.forEach((item) => cloneOpts.push({ ...item }));
    const clone = { ...variant };
    clone.options = cloneOpts;
    clone.title = clone.title + ' copia';
    return this.variants.push(clone);
  }

  createExample(type: string) {
    let exampleVariant: ProductVariant;
    switch (type) {
      case 'colors':
        exampleVariant = Builder(ProductVariant)
          .options([
            { label: 'Azul', color: '#19abf1', price: 0 },
            { label: 'Verde', color: '#2fdc6c', price: 0 },
            { label: 'Morado', color: '#8626d0', price: 15 },
            { label: 'Negro', color: '#000000', price: 50 },
          ])
          .title('Selecciona un color')
          .required(true)
          .type('color')
          .build();
        break;
      case 'ingredients':
        exampleVariant = Builder(ProductVariant)
          .options([
            { label: 'Lechuga', color: '#19abf1', price: 0 },
            { label: 'Pepinillos', color: '#2fdc6c', price: 0 },
            { label: 'Jamón Serrano', color: '#8626d0', price: 15 },
            { label: 'Peperoni', color: '#000000', price: 15 },
          ])
          .title('Añade los ingredientes!')
          .required(true)
          .type('checkbox')
          .build();
        break;
      case 'sizes':
        exampleVariant = Builder(ProductVariant)
          .options([
            { label: 'Chica (S)', color: '#19abf1', price: 0 },
            { label: 'Mediana (M)', color: '#2fdc6c', price: 0 },
            { label: 'Grande (L)', color: '#8626d0', price: 0 },
            { label: 'Extra grande (XL)', color: '#000000', price: 100 },
          ])
          .title('Selecciona tu talla')
          .required(true)
          .type('radio')
          .build();
        break;
    }

    this.variants.push(exampleVariant);
  }

  async saveVariants(): Promise<void> {
    await this.modalCtrl.dismiss(this.variants);
  }
}
