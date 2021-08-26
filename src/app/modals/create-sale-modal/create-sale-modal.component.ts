import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { Sale } from '../../models/sale';
import { ModalsService } from '../../services/modals.service';
import { ToastService } from '../../services/toast.service';
import { PaymentsService } from '../../services/payments.service';
import { ClientsService } from '../../services/clients.service';
import { ProductsService } from '../../services/products.service';
import { Client } from 'src/app/models/client';
import { Product, ProductVariant } from 'src/app/models/product';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Builder } from 'builder-pattern';
import * as moment from 'moment';
@Component({
  selector: 'app-create-sale-modal',
  templateUrl: './create-sale-modal.component.html',
  styleUrls: ['./create-sale-modal.component.scss'],
})
export class CreateSaleModalComponent implements OnInit {
  @Input() sale: Sale;
  @ViewChild('productInput') productInput: ElementRef<HTMLInputElement>;
  form: FormGroup;
  showLoading = true;
  products: Array<Product>;
  productCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredProducts: Observable<Product[]>;
  selectedProducts = [];
  client: Client;
  constructor(
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private modalsSrv: ModalsService,
    private paymentsSrv: PaymentsService,
    private productsSrv: ProductsService,
    private toastSrv: ToastService
  ) {
    this.filteredProducts = this.productCtrl.valueChanges.pipe(
      startWith(null),
      map((product: any) => {
        if (product instanceof Product) {
          return;
        } else {
          return product ? this._filter(product) : this.products.slice();
        }
      })
    );
  }

  async ngOnInit() {
    this.initForm();
    this.showLoading = true;
    this.products = await this.productsSrv.getProducts();
    console.log(this.products);
    this.showLoading = false;
  }

  private initForm(): void {
    this.form = this.fb.group({
      date: [new Date().toISOString(), [Validators.required]],
      amount: ['', [Validators.required]],
      type: ['cash', [Validators.required]],
    });
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  remove(product: Product): void {
    const index = this.selectedProducts.indexOf(product);

    if (index >= 0) {
      this.selectedProducts.splice(index, 1);
      this.getTotal();
    }
  }

  async selected(event: MatAutocompleteSelectedEvent): Promise<void> {
    console.log(event.option.value);
    let quantity = 1;
    if (event.option.value.measurementUnits !== 'unidad') {
      const alert = await this.addQuantity(event.option.value.measurementUnits);
      quantity = alert?.values.quantity ? +alert.values.quantity : 1;
      console.log(quantity);
    }
    if (event.option.value.variations?.length) {
      const newVariants = await this.openChooseVariations(
        event.option.value.variations
      );
      if (newVariants) {
        const newProduct: Product = Builder(Product)
          .category(event.option.value.category)
          .units(quantity)
          .description(event.option.value.description)
          .id(event.option.value.id)
          .measurementUnits(event.option.value.measurementUnits)
          .name(event.option.value.name)
          .pictures(event.option.value.pictures)
          .price(+event.option.value.price * quantity)
          .showOn(event.option.value.showOn)
          .stock(event.option.value.stock)
          .styles(event.option.value.styles)
          .suggest(event.option.value.suggest)
          .storeId(event.option.value.storeId)
          .userId(event.option.value.userId)
          .variations(
            newVariants.map((variant) => {
              return { ...variant };
            })
          )
          .build();
        this.selectedProducts.push(newProduct);
      } else {
        await this.toastSrv.showErrorNotify(
          'Debes añadir las opciones requeridas'
        );
      }
    } else {
      const newProduct: Product = Builder(Product)
        .category(event.option.value.category)
        .units(quantity)
        .description(event.option.value.description)
        .id(event.option.value.id)
        .measurementUnits(event.option.value.measurementUnits)
        .name(event.option.value.name)
        .pictures(event.option.value.pictures)
        .price(+event.option.value.price * quantity)
        .showOn(event.option.value.showOn)
        .stock(event.option.value.stock)
        .styles(event.option.value.styles)
        .suggest(event.option.value.suggest)
        .storeId(event.option.value.storeId)
        .userId(event.option.value.userId)
        .variations(event.option.value.variations)
        .build();
      this.selectedProducts.push(newProduct);
    }
    console.log(this.selectedProducts);
    this.getTotal();
    this.productInput.nativeElement.value = null;
    this.productCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    return;
  }
  private _filter(value: any): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(
      (product) => product.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private async openChooseVariations(
    variants: Array<ProductVariant>
  ): Promise<any> {
    return await this.modalsSrv.openChooseProductVariations(variants);
  }

  async openClientPicker(): Promise<void> {
    const client = await this.modalsSrv.openClientsPicker();
    if (client !== undefined) {
      this.client = client;
    }
  }

  getTotal(): void {
    let total = 0;
    this.selectedProducts.map((product: Product) => {
      total = total + product.price;
      if (product.variations?.length) {
        product.variations.map((variant) => {
          if (variant.type === 'checkbox') {
            variant.optionSelected.map((option) => {
              if (option.checked) {
                total = total + option.price;
              }
            });
          } else {
            total = total + +variant.optionSelected.price;
          }
        });
      }
    });
    this.form.patchValue({ amount: total });
  }

  async saveSale(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const data = this.form.value;
      const sale = Builder(Sale)
        .amount(data.amount)
        .client(this.client ? this.client.id : null)
        .date(moment(data.date).toISOString())
        .products(this.selectedProducts)
        .type(data.type)
        .build();
      await this.paymentsSrv.createSale(sale);
      await this.modalsSrv.dismissLoadingModal();
      await this.modalCtrl.dismiss(true);
      await this.toastSrv.showDefaultNotify('Nueva venta añadida!', 'success');
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal, intenta más tarde'
      );
    }
  }

  async addQuantity(units: string): Promise<any> {
    const alert = await this.alertCtrl.create({
      header: 'Cantidad',
      message: 'Selecciona la cantidad en ' + units + ' vendida',
      inputs: [{ name: 'quantity', type: 'number' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aceptar',
          handler: (data) => {
            console.log(data);
          },
        },
      ],
    });
    alert.present();
    return await (
      await alert.onWillDismiss()
    ).data;
  }
}
