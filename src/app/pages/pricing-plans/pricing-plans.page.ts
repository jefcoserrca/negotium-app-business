import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ModalsService } from '../../services/modals.service';

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.page.html',
  styleUrls: ['./pricing-plans.page.scss'],
})
export class PricingPlansPage implements OnInit {
  user: User;
  constructor(
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
      await this.modalsSrv.openPaymentSubscriptionModal(
        this.user.stripeCustomer,
        typeAccount
      );
    } else {
      await this.router.navigate(['/login']);
    }
  }
}
