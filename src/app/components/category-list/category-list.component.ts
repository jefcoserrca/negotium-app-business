import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Store } from '../../models/store';
import { ProductsService } from '../../services/products.service';
import { ModalController } from '@ionic/angular';
import { ModalsService } from '../../services/modals.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  user: User;
  store: Store;
  categories: Array<string>;
  @Input() isModal: boolean;
  showLoading: boolean = true;
  searchTerm: string;
  constructor(
    private modalCtrl: ModalController,
    private productsSrv: ProductsService,
    private modalSrv: ModalsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.showLoading = true;
    this.categories = (await this.productsSrv.getCategories()).all;
    this.showLoading = false;
  }

  async close(data = null): Promise<void> {
    await this.modalCtrl.dismiss(data);
  }

  async selectCategory(item: string, i: number): Promise<void> {
    if (this.isModal) {
      await this.close(item);
    } else {
      const allCategories: [] = (await this.productsSrv.getCategories()).all;
      i = allCategories.findIndex((category) => category === item);
    }
  }

  async createCategory(): Promise<void> {
    this.modalSrv.openCreateCategory(this.categories);
  }

  async searchByTerm(): Promise<void> {
    if (this.searchTerm) {
      this.categories = this.categories.filter((item) => {
        return item.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    } else {
      this.showLoading = true;
      this.categories = (await this.productsSrv.getCategories()).all;
      this.showLoading = false;
    }
  }
}
