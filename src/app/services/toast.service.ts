import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async showErrorNotify(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: message,
      mode: 'ios',
      color: 'danger',
      position: 'top',
      duration: 3000,
    });

    return toast.present().then();
  }

  async showDefaultNotify(message: string, color: string = 'secondary'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: message,
      mode: 'ios',
      color: color,
      position: 'top',
      duration: 3000,
    });

    return toast.present().then();
  }
}
