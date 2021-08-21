import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-activate-pro',
  templateUrl: './activate-pro.component.html',
  styleUrls: ['./activate-pro.component.scss'],
})
export class ActivateProComponent implements OnInit {
  @Input() message: string =
    'Con el plan Pro goza de las herramientas y beneficios que te ofrecemospara que tu negocio crezca.';
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}
