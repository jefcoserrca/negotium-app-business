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
import { MatStepperModule } from '@angular/material/stepper';
import { AgmCoreModule } from '@agm/core';
import { DeliveryZonesModalComponent } from '../../modals/delivery-zones-modal/delivery-zones-modal.component';
import { RegisterUserComponent } from '../../modals/register-user/register-user.component';
import { ClientPreviewModalComponent } from '../../modals/client-preview-modal/client-preview-modal.component';
import { CreateShippingComponent } from '../../modals/create-shipping/create-shipping.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateSaleModalComponent } from '../../modals/create-sale-modal/create-sale-modal.component';
import { ChooseVariationsComponent } from '../../modals/choose-variations/choose-variations.component';
import { MatSelectModule } from '@angular/material/select';
import { ClientsPickerModalComponent } from '../../modals/clients-picker-modal/clients-picker-modal.component';
import { SalePreviewModalComponent } from '../../modals/sale-preview-modal/sale-preview-modal.component';
import { HeaderBarComponent } from 'src/app/components/header-bar/header-bar.component';
import { FooterbarComponent } from '../../components/footerbar/footerbar.component';
import { PaymentSubscriptionComponent } from '../../modals/payment-subscription/payment-subscription.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    ActivateProComponent,
    CategoryListComponent,
    ChooseVariationsComponent,
    ClientPreviewModalComponent,
    ClientsPickerModalComponent,
    ColorPickerComponent,
    CreateAccountModalComponent,
    CreateCategoryComponent,
    CreateProductVariationsComponent,
    CreateSaleModalComponent,
    CreateShippingComponent,
    CropperImageModalComponentComponent,
    DeliveryZonesModalComponent,
    EditCategoryModalComponent,
    FooterbarComponent,
    HeaderBarComponent,
    InputAlertComponent,
    LoadingComponent,
    LoadingComponent,
    LoadingComponentModal,
    MessageEmbeddedComponent,
    MultipleImagesUploaderModalComponent,
    PaymentSubscriptionComponent,
    ProductCardComponent,
    ProductVariationsComponent,
    RegisterUserComponent,
    ResetPasswordComponent,
    SalePreviewModalComponent,
    StockModalComponent,
    ThemePickerModalComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCjUgRLk7Nh2dvRo7NEEx_idocUIyyKztU',
      libraries: ['places'],
    }),
    ColorCircleModule,
    ColorSketchModule,
    CommonModule,
    FormsModule,
    ImageCropperModule,
    IonicModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
    MatTabsModule,
    NgxQRCodeModule,
    NgxStripeModule.forRoot(environment.stripe), 
    ReactiveFormsModule,
    RouterModule,
    ZXingScannerModule,
  ],
  exports: [
    ActivateProComponent,
    AgmCoreModule,
    CategoryListComponent,
    ChooseVariationsComponent,
    ClientPreviewModalComponent,
    ClientsPickerModalComponent,
    ColorPickerComponent,
    CreateAccountModalComponent,
    CreateCategoryComponent,
    CreateProductVariationsComponent,
    CreateSaleModalComponent,
    CreateShippingComponent,
    CropperImageModalComponentComponent,
    DeliveryZonesModalComponent,
    EditCategoryModalComponent,
    FooterbarComponent,
    HeaderBarComponent,
    InputAlertComponent,
    LoadingComponent,
    LoadingComponent,
    LoadingComponentModal,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
    MatTabsModule,
    MessageEmbeddedComponent,
    MultipleImagesUploaderModalComponent,
    NgxQRCodeModule,
    PaymentSubscriptionComponent,
    ProductCardComponent,
    ProductVariationsComponent,
    ReactiveFormsModule,
    RegisterUserComponent,
    ResetPasswordComponent,
    SalePreviewModalComponent,
    StockModalComponent,
    ThemePickerModalComponent,
    ZXingScannerModule,
  ],
})
export class CommonsModule {}
