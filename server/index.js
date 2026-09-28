```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const app = express();
const PORT = process.env.PORT || 4242;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL || "";

// --------------------------------------------------
// Environment Validation
// --------------------------------------------------

if (!STRIPE_SECRET_KEY) {
  console.error("❌ Missing STRIPE_SECRET_KEY environment variable.");
  process.exit(1);
}

// --------------------------------------------------
// Stripe
// --------------------------------------------------

const stripe = new Stripe(STRIPE_SECRET_KEY);

// --------------------------------------------------
// CORS
// --------------------------------------------------

// Supports multiple frontend URLs:
// CLIENT_URL=https://example.vercel.app,https://example.com

const allowedOrigins = CLIENT_URL
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

// Local development fallbacks
const localOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
];

const corsOrigins =
  allowedOrigins.length > 0
    ? allowedOrigins
    : localOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests or Postman.
      if (!origin) {
        return callback(null, true);
      }

      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`⚠️ Blocked CORS request from: ${origin}`);

      return callback(
        new Error("Origin not allowed by CORS")
      );
    },

    methods: ["GET", "POST", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json());

// --------------------------------------------------
// Utility Functions
// --------------------------------------------------

const calculateOrderAmount = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  const subtotal = items.reduce((total, item) => {
    const price = Number(item?.product?.price);
    const quantity = Number(item?.quantity);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      price < 0
    ) {
      return total;
    }

    return total + price * quantity;
  }, 0);

  const tax = subtotal * 0.08;

  const shipping = subtotal > 100
    ? 0
    : 9.99;

  const total = subtotal + tax + shipping;

  // Stripe expects the amount in the smallest
  // currency unit (cents for USD).
  return Math.round(total * 100);
};

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "Stripe backend is running.",
  });
});

// --------------------------------------------------
// Create Payment Intent
// --------------------------------------------------

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const {
      items,
      customer,
      shippingAddress,
      totals,
    } = req.body || {};

    // ----------------------------------------------
    // Validate Cart
    // ----------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Cart is empty.",
      });
    }

    // ----------------------------------------------
    // Calculate Order Amount
    // ----------------------------------------------

    const amount = calculateOrderAmount(items);

    if (!Number.isInteger(amount) || amount < 50) {
      return res.status(400).json({
        error: "Unable to calculate a valid order total.",
      });
    }

    // ----------------------------------------------
    // Customer Information
    // ----------------------------------------------

    const customerName =
      customer?.firstName && customer?.lastName
        ? `${customer.firstName} ${customer.lastName}`
        : undefined;

    // ----------------------------------------------
    // Create Stripe Payment Intent
    // ----------------------------------------------

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount,
        currency: "usd",

        automatic_payment_methods: {
          enabled: true,
        },

        receipt_email: customer?.email,

        // ------------------------------------------
        // Stripe Metadata
        // ------------------------------------------

        metadata: {
          customer_name: customerName,

          shipping_city:
            shippingAddress?.city || "",

          shipping_country:
            shippingAddress?.country || "",

          subtotal:
            totals?.subtotal?.toString() || "",

          tax:
            totals?.tax?.toString() || "",

          shipping:
            totals?.shipping?.toString() || "",
        },

        // ------------------------------------------
        // Shipping Information
        // ------------------------------------------

        shipping: shippingAddress
          ? {
              name: customerName,

              phone:
                customer?.phone || undefined,

              address: {
                line1:
                  shippingAddress.street,

                line2:
                  shippingAddress.apartment ||
                  undefined,

                city:
                  shippingAddress.city,

                state:
                  shippingAddress.state,

                postal_code:
                  shippingAddress.postalCode,

                country:
                  shippingAddress.country,
              },
            }
          : undefined,
      });

    // ----------------------------------------------
    // Response
    // ----------------------------------------------

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("❌ Stripe error:", error);

    return res.status(500).json({
      error: "Failed to create payment intent.",
      details:
        error instanceof Error
          ? error.message
          : "Unknown server error.",
    });
  }
});

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found.",
    path: req.originalUrl,
  });
});

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use((error, _req, res, _next) => {
  console.error("❌ Server error:", error);

  return res.status(500).json({
    error: "Internal server error.",
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log("========================================");
  console.log("🚀 Stripe backend started");
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Allowed origins:`);

  corsOrigins.forEach((origin) => {
    console.log(`   - ${origin}`);
  });

  console.log("========================================");
});
```
