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
  contactData: Array<ContactData> = [
    {
      name: 'whatsapp',
      link: '524661003644',
      show: true,
      icon: 'logo-whatsapp',
      path: 'https://wa.me/',
    },
    { name: 'facebook', link: null, show: false, icon: 'logo-facebook' },
    { name: 'instagram', link: null, show: false, icon: 'logo-instagram' },
    { name: 'phone', link: null, show: false, icon: 'call', path: 'tel:' },
  ];
  formatColorStoreCard: FormatColor = { bgColor: '#fff', txtColor: '#000' };
  formatColorBars: FormatColor = { bgColor: '#222428', txtColor: '#fff' };
  formatColorPage: FormatColor = { bgColor: '#fff', txtColor: '#000' };
  formatColorCategoriesBar: FormatColor = { bgColor: '#fff', txtColor: '#000' };
  products: Array<Product> = [];
  formatStructureRecommendations: StructureRecommendations = {
    type: 'row-image',
    show: true,
    label: 'Recomendaciones',
  };
  formatStructureProducts: StructureProducts = {
    type: 'block',
    label: 'Todos los productos',
  };
  formatStructureProductsByCategory: StructureProducts = {
    type: 'block',
    label: null,
  };
  categories: Array<string> = [];
  productsByCategory: Array<Product> = [];
  categorySelected: string = '';
  constructor(
    private storeSrv: StoreService,
    private alertCtrl: AlertController,
    private productsSrv: ProductsService,
    private modalsSrv: ModalsService,
    private toastSrv: ToastService,
    private imageCompress: NgxImageCompressService,
    private renderer: Renderer2
  ) {}

  async ngOnInit(): Promise<void> {
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.setStyles();
    this.storeData = {
      name: this.store.name,
      picture: this.store.picture,
      banner: this.store.banner,
      phone: this.store.phone,
    };
    this.account = this.store.typeAccount;
    this.contactData = this.store.contactData
      ? this.store.contactData
      : this.contactData;
    this.products = await this.productsSrv.getProducts();
    this.getActiveCategories();
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
          },
        },
      ],
    });

    await alert.present();
  }

  removeContactLink(item): void {
    item.link = item.name === 'whatsapp' ? item.link : null;
    item.show = false;
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
    this.storeData.picture = imageCropped ? imageCropped.image : null;
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
  }

  revertProfile(): void {
    this.storeData.picture = this.store.picture;
  }

  async openColorPicker(type: string, format: FormatColor): Promise<void> {
    const newFormat = await this.modalsSrv.openColorPickerModal({
      ...format,
    });
    switch (type) {
      case 'bars':
        this.formatColorBars = newFormat ? newFormat : this.formatColorBars;
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
  }

  toggleShowRecommendations() {
    this.formatStructureRecommendations.show =
      !this.formatStructureRecommendations.show;
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
  }

  async editText(type: string): Promise<void> {
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
    console.log(newLabel);
  }

  setStyles(): void {
    this.formatColorStoreCard = this.store.styles?.storeCard
      ? this.store.styles.storeCard
      : this.formatColorStoreCard;
    this.formatColorBars = this.store.styles?.topbar
      ? this.store.styles.topbar
      : this.formatColorBars;

    this.formatColorPage = this.store.styles?.content
      ? this.store.styles.content
      : this.formatColorPage;

    this.formatColorCategoriesBar = this.store.styles?.navbar
      ? this.store.styles.navbar
      : this.formatColorCategoriesBar;

    this.formatStructureRecommendations = this.store.styles?.structureHighlights
      ? this.store.styles.structureHighlights
      : this.formatStructureRecommendations;

    this.formatStructureProducts = this.store.styles?.structureProducts
      ? this.store.styles.structureProducts
      : this.formatStructureProducts;

    this.formatStructureProductsByCategory = this.store.styles
      ?.structureProductsByCategory
      ? this.store.styles.structureProducts
      : this.formatStructureProductsByCategory;
  }
}
