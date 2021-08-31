import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { first } from 'rxjs/operators';
import { ModalsService } from '../../services/modals.service';
import { AccountService } from '../../services/account.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payment-subscription',
  templateUrl: './payment-subscription.component.html',
  styleUrls: ['./payment-subscription.component.scss'],
})
export class PaymentSubscriptionComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() stripeCustomer: string;
  @Input() type: 'pro' | 'vip';

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontSize: '19px',
        backgroundColor: '#f4f4f4',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };
  stripeForm: FormGroup;
  constructor(
    private accountSrv: AccountService,
    private authSrv: AuthenticationService,
    private fb: FormBuilder,
    private modalsSrv: ModalsService,
    private stripeService: StripeService,
    private toastSrv: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.stripeForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
    });
  }

  async createToken(): Promise<void> {
    if (this.stripeForm.valid) {
      try {
        await this.modalsSrv.openLoadingModal();
        const name = this.stripeForm.get('name').value;
        const result = await this.stripeService
          .createPaymentMethod({ type: 'card', card: this.card.element })
          .toPromise();
        if (result.paymentMethod) {
          const user: User = await this.authSrv.user.pipe(first()).toPromise();
          const attachPayment = await this.accountSrv
            .attachPaymentMethod({
              customerId: user.stripeCustomer,
              paymentMethodId: result.paymentMethod.id,
            })
            .toPromise();
          const subscription = await this.accountSrv
            .createSubscription({
              userId: user.id,
              paymentMethodId: result.paymentMethod.id,
              customerId: user.stripeCustomer,
              type: this.type,
              priceId: '',
            })
            .toPromise();
          console.log(subscription, attachPayment);
          await this.modalsSrv.dismissLoadingModal();
          await this.toastSrv.showDefaultNotify('Bienvenido a tu nuevo plan!');
        } else {
          await this.modalsSrv.dismissLoadingModal();
          await this.toastSrv.showErrorNotify(result.error.message);
        }
      } catch (error) {
        console.log(error);
        await this.modalsSrv.dismissLoadingModal();
        await this.toastSrv.showErrorNotify(
          'Algo ha salido mal, por facor intente más tarde!'
        );
      }
    } else {
    }
  }
}
