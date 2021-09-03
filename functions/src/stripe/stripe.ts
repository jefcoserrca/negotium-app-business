import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const cors = require('cors')({
  origin: true,
});

const stripe = require('stripe')(
  'sk_test_51JI0n1LMlXGlXB7UySOv2jr61imrmxwq1aAinKinWtn1DDEqYwg2U1dzHxpEoUHzE1HbLAcBhKBsHc0Ipro16n3V00PwmI7WvB'
);

const endpointSecret = 'whsec_AvGXMpvsRx9YViDyezalmJwwpTkVDfsF';
const priceIdVip = 'price_1JUKAcLMlXGlXB7U2Va2HPU6';
const priceIdPro = 'price_1JUK8oLMlXGlXB7UsvqSjRsH';

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

export const getItems = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const subscriptionId = req.body.subscriptionId;
        const result = await stripe.subscriptionItems.list({
          subscription: subscriptionId,
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

export const updateItem = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const itemId = req.body.itemId;
        const priceId = req.body.priceId;
        const quantity = req.body.quantity;
        const result = await stripe.subscriptionItems.update(itemId, {
          quantity: quantity ? quantity : 1,
          price: priceId,
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

export const stripeWebhook = functions.https.onRequest(
  async (req, res: any) => {
    let event: any;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers['stripe-signature'],
        endpointSecret
      );

      const ref = admin.firestore().collection('users');

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('------ PAYMENT INTENT--------');
          console.log(paymentIntent);
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          console.log('------ INVOICE --------');
          console.log(invoice);
          break;

        case 'customer.subscription.updated':
          const customerSubscription = event.data.object;
          const typeSubscription =
            customerSubscription.items.data[0].price.id === priceIdPro
              ? 'pro'
              : customerSubscription.items.data[0].price.id === priceIdVip
              ? 'vip'
              : 'free';
          const docs = await ref
            .where('stripeCustomer', '==', customerSubscription.customer)
            .limit(1)
            .get();
          if (!docs.empty) {
            const userRef = docs.docs[0].ref;
            await userRef.update({
              subscriptionStatus: customerSubscription.status,
              subscription: typeSubscription,
              test: true
            });

            if (
              customerSubscription.status === 'canceled' ||
              customerSubscription.status === 'incomplete_expired'
            ) {
              await userRef.update({
                subscription: 'free',
                subscriptionId: null,
              });
            }
          }
          break;

        case 'customer.subscription.deleted':
          const subscriptionDeleted = event.data.object;
          const getDocs = await ref
            .where('stripeCustomer', '==', subscriptionDeleted.customer)
            .limit(1)
            .get();
          if (!getDocs.empty) {
            const userRef = getDocs.docs[0].ref;
            await userRef.update({
              subscriptionStatus: subscriptionDeleted.status,
            });

            if (subscriptionDeleted.status === 'canceled') {
              await userRef.update({
                subscription: 'free',
                subscriptionId: null,
              });
            }
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.send().status(200);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);
