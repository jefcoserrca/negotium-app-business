import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalsService } from '../../services/modals.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FormatColor } from '../../interfaces/format-color';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store';
import { first } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';
import { ProductVariant, ProductStock, Product } from '../../models/product';
import { Builder } from 'builder-pattern';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.page.html',
  styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit {
  showLoading = true;
  editMode = false;
  form: FormGroup;
  productImage: string = null;
  productImages: Array<string> = [];
  productVariants: Array<ProductVariant> = [];
  priceByVariant: ProductVariant = null;
  productStock: ProductStock = Builder(ProductStock)
    .availableStock(0)
    .minimumStock(0)
    .stockController(false)
    .build();
  formatColor: FormatColor = { bgColor: '#fff', txtColor: '#000' };
  account = 'free';
  alertOpts = {
    header: 'Unidad de venta',
    message: 'Selecciona como se venderá tu producto',
  };
  private file: string;
  private store: Store;
  private productId: string = null;
  constructor(
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private modalsSrv: ModalsService,
    private imageCompress: NgxImageCompressService,
    private productsSrv: ProductsService,
    private storeSrv: StoreService,
    private toastSrv: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initPage();
  }

  /**
   * It opens a modal, and if the user selects a category, it updates the form
   */
  async openCategories(): Promise<void> {
    const category = await this.modalsSrv.openCategoriesList(true);
    if (category) {
      this.form.patchValue({
        category: category === 'empty' ? null : category,
      });
    }
  }

  /**
   * It takes a file, compresses it, opens a modal to crop the image, and then returns the cropped
   * image
   */
  async uploadProductFile(): Promise<void> {
    const compressFile = await this.imageCompress.uploadFile();
    const image = await this.imageCompress.compressFile(
      compressFile.image,
      compressFile.orientation,
      50,
      90
    );
    const imageCropped = await this.modalsSrv.openCropperImageModal(image);
    this.productImage = imageCropped ? imageCropped.image : this.productImage;
    this.file = imageCropped ? image : this.file;
  }

  /**
   * If the user has selected an image and is not in edit mode, open the cropper modal and set the
   * product image to the cropped image
   */
  async editImage(): Promise<void> {
    if (this.productImage && !this.editMode) {
      const imageCropped = await this.modalsSrv.openCropperImageModal(
        this.file
      );
      this.productImage = imageCropped ? imageCropped.image : this.productImage;
    }
  }

  /**
   * The function opens a modal with a color picker and returns the selected color
   */
  async openPickerColor(): Promise<void> {
    const format = await this.modalsSrv.openColorPickerModal({
      bgColor: this.formatColor?.bgColor,
      txtColor: this.formatColor?.txtColor,
    });
    this.formatColor = format ? format : this.formatColor;
  }

  /**
   * It sets the productImage property to null and the file property to null
   */
  removeImage(): void {
    this.productImage = null;
    this.file = null;
  }

  /**
   * It opens a modal that allows the user to select multiple images from the device's gallery
   *
   * @returns The images that were selected by the user.
   */
  async openMultipleImages(): Promise<void> {
    if (this.store.typeAccount !== 'free') {
      const images = await this.modalsSrv.openMultipleImagesModal([
        ...this.productImages,
      ]);
      this.productImages = images ? images : this.productImages;
    } else {
      this.toastSrv.showDefaultNotify(
        'Actualiza tu empresa a PRO para usar esta herramienta'
      );
      return;
    }
  }

  /**
   * If the user is on a free account, then the measurementUnits field is set to 'unidad'
   *
   * @returns the value of the form.patchValue() method.
   */
  verifyMeasurementUnits(): void {
    if (this.store.typeAccount === 'free') {
      return this.form.patchValue({ measurementUnits: 'unidad' });
    } else {
      return;
    }
  }

  /**
   * It opens a modal to create product variations, and then sets the priceByVariant variable to the
   * result of the modal
   */
  async setPriceByVariants(): Promise<void> {
    const variant = await this.modalsSrv.openCreateProductVariations(
      this.priceByVariant,
      true
    );
    this.priceByVariant = variant ?? this.priceByVariant;
    this.setPriceToZero();
  }

  /**
   * It opens a modal that allows the user to edit the product's variants
   */
  async openExtrasProductVariations(): Promise<void> {
    const newVariants = await this.modalsSrv.openProductVariations([
      ...this.productVariants,
    ]);
    this.productVariants = newVariants ? newVariants : this.productVariants;
  }

  /**
   * It opens a modal that allows the user to edit the product stock
   *
   * @returns The modal is being returned.
   */
  async openProductStock(): Promise<void> {
    if (this.store.typeAccount !== 'free') {
      const newStock = await this.modalsSrv.openStockModal({
        ...this.productStock,
      });
      this.productStock = newStock ? newStock : this.productStock;
    } else {
      this.toastSrv.showDefaultNotify(
        'Actualiza tu empresa a PRO para usar esta herramienta'
      );
      return;
    }
  }

  /**
   * It saves the product, if the form is valid or if the price is dynamic and the price by variant is
   * true
   *
   * @returns The product id
   */
  async saveProduct(): Promise<void> {
    this.form.value.price = this.form.value.dynamicPrice
      ? 0
      : this.form.value.price;
    if (this.form.value.dynamicPrice && !this.priceByVariant) {
      await this.toastSrv.showErrorNotify('Verifica todos los campos');
      return;
    }
    if (this.form.valid) {
      try {
        await this.modalsSrv.openLoadingModal('Guardando producto');
        const product: Product = this.createClassProduct();
        if (this.editMode) {
          await this.productsSrv.updateProduct(product, this.productId);
        } else {
          await this.productsSrv.createNewProduct(product, this.productId);
        }
        await this.router.navigate(['/dashboard/products']);
        await this.modalsSrv.dismissLoadingModal();
        await this.toastSrv.showDefaultNotify('Producto guardado!', 'success');
      } catch (error) {
        this.productId = error;
        await this.modalsSrv.dismissLoadingModal();
        await this.toastSrv.showErrorNotify(
          'Ops! ocurrio un error. Intentalo de nuevo'
        );
      }
    } else {
      await this.toastSrv.showErrorNotify('Verifica todos los campos');
    }
  }

  /**
   * It creates an alert, and if the user confirms the deletion, it deletes the product
   */
  async deleteProductAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message:
        'Esta acción es irreversible. ¿Estás seguro de borrar este producto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Si, borrar',
          handler: async () => {
            await this.deleteProduct();
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * When the user clicks the button, set the price to zero.
   */
  setPriceToZero(): void {
    this.form.patchValue({ price: 0 });
  }

  /**
   * It creates a new instance of the Product class, and sets the values of the properties of the class
   * using the values of the form
   *
   * @returns A new Product object with the values from the form.
   */
  private createClassProduct(): Product {
    const formData = this.form.value;
    const pictures = [this.productImage, ...this.productImages];
    const picturesFiltered = pictures.filter((image) => image !== null);
    const product = Builder(Product)
      .category(formData.category)
      .description(formData.description)
      .measurementUnits(formData.measurementUnits)
      .name(formData.name)
      .pictures(picturesFiltered)
      .dynamicPrice(formData.dynamicPrice)
      .productVaraint(this.priceByVariant ?? null)
      .price(formData.dynamicPrice ? 0 : formData.price)
      .showOn(formData.showOn)
      .stock(this.productStock)
      .styles(this.formatColor)
      .suggest(formData.suggest)
      .variations(this.productVariants)
      .build();
    return product;
  }

  /**
   * It initializes the page.
   */
  private async initPage(): Promise<void> {
    this.showLoading = true;
    this.initForm();
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.account = this.store.typeAccount;
    this.getProductId();
    this.showLoading = false;
  }

  /**
   * It creates a form group with the fields name, category, showOn, suggest, dynamicPrice, price,
   * description and measurementUnits
   */
  private initForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      category: [''],
      showOn: [true],
      suggest: [false],
      dynamicPrice: [false],
      price: ['', Validators.required],
      description: [
        '',
        [
          Validators.maxLength(80),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      measurementUnits: ['unidad'],
    });
  }

  /**
   * This function checks the url to see if the user is editing a product. If so, it sets the editMode
   * to true, gets the productId from the url, and then calls the getProduct() function
   *
   * @returns The productId is being returned.
   */
  private async getProductId(): Promise<void> {
    const url = this.router.url.split('/')[2];
    if (url === 'edit-product') {
      this.editMode = true;
      this.productId = this.getProductIdFromParams();
      await this.getProduct();
    } else {
      return;
    }
  }

  /**
   * It gets the product id from the route parameters
   *
   * @returns The product id from the url
   */
  private getProductIdFromParams(): string {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  /**
   * It gets the product from the server and updates the form values with the product data
   */
  private async getProduct(): Promise<void> {
    try {
      const product: Product = await this.productsSrv.getProductById(
        this.productId
      );
      this.productImage = product.pictures[0] ? product.pictures[0] : null;
      this.formatColor = product.styles;
      this.productImages = [
        ...product.pictures.filter((image, index) => index !== 0),
      ];
      this.priceByVariant = product.productVaraint;
      this.productVariants = [...product.variations];
      this.productStock = product.stock;
      this.updateFormValues(product);
    } catch (error) {
      await this.toastSrv.showErrorNotify('No se pudo obtener el producto');
      await this.router.navigate(['/dashboard/products']);
    }
  }

  /**
   * It takes a product object and sets the form values to the values of the product object
   *
   * @param {Product} product - Product - this is the product object that we are going to update.
   */
  private updateFormValues(product: Product): void {
    this.form.setValue({
      name: product.name,
      dynamicPrice: product.dynamicPrice,
      price: product.price,
      description: product.description,
      category: product.category,
      showOn: product.showOn,
      suggest: product.suggest,
      measurementUnits: product.measurementUnits,
    });
  }

  /**
   * It opens a loading modal, gets the product from the database, deletes the product from the
   * database, navigates to the products page and dismisses the loading modal
   */
  private async deleteProduct(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal('Borrando producto...');
      const product = await this.productsSrv.getProductById(this.productId);
      await this.productsSrv.deleteProduct(this.productId, product.pictures);
      await this.router.navigate(['/dashboard/products']);
      await this.modalsSrv.dismissLoadingModal();
    } catch (error) {
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify('Ha ocurrido un error');
    }
  }
}
