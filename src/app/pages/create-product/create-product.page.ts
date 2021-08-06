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
  productStock: ProductStock = Builder(ProductStock)
    .availableStock(0)
    .minimumStock(0)
    .stockController(false)
    .build();
  formatColor: FormatColor = { bgColor: '#fff', txtColor: '#000' };
  private file: string;
  private store: Store;
  private productId: string = null;
  account = 'free';
  alertOpts = {
    header: 'Unidad de venta',
    message: 'Selecciona como se venderá tu producto',
  };
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
    this.showLoading = true;
    this.initForm();
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.account = this.store.typeAccount;
    this.getProductId();
    this.showLoading = false;
  }

  async getProductId(): Promise<void> {
    const url = this.router.url.split('/')[2];
    console.log(url);
    if (url === 'edit-product') {
      this.editMode = true;
      this.productId = this.getProductIdFromParams();
      await this.getProduct();
    } else {
      return;
    }
  }

  async getProduct(): Promise<void> {
    try {
      const product: Product = await this.productsSrv.getProductById(
        this.productId
      );
      this.productImage = product.pictures[0] ? product.pictures[0] : null;
      this.formatColor = product.styles;
      this.productImages = [
        ...product.pictures.filter((image, index) => index !== 0),
      ];
      this.productVariants = [...product.variations];
      this.productStock = product.stock;
      this.form.setValue({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        showOn: product.showOn,
        suggest: product.suggest,
        measurementUnits: product.measurementUnits,
      });
    } catch (error) {
      await this.toastSrv.showErrorNotify('No se pudo obtener el producto');
      await this.router.navigate(['/dashboard/products']);
    }
  }

  getProductIdFromParams(): string {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  initForm(): void {
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

  async openCategories(): Promise<void> {
    const category = await this.modalsSrv.openCategoriesList(true);
    if (category) {
      this.form.patchValue({
        category: category === 'empty' ? null : category,
      });
    }
  }

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

  async editImage(): Promise<void> {
    if (this.productImage && !this.editMode) {
      const imageCropped = await this.modalsSrv.openCropperImageModal(
        this.file
      );
      this.productImage = imageCropped ? imageCropped.image : this.productImage;
    }
  }

  async openPickerColor(): Promise<void> {
    const format = await this.modalsSrv.openColorPickerModal({
      bgColor: this.formatColor?.bgColor,
      txtColor: this.formatColor?.txtColor,
    });
    this.formatColor = format ? format : this.formatColor;
  }

  removeImage(): void {
    this.productImage = null;
    this.file = null;
  }

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

  verifyMeasurementUnits(): void {
    if (this.store.typeAccount === 'free') {
      return this.form.patchValue({ measurementUnits: 'unidad' });
    } else {
      return;
    }
  }

  async openProductVariations(): Promise<void> {
    if (this.store.typeAccount !== 'free') {
      const newVariants = await this.modalsSrv.openProductVariations([
        ...this.productVariants,
      ]);
      this.productVariants = newVariants ? newVariants : this.productVariants;
    } else {
      this.toastSrv.showDefaultNotify(
        'Actualiza tu empresa a PRO para usar esta herramienta'
      );
      return;
    }
  }

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

  async saveProduct(): Promise<void> {
    if (this.form.valid) {
      try {
        const pictures = [this.productImage, ...this.productImages];
        const picturesFiltered = pictures.filter((image) => image !== null);
        await this.modalsSrv.openLoadingModal('Guardando producto');
        const formData = this.form.value;
        const product = Builder(Product)
          .category(formData.category)
          .description(formData.description)
          .measurementUnits(formData.measurementUnits)
          .name(formData.name)
          .pictures(picturesFiltered)
          .price(formData.price)
          .showOn(formData.showOn)
          .stock(this.productStock)
          .styles(this.formatColor)
          .suggest(formData.suggest)
          .variations(this.productVariants)
          .build();
        console.log(product);
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

  async deleteProduct(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message:
        'Esta acción es irreversible. ¿Estás seguro de borrar este producto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Si, borrar',
          handler: async () => {
            await this.modalsSrv.openLoadingModal('Borrando producto...');
            const product = await this.productsSrv.getProductById(
              this.productId
            );
            await this.productsSrv.deleteProduct(
              this.productId,
              product.pictures
            );
            await this.router.navigate(['/dashboard/products']);
            await this.modalsSrv.dismissLoadingModal();
          },
        },
      ],
    });
    await alert.present();
  }
}
