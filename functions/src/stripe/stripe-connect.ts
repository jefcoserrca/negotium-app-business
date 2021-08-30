import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const cors = require('cors')({
  origin: true,
});

const stripe = require('stripe')(
  'sk_test_51JI0n1LMlXGlXB7UySOv2jr61imrmxwq1aAinKinWtn1DDEqYwg2U1dzHxpEoUHzE1HbLAcBhKBsHc0Ipro16n3V00PwmI7WvB'
);

export const createAccount = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const email = req.body.email;
        const userId = req.body.userId;
        const storeId = req.body.storeId;
        const account = await stripe.accounts.create({
          email: email,
          country: 'MX',
          type: 'express',
        });

        const ref = admin.firestore().doc(`users/${userId}/stores/${storeId}`);

        await ref.update({
          stripeAccount: account.id,
        });

        return res.send(account).status(200);
      } catch (e) {
        return res.status(500).send(e);
      }
    } else {
      return res.status(403).send('Uknow error');
    }
  });
});

export const accountLink = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const accountId = req.body.accountId;
        const refreshUrl = req.body.refreshUrl;
        const returnUrl = req.body.returnUrl;

        const accountLink = await stripe.accountLinks.create({
          account: accountId,
          refresh_url: refreshUrl,
          return_url: returnUrl,
          type: 'account_onboarding',
        });

        return res.send(accountLink).status(200);
      } catch (e) {
        return res.status(500).send(e);
      }
    } else {
      return res.status(403).send('Uknow error');
    }
  });
});

export const getAccount = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const accountId = req.body.accountId;

        const account = await stripe.accounts.retrieve(accountId);

        return res.send(account).status(200);
      } catch (e) {
        return res.status(500).send(e);
      }
    } else {
      return res.status(403).send('Uknow error');
    }
  });
});

export const dashboardLink = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const accountId = req.body.accountId;

        const dashboardLink = await stripe.accounts.createLoginLink(accountId);

        return res.send(dashboardLink).status(200);
      } catch (e) {
        return res.status(500).send(e);
      }
    } else {
      return res.status(403).send('Uknow error');
    }
  });
});
