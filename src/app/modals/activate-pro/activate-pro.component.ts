import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-activate-pro',
  templateUrl: './activate-pro.component.html',
  styleUrls: ['./activate-pro.component.scss'],
})
export class ActivateProComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}
