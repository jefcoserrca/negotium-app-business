import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ModalsService } from '../../services/modals.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.page.html',
  styleUrls: ['./pricing-plans.page.scss'],
})
export class PricingPlansPage implements OnInit {
  user: User;
  constructor(
    private alertCtrl: AlertController,
    private authSrv: AuthenticationService,
    private modalsSrv: ModalsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authSrv.user.pipe(first()).toPromise();
    console.log(this.user);
  }

  async selectPlan(typeAccount: 'pro' | 'vip'): Promise<void> {
    if (this.user) {
      if (
        this.user.subscriptionStatus === 'canceled' ||
        !this.user.subscriptionStatus ||
        !this.user.subscriptionId ||
        this.user.subscription === 'free'
      ) {
        await this.modalsSrv.openPaymentSubscriptionModal(
          this.user.stripeCustomer,
          typeAccount
        );
      } else {
        this.alertChange(typeAccount);
      }
    } else {
      await this.router.navigate(['/login']);
    }
  }

  private async alertChange(subscriptionPlan: 'vip' | 'pro'): Promise<void> {
    await this.modalsSrv.openAlertModal({
      role: 'update',
      newSubscription: subscriptionPlan,
    });
  }
}
