import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const port = process.env.PORT || 4242;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY in environment");
  process.exit(1);
}

// Use the default API version configured in your Stripe dashboard.
// Removing the explicit apiVersion here fixes "Invalid Stripe API version" errors.
const stripe = new Stripe(stripeSecretKey);

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin:
      allowedOrigins.length > 0
        ? allowedOrigins
        : ["http://localhost:8080", "http://localhost:5173"],
  })
);
app.use(express.json());

const calculateOrderAmount = (items) => {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item?.product?.price);
    const quantity = Number(item?.quantity) || 0;
    if (Number.isNaN(price) || Number.isNaN(quantity)) return sum;
    return sum + price * quantity;
  }, 0);

  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;

  return Math.round((subtotal + tax + shipping) * 100);
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/create-payment-intent", async (req, res) => {
  const { items, customer, shippingAddress, totals } = req.body || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const amount = calculateOrderAmount(items);
  if (!amount || amount < 50) {
    return res
      .status(400)
      .json({ error: "Unable to calculate a valid order total" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: customer?.email,
      metadata: {
        customer_name:
          customer?.firstName && customer?.lastName
            ? `${customer.firstName} ${customer.lastName}`
            : undefined,
        shipping_city: shippingAddress?.city,
        shipping_country: shippingAddress?.country,
        subtotal: totals?.subtotal?.toString(),
        tax: totals?.tax?.toString(),
        shipping: totals?.shipping?.toString(),
      },
      shipping: shippingAddress
        ? {
            name:
              customer?.firstName && customer?.lastName
                ? `${customer.firstName} ${customer.lastName}`
                : undefined,
            phone: customer?.phone,
            address: {
              line1: shippingAddress.street,
              line2: shippingAddress.apartment || undefined,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
          }
        : undefined,
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error", error);
    return res
      .status(500)
      .json({ error: "Failed to create payment intent", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Stripe server listening at http://localhost:${port}`);
});

