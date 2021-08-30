import * as admin from 'firebase-admin';
admin.initializeApp();
export const stripe = require('./stripe/stripe');
export const stripeConnect = require('./stripe/stripe-connect');