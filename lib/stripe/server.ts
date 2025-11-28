/**
 * Stripe Server Client
 * Use this in API routes, Server Actions, and Server Components
 */

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

/**
 * Create Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(params: {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    customer: params.customerId,
    customer_email: params.customerId ? undefined : params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    subscription_data: {
      metadata: params.metadata,
    },
  });

  return session;
}

/**
 * Create Stripe Customer Portal Session
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session;
}

/**
 * Get Stripe Customer
 */
export async function getCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

/**
 * Get Stripe Subscription
 */
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel Stripe Subscription
 */
export async function cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
  if (cancelAtPeriodEnd) {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

/**
 * Reactivate Stripe Subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * List invoices for a customer
 */
export async function listInvoices(customerId: string, limit = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
  });
}

/**
 * Get total revenue for a period
 */
export async function getTotalRevenue(startDate?: Date, endDate?: Date) {
  const charges = await stripe.charges.list({
    created: {
      gte: startDate ? Math.floor(startDate.getTime() / 1000) : undefined,
      lte: endDate ? Math.floor(endDate.getTime() / 1000) : undefined,
    },
    limit: 100,
  });

  return charges.data.reduce((total, charge) => {
    if (charge.paid && !charge.refunded) {
      return total + charge.amount;
    }
    return total;
  }, 0);
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
