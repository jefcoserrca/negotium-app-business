import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { HomeService } from '../../services/home.service';
import { UserProgress } from '../../models/progress';
import { ModalsService } from '../../services/modals.service';
import { StoreService } from '../../services/store.service';
import { first } from 'rxjs/operators';
import { Store } from '../../models/store';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  progess: UserProgress;
  store: Store;
  constructor(
    private homeSrv: HomeService,
    private modalsSrv: ModalsService,
    private storeSrv: StoreService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.progess = await this.homeSrv.getProgress();
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
  }

  async ionViewDidEnter() {
    const newProgress = await this.homeSrv.updateProgress();
    this.progess = this.progess === newProgress ? this.progess : newProgress;
  }

  async goToPayments(): Promise<void> {
    if (this.store.typeAccount === 'free') {
      this.showAlertActivatePro(
        'Las ventas aumentan 60% cuando aceptas pagos a través de tu tienda online. Es fácil, rápido y seguro!'
      );
    }

    await this.router.navigate(['/dashboard/sales']);
  }

  async showAlertActivatePro(text: string): Promise<void> {
    await this.modalsSrv.openActivateProModal(text);
  }
}
