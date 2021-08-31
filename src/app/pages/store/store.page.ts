import { Component, OnInit, Renderer2 } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { Store, StoreSimpleData } from '../../models/store';
import { first } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { ModalsService } from '../../services/modals.service';
import { ToastService } from '../../services/toast.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FormatColor } from '../../interfaces/format-color';
import { Product } from '../../models/product';
import { ContactData } from 'src/app/interfaces/contact-data';
import { AuthenticationService } from '../../services/authentication.service';
import {
  StructureProducts,
  StructureRecommendations,
} from 'src/app/interfaces/format-structure';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {
  private store: Store;
  storeData: StoreSimpleData;
  account: string;
  contactData: Array<ContactData> = [];
  formatColorStoreCard: FormatColor;
  formatColorBars: FormatColor;
  formatColorPage: FormatColor;
  formatColorCategoriesBar: FormatColor;
  products: Array<Product> = [];
  productsHighlights: Array<Product> = [];
  formatStructureRecommendations: StructureRecommendations;
  formatStructureProducts: StructureProducts;
  formatStructureProductsByCategory: StructureProducts;
  categories: Array<string> = [];
  productsByCategory: Array<Product> = [];
  categorySelected: string = '';
  linearGradient: string;
  newChanges: boolean = false;
  showLoading = true;
  iconCategory: string;
  constructor(
    private authSrv: AuthenticationService,
    private storeSrv: StoreService,
    private alertCtrl: AlertController,
    private productsSrv: ProductsService,
    private modalsSrv: ModalsService,
    private toastSrv: ToastService,
    private imageCompress: NgxImageCompressService,
    private renderer: Renderer2
  ) {}

  async ngOnInit(): Promise<void> {
    this.showLoading = true;
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.account = this.store.typeAccount;
    this.initStore();
    this.products = await this.productsSrv.getProducts();
    this.getActiveCategories();
    this.productsHighlights = this.products.filter(
      (product) => product.suggest === true
    );
    this.showLoading = false;
    setTimeout(() => {
      this.customizeCategoryBar(this.formatColorCategoriesBar);
    }, 150);
  }

  async addContactLink(item: any): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Contacto',
      message:
        item.name === 'whatsapp' || item.name === 'phone'
          ? 'Añade el número de teléfono para ' + item.name
          : 'Pega aquí el link de la cuenta de ' + item.name,
      inputs: [
        {
          type:
            item.name === 'whatsapp' || item.name === 'phone' ? 'tel' : 'text',
          name: 'link',
          value: item.link ? item.link : '',
          placeholder:
            item.name === 'whatsapp' || item.name === 'phone'
              ? '524421000102'
              : 'Link de ' + item.name,
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
            item.link = data.link ? data.link : item.link;
            item.show = data.link ? true : false;
            this.newChanges = data.link ? true : this.newChanges;
          },
        },
      ],
    });

    await alert.present();
  }

  removeContactLink(item): void {
    item.link = item.name === 'whatsapp' ? item.link : null;
    item.show = false;
    this.newChanges = true;
  }

  async editStoreName(): Promise<void> {
    const newName = await this.modalsSrv.openAlertInputModal({
      header: 'Cambiar nombre',
      value: this.storeData.name,
      maxLength: 60,
      placeholder: 'Introduce nuevo nombre',
      label: 'Nombre',
    });

    this.storeData.name = newName?.name ? newName.name : this.storeData.name;

    this.newChanges = newName?.name ? true : this.newChanges;
  }

  async uploadProfileFile(): Promise<void> {
    const compressFile = await this.imageCompress.uploadFile();
    const image = await this.imageCompress.compressFile(
      compressFile.image,
      compressFile.orientation,
      50,
      90
    );
    const imageCropped = await this.modalsSrv.openCropperImageModal(image);
    this.storeData.picture = imageCropped
      ? imageCropped.image
      : this.storeData.picture;

    this.newChanges = imageCropped?.image ? true : this.newChanges;
  }

  async uploadBannerFile(): Promise<void> {
    const compressFile = await this.imageCompress.uploadFile();
    const image = await this.imageCompress.compressFile(
      compressFile.image,
      compressFile.orientation,
      50,
      90
    );
    const imageCropped = await this.modalsSrv.openCropperImageModal(
      image,
      'banner'
    );
    this.storeData.banner = imageCropped ? imageCropped.image : null;
    this.newChanges = imageCropped?.image ? true : this.newChanges;
  }

  revertProfile(): void {
    this.storeData.picture = this.store.picture;
  }

  async openColorPicker(
    type: string,
    format: FormatColor,
    title: string
  ): Promise<void> {
    if (this.store.typeAccount === 'free') {
      await this.modalsSrv.openActivateProModal();
    } else {
      const newFormat = await this.modalsSrv.openColorPickerModal(
        {
          ...format,
        },
        title
      );
      switch (type) {
        case 'bars':
          this.formatColorBars = newFormat ? newFormat : this.formatColorBars;
          this.autoLinearGradient(this.formatColorBars.txtColor);
          break;
        case 'page':
          this.formatColorPage = newFormat ? newFormat : this.formatColorPage;
          break;
        case 'storeCard':
          this.formatColorStoreCard = newFormat
            ? newFormat
            : this.formatColorStoreCard;
          break;

        case 'categoriesBar':
          this.formatColorCategoriesBar = newFormat
            ? newFormat
            : this.formatColorCategoriesBar;

          this.customizeCategoryBar(this.formatColorCategoriesBar);
          break;
      }

      this.newChanges = newFormat ? true : this.newChanges;
    }
  }

  changeRecomendationsStructure(): void {
    switch (this.formatStructureRecommendations.type) {
      case 'row-image':
        this.formatStructureRecommendations.type = 'row-card';
        break;
      case 'row-card':
        this.formatStructureRecommendations.type = 'block';
        break;
      case 'block':
        this.formatStructureRecommendations.type = 'row-image';
        break;
    }
    this.newChanges = true;
  }

  async toggleShowRecommendations(): Promise<void> {
    if (this.store.typeAccount === 'free') {
      await this.modalsSrv.openActivateProModal();
    } else {
      this.formatStructureRecommendations.show =
        !this.formatStructureRecommendations.show;
      this.newChanges = true;
    }
  }

  customizeCategoryBar(format: FormatColor): void {
    const accent = document.getElementsByClassName('mat-ink-bar')[0];
    const bar = document.getElementsByTagName('mat-tab-header')[0];
    const labels = document.getElementsByClassName('mat-tab-label-content');
    const chevron: any = document.getElementsByClassName(
      'mat-tab-header-pagination-chevron'
    );
    this.renderer.setStyle(accent, 'background', format.txtColor);
    this.renderer.setStyle(bar, 'background', format.bgColor);
    for (let index = 0; index < labels.length; index++) {
      const element = labels[index];
      this.renderer.setStyle(element, 'color', format.txtColor);
    }
    for (let index = 0; index < chevron.length; index++) {
      const element = chevron[index];
      this.renderer.setStyle(element, 'border-color', format.txtColor);
      this.renderer.setStyle(element, 'opacity', '0.87');
    }
  }

  getActiveCategories(): void {
    const allCategories = this.products.map((product) => product.category);
    const removeDuplicates = [
      ...new Set(
        allCategories.filter((category) => category !== null && category !== '')
      ),
    ];
    this.categories = removeDuplicates;
  }

  tabChange(ev: any) {
    if (ev.tab.textLabel !== 'Inicio') {
      this.productsByCategory = [];
      setTimeout(() => {
        const category = ev.tab.textLabel;
        this.categorySelected = category;
        this.productsByCategory = this.products.filter((product) => {
          return product.category === category;
        });
      }, 450);
    }
  }

  changeStructureProducts(): void {
    switch (this.formatStructureProducts.type) {
      case 'block':
        this.formatStructureProducts.type = 'list';
        break;
      case 'list':
        this.formatStructureProducts.type = 'block';
        break;
    }
    this.newChanges = true;
  }

  changeStructureProductsByCategory(): void {
    switch (this.formatStructureProductsByCategory.type) {
      case 'block':
        this.formatStructureProductsByCategory.type = 'list';
        break;
      case 'list':
        this.formatStructureProductsByCategory.type = 'block';
        break;
    }
    this.newChanges = true;
  }

  async editText(type: string): Promise<void> {
    if (this.store.typeAccount === 'free') {
      await this.modalsSrv.openActivateProModal();
    } else {
      const newLabel = await this.modalsSrv.openAlertInputModal({
        header: 'Cambiar título',
        value:
          type === 'products'
            ? this.formatStructureProducts.label
            : this.formatStructureRecommendations.label,
        maxLength: 25,
        placeholder: 'Introduce nuevo título',
        label: 'Nombre',
      });
      switch (type) {
        case 'recommendations':
          this.formatStructureRecommendations.label = newLabel
            ? newLabel.name
            : this.formatStructureRecommendations.label;

          break;

        case 'products':
          this.formatStructureProducts.label = newLabel
            ? newLabel.name
            : this.formatStructureProducts.label;

          break;
      }
      this.newChanges = newLabel?.name ? true : this.newChanges;
    }
  }

  initStore(): void {
    this.linearGradient = this.store.styles?.linearGradient
      ? this.store.styles.linearGradient
      : 'linear-gradient(#00000080, #ffffff36)';
    this.formatColorStoreCard = this.store.styles?.storeCard
      ? this.store.styles.storeCard
      : { bgColor: '#ffffff', txtColor: '#000000' };
    this.formatColorBars = this.store.styles?.topbar
      ? this.store.styles.topbar
      : { bgColor: '#222428', txtColor: '#ffffff' };

    this.formatColorPage = this.store.styles?.content
      ? this.store.styles.content
      : { bgColor: '#ffffff', txtColor: '#000000' };

    this.formatColorCategoriesBar = this.store.styles?.navbar
      ? this.store.styles.navbar
      : { bgColor: '#ffffff', txtColor: '#000000' };

    this.formatStructureRecommendations = this.store.styles?.structureHighlights
      ? { ...this.store.styles.structureHighlights }
      : {
          type: 'row-image',
          show: true,
          label: 'Recomendaciones',
        };

    this.formatStructureProducts = this.store.styles?.structureProducts
      ? { ...this.store.styles.structureProducts }
      : {
          type: 'block',
          label: 'Todos los productos',
        };

    this.formatStructureProductsByCategory = this.store.styles
      ?.structureProductsByCategory
      ? { ...this.store.styles.structureProductsByCategory }
      : {
          type: 'block',
          label: null,
        };

    this.storeData = {
      category: this.store.category,
      name: this.store.name,
      picture: this.store.picture,
      banner: this.store.banner,
      phone: this.store.phone,
    };

    this.contactData = this.store.contactData
      ? this.store.contactData
      : [
          {
            name: 'whatsapp',
            link: this.store.phone,
            show: true,
            icon: 'logo-whatsapp',
            path: 'https://wa.me/',
          },
          { name: 'facebook', link: null, show: false, icon: 'logo-facebook' },
          {
            name: 'instagram',
            link: null,
            show: false,
            icon: 'logo-instagram',
          },
          {
            name: 'phone',
            link: null,
            show: false,
            icon: 'call',
            path: 'tel:',
          },
        ];
    if (this.store.categoryIcon) {
      this.iconCategory = this.store.categoryIcon;
    } else {
      this.getCategoryIcon();
    }
  }

  getCategoryIcon(): void {
    switch (this.storeData.category) {
      case 'comida':
        this.iconCategory = 'restaurant';
        break;
      case 'abarrotes':
        this.iconCategory = 'basket';
        break;
      case 'farmacia':
        this.iconCategory = 'medkit';
        break;
      case 'ecommerce':
        this.iconCategory = 'cart'
        break;  
      case 'licoreria':
        this.iconCategory = 'beer';
        break;
    }
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  autoLinearGradient(hex: string) {
    const rgb = this.hexToRgb(hex);
    var opacity = Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
    if (opacity > 125) {
      this.linearGradient = 'linear-gradient(#00000080, #ffffff36)';
    } else {
      this.linearGradient = 'linear-gradient(#ffffffa8, #00000000)';
    }
  }

  async openThemePicker(): Promise<void> {
    const newTheme = await this.modalsSrv.openThemePickerModal();
    if (newTheme) {
      this.formatColorBars = newTheme.topbar;
      this.formatColorStoreCard = newTheme.storeCard;
      this.formatColorCategoriesBar = newTheme.navbar;
      this.customizeCategoryBar(this.formatColorCategoriesBar);
      this.formatColorPage = newTheme.content;
      this.autoLinearGradient(this.formatColorBars.txtColor);
      this.newChanges = true;
    }
  }

  async saveChanges(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const user = await this.authSrv.user.pipe(first()).toPromise();
      const newChanges = {
        name: this.storeData.name,
        category: this.storeData.category,
        categoryIcon: this.iconCategory,
        styles: {
          storeCard: this.formatColorStoreCard,
          topbar: this.formatColorBars,
          content: this.formatColorPage,
          navbar: this.formatColorCategoriesBar,
          structureHighlights: this.formatStructureRecommendations,
          structureProducts: this.formatStructureProducts,
          structureProductsByCategory: this.formatStructureProductsByCategory,
          linearGradient: this.linearGradient,
        },
        contactData: this.contactData,
      };
      await this.storeSrv.updateStore(newChanges, user.id, this.store.id);
      if (this.storeData.picture.split(':')[0] !== 'https') {
        await this.storeSrv.updatePictureStore(
          this.storeData.picture,
          this.store.id,
          user.id
        );
      }

      if (this.storeData.banner && this.storeData.banner.split(':')[0] !== 'https') {
        await this.storeSrv.updateBannerStore(
          this.storeData.banner,
          this.store.id,
          user.id
        );
      }
      this.newChanges = false;
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showDefaultNotify(
        'Los cambios se han guardado',
        'success'
      );
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Ha ocurrido un error, intentalo más tarde'
      );
    }
  }

  async undoChanges() {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message: 'Se perderan todos los cambios. ¿Desea continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Revertir cambios',
          handler: () => {
            this.initStore();
            this.customizeCategoryBar(this.formatColorCategoriesBar);
            this.newChanges = false;
            console.log(this.store);
          },
        },
      ],
    });

    await alert.present();
  }

  async editStoreCategory() {
    const newCategory = await this.modalsSrv.openEditStoreCategory(
      this.storeData.category
    );
    this.storeData.category = newCategory
      ? newCategory
      : this.storeData.category;
    this.getCategoryIcon();
    this.newChanges = newCategory ? true : false;
  }
}
