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
import { EditCategoryModalComponent } from '../../modals/edit-category-modal/edit-category-modal.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ActivateProComponent } from '../../modals/activate-pro/activate-pro.component';
import { MessageEmbeddedComponent } from '../../components/message-embedded/message-embedded.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ResetPasswordComponent } from '../../modals/reset-password/reset-password.component';
import {MatStepperModule} from '@angular/material/stepper';
import { AgmCoreModule } from '@agm/core';
import { DeliveryZonesModalComponent } from '../../modals/delivery-zones-modal/delivery-zones-modal.component';
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
    EditCategoryModalComponent,
    ActivateProComponent,
    MessageEmbeddedComponent,
    ResetPasswordComponent,
    DeliveryZonesModalComponent,
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
    NgxQRCodeModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ZXingScannerModule,
    MatStepperModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCjUgRLk7Nh2dvRo7NEEx_idocUIyyKztU',
      libraries: ['places']
    }),
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
    EditCategoryModalComponent,
    ActivateProComponent,
    MessageEmbeddedComponent,
    MatExpansionModule,
    MatMenuModule,
    MatTabsModule,
    NgxQRCodeModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    ResetPasswordComponent,
    MatStepperModule,
    AgmCoreModule,
    DeliveryZonesModalComponent,
  ],
})
export class CommonsModule {}
