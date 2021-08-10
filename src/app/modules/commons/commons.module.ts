import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CreateAccountModalComponent } from '../../modals/create-account-modal/create-account-modal.component';
import { CropperImageModalComponentComponent } from 'src/app/modals/cropper-image-modal-component/cropper-image-modal-component.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { CreateCategoryComponent } from '../../components/create-category/create-category.component';
import { LoadingComponentModal } from '../../modals/loading/loading.component';
import { ColorPickerComponent } from 'src/app/modals/color-picker/color-picker.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorCircleModule } from 'ngx-color/circle';
import { MatMenuModule } from '@angular/material/menu';
import { MultipleImagesUploaderModalComponent } from '../../modals/multiple-images-uploader-modal/multiple-images-uploader-modal.component';
import { CreateProductVariationsComponent } from 'src/app/modals/create-product-variations/create-product-variations.component';
import { ProductVariationsComponent } from '../../modals/product-variations/product-variations.component';
import { StockModalComponent } from '../../modals/stock-modal/stock-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { InputAlertComponent } from '../../modals/input-alert/input-alert.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ThemePickerModalComponent } from '../../modals/theme-picker-modal/theme-picker-modal.component';
@NgModule({
  declarations: [
    CreateAccountModalComponent,
    CropperImageModalComponentComponent,
    LoadingComponent,
    CategoryListComponent,
    CreateCategoryComponent,
    LoadingComponent,
    LoadingComponentModal,
    ColorPickerComponent,
    MultipleImagesUploaderModalComponent,
    CreateProductVariationsComponent,
    ProductVariationsComponent,
    StockModalComponent,
    InputAlertComponent,
    ProductCardComponent,
    ThemePickerModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ImageCropperModule,
    MatExpansionModule,
    ColorSketchModule,
    ColorCircleModule,
    MatMenuModule,
    MatTabsModule,
  ],
  exports: [
    CreateAccountModalComponent,
    CropperImageModalComponentComponent,
    LoadingComponent,
    CategoryListComponent,
    CreateCategoryComponent,
    LoadingComponent,
    LoadingComponentModal,
    ColorPickerComponent,
    MultipleImagesUploaderModalComponent,
    CreateProductVariationsComponent,
    ProductVariationsComponent,
    StockModalComponent,
    InputAlertComponent,
    ProductCardComponent,
    ThemePickerModalComponent,
    MatExpansionModule,
    MatMenuModule,
    MatTabsModule,
  ],
})
export class CommonsModule {}
