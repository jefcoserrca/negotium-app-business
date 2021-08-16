import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  styleUrls: ['./edit-category-modal.component.scss'],
})
export class EditCategoryModalComponent implements OnInit {
  @Input() value: string;
  categorySelected: string;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.categorySelected = this.value;
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  async returnCategory(): Promise<void> {
    await this.modalCtrl.dismiss(this.categorySelected);
  }
}
