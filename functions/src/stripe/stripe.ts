import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const cors = require('cors')({
  origin: true,
});

const stripe = require('stripe')(
  'sk_test_51JI0n1LMlXGlXB7UySOv2jr61imrmxwq1aAinKinWtn1DDEqYwg2U1dzHxpEoUHzE1HbLAcBhKBsHc0Ipro16n3V00PwmI7WvB'
);

export const createCustomer = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const email = req.body.email;
        const userId = req.body.userId;
        const customer = await stripe.customers.create({
          email: email,
          description: userId,
        });

        const ref = admin.firestore().doc(`users/${userId}`);

        await ref.update({
          stripeCustomer: customer.id,
        });

        return res.send(customer).status(200);
      } catch (e) {
        return res.status(500).send(e);
      }
    } else {
      return res.status(403).send('Uknow error');
    }
  });
});

export const createSubscription = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const customerId = req.body.customerId;
        const priceId = req.body.priceId;
        const paymentMethodId = req.body.paymentMethodId;
        const userId = req.body.userId;
        const type = req.body.type;

        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          default_payment_method: paymentMethodId,
          trial_from_plan: true,
        });

        const ref = admin.firestore().doc(`users/${userId}`);
        if (
          subscription.status === 'active' ||
          subscription.status === 'trialing'
        ) {
          await ref.update({
            subscription: type,
          });
        }
        await ref.update({
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
        });
        return res.send(subscription).status(200);
      } catch (e) {
        return res.status(500).send(e);
      }
    } else {
      return res.status(403).send('Uknow error');
    }
  });
});

export const attachPaymentMethod = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const customerId = req.body.customerId;
        const paymentMethodId = req.body.paymentMethodId;
        const result = await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
        return res.send(result).status(200);
      } catch (e) {
        return res.status(500).send(e);
      }
    } else {
      return res.status(403).send('Uknow error');
    }
  });
});
