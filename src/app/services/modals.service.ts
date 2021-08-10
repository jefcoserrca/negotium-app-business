import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { CreateAccountModalComponent } from '../modals/create-account-modal/create-account-modal.component';
import { CropperImageModalComponentComponent } from '../modals/cropper-image-modal-component/cropper-image-modal-component.component';
import { LoadingComponentModal } from '../modals/loading/loading.component';
import { CreateCategoryComponent } from '../components/create-category/create-category.component';
import { ColorPickerComponent } from '../modals/color-picker/color-picker.component';
import { FormatColor } from '../interfaces/format-color';
import { MultipleImagesUploaderModalComponent } from '../modals/multiple-images-uploader-modal/multiple-images-uploader-modal.component';
import { CreateProductVariationsComponent } from '../modals/create-product-variations/create-product-variations.component';
import { ProductVariationsComponent } from '../modals/product-variations/product-variations.component';
import { ProductVariant, ProductStock } from '../models/product';
import { StockModalComponent } from '../modals/stock-modal/stock-modal.component';
import { InputAlertComponent } from '../modals/input-alert/input-alert.component';
import { ThemePickerModalComponent } from '../modals/theme-picker-modal/theme-picker-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  constructor(private modalCtrl: ModalController) {}

  async openCreateAccount(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreateAccountModalComponent,
      backdropDismiss: true,
    });

    return await modal.present();
  }

  async openCreateCategory(
    items: Array<string> = null,
    index = null
  ): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: CreateCategoryComponent,
      backdropDismiss: true,
      componentProps: {
        items,
        index,
      },
      cssClass: 'tab-modal'
    });

    await modal.present();
    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  async openAlertInputModal(alertInputModal: {
    header: string;
    value: string;
    maxLength: number;
    label: string;
    placeholder: string;
  }): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: InputAlertComponent,
      backdropDismiss: true,
      componentProps: {
        alertInputModal,
      },
      cssClass: 'tab-modal'
    });

    await modal.present();
    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  async openCategoriesList(isModal: boolean = false): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: CategoryListComponent,
      backdropDismiss: true,
      componentProps: {
        isModal,
      },
      cssClass: 'tab-modal'
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }
  async openCreateProductVariations(
    productVaraint: ProductVariant = null
  ): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: CreateProductVariationsComponent,
      backdropDismiss: true,
      componentProps: {
        productVaraint,
      },
      cssClass: 'tab-modal'
    });
    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  async openProductVariations(variants: Array<ProductVariant>): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: ProductVariationsComponent,
      backdropDismiss: true,
      componentProps: {
        variants,
      },
      cssClass: 'tab-modal'
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }
  public async openCropperImageModal(
    image: string,
    aspectRatio = 'profile'
  ): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: CropperImageModalComponentComponent,
      backdropDismiss: true,
      componentProps: {
        image,
        aspectRatio,
      },
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  public async openMultipleImagesModal(images: Array<string>): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: MultipleImagesUploaderModalComponent,
      backdropDismiss: true,
      componentProps: {
        images,
      },
      cssClass: 'tab-modal'
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  public async openColorPickerModal(formatColor: FormatColor, title: string = null): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: ColorPickerComponent,
      backdropDismiss: true,
      componentProps: {
        background: formatColor?.bgColor,
        colorText: formatColor?.txtColor,
        title
      },
      cssClass: 'tab-modal'
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  public async openThemePickerModal(): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: ThemePickerModalComponent,
      backdropDismiss: true,
      cssClass: 'tab-modal'
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  public async openStockModal(stock: ProductStock = null): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: StockModalComponent,
      backdropDismiss: true,
      componentProps: {
        stock,
      },
      cssClass: 'tab-modal'
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  async openLoadingModal(message?: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: LoadingComponentModal,
      backdropDismiss: false,
      cssClass: 'big',
      componentProps: {
        message,
      },
      id: 'loading-modal',
    });

    return await modal.present();
  }

  async dismissLoadingModal(): Promise<boolean> {
    return await this.modalCtrl.dismiss(null, 'cancel', 'loading-modal');
  }
}
