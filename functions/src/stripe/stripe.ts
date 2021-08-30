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
        const storeId = req.body.storeId;
        const customer = await stripe.customers.create({
          email: email,
          description: userId,
        });

        const ref = admin.firestore().doc(`users/${userId}/stores/${storeId}`);

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
