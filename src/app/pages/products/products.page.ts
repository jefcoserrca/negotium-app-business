import { Component, OnInit } from '@angular/core';
import { Store } from '../../models/store';
import { StoreService } from '../../services/store.service';
import { first } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { ModalsService } from '../../services/modals.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  private store: Store;
  private allProducts: Array<Product>;
  private allCategories: Array<string>;
  products: Array<Product>;
  stockProducts: Array<Product> = [];
  categories: Array<string> = [];
  showLoading: boolean = true;
  account: string;
  searchTerm: string;
  searchTermStock: string;
  searchTermCategory: string;
  constructor(
    private storeSrv: StoreService,
    private productsSrv: ProductsService,
    private modalsSrv: ModalsService,
    private toastSrv: ToastService
  ) {}

  async ngOnInit() {
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.account = this.store.typeAccount;
  }

  async ionViewDidEnter() {
    await this.getProducts();
  }

  tabChange(ev: any) {
    return;
  }

  async getProducts(): Promise<void> {
    this.showLoading = true;
    this.products = await this.productsSrv.getProducts();
    this.allProducts = [...this.products];
    this.stockProducts = this.allProducts.filter(
      (product) => product.stock.stockController === true
    );
    this.categories = (await this.productsSrv.getCategories()).all;
    this.allCategories = [...this.categories];
    this.showLoading = false;
  }

  async openProductStock(product: Product): Promise<void> {
    if (this.store.typeAccount !== 'free') {
      const newStock = await this.modalsSrv.openStockModal({
        ...product.stock,
      });
      if (newStock) {
        product.stock = newStock;
        await this.modalsSrv.openLoadingModal();
        await this.productsSrv.updateProduct(product, product.id);
        this.stockProducts = this.products.filter(
          (product) => product.stock.stockController
        );
        await this.modalsSrv.dismissLoadingModal();
      }
    } else {
      this.toastSrv.showDefaultNotify(
        'Actualiza tu empresa a PRO para usar esta herramienta'
      );
      return;
    }
  }

  async openCreateCategory(item: string): Promise<void> {
    const index = this.allCategories.findIndex((category) => category === item);
    await this.modalsSrv.openCreateCategory(
      this.allCategories,
      index < 0 ? null : index
    );
    await this.getProducts();
  }

  async searchByTerm(type: string): Promise<void> {
    console.log(type);
    switch (type) {
      case 'products':
        this.serchProducts();
        break;

      case 'stock':
        this.serchStock();
        break;

      case 'categories':
        this.searchCategories();
        break;
    }
  }

  async serchProducts(): Promise<void> {
    if (this.searchTerm) {
      this.products = this.allProducts.filter((item) => {
        return (
          item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        );
      });
    } else {
      this.showLoading = true;
      this.products = [...this.allProducts];
      this.showLoading = false;
    }
  }

  async serchStock(): Promise<void> {
    if (this.searchTermStock) {
      this.stockProducts = this.allProducts.filter((item) => {
        return (
          item.name.toLowerCase().indexOf(this.searchTermStock.toLowerCase()) >
            -1 && item.stock.stockController === true
        );
      });
    } else {
      this.stockProducts = this.allProducts.filter(
        (product) => product.stock.stockController === true
      );
    }
  }
  async searchCategories(): Promise<void> {
    if (this.searchTermCategory) {
      this.categories = this.allCategories.filter((item) => {
        return (
          item.toLowerCase().indexOf(this.searchTermCategory.toLowerCase()) > -1
        );
      });
    } else {
      this.categories = [...this.allCategories];
    }
  }
}
