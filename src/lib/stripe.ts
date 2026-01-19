import { loadStripe, Stripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  // eslint-disable-next-line no-console
  console.warn("VITE_STRIPE_PUBLISHABLE_KEY is missing; Stripe disabled.");
}

export const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;

