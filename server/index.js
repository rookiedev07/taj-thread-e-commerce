
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

// ==================================================
// CONFIGURATION
// ==================================================

const app = express();
const PORT = process.env.PORT || 4242;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL || "";

// ==================================================
// ENVIRONMENT VALIDATION
// ==================================================

if (!STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY environment variable.");
  process.exit(1);
}

// ==================================================
// STRIPE
// ==================================================

const stripe = new Stripe(STRIPE_SECRET_KEY);

// ==================================================
// CORS CONFIGURATION
// ==================================================

const configuredOrigins = CLIENT_URL
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const localOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
];

const isAllowedOrigin = (origin) => {
  // Requests without an Origin header
  // are allowed (Postman/server-to-server requests).
  if (!origin) {
    return true;
  }

  // Explicitly configured domains.
  if (configuredOrigins.includes(origin)) {
    return true;
  }

  // Local development.
  if (localOrigins.includes(origin)) {
    return true;
  }

  // Any HTTPS Vercel deployment.
  if (
    origin.startsWith("https://") &&
    origin.endsWith(".vercel.app")
  ) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS request from:", origin);

      return callback(
        new Error("Origin not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(express.json());

// ==================================================
// ORDER CALCULATION
// ==================================================

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
      price < 0 ||
      quantity <= 0
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

  // Stripe expects USD amounts in cents.
  return Math.round(total * 100);
};

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Stripe backend is running.",
  });
});

// ==================================================
// CREATE PAYMENT INTENT
// ==================================================

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const {
      items,
      customer,
      shippingAddress,
      totals,
    } = req.body || {};

    // ------------------------------------------------
    // Validate cart
    // ------------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Cart is empty.",
      });
    }

    // ------------------------------------------------
    // Calculate order amount
    // ------------------------------------------------

    const amount = calculateOrderAmount(items);

    if (!Number.isInteger(amount) || amount < 50) {
      return res.status(400).json({
        error: "Unable to calculate a valid order total.",
      });
    }

    // ------------------------------------------------
    // Customer name
    // ------------------------------------------------

    let customerName;

    if (
      customer?.firstName &&
      customer?.lastName
    ) {
      customerName =
        customer.firstName +
        " " +
        customer.lastName;
    }

    // ------------------------------------------------
    // Create Stripe Payment Intent
    // ------------------------------------------------

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",

        automatic_payment_methods: {
          enabled: true,
        },

        receipt_email:
          customer?.email || undefined,

        // --------------------------------------------
        // Metadata
        // --------------------------------------------

        metadata: {
          customer_name: customerName || "",

          shipping_city:
            shippingAddress?.city || "",

          shipping_country:
            shippingAddress?.country || "",

          subtotal:
            totals?.subtotal !== undefined
              ? String(totals.subtotal)
              : "",

          tax:
            totals?.tax !== undefined
              ? String(totals.tax)
              : "",

          shipping:
            totals?.shipping !== undefined
              ? String(totals.shipping)
              : "",
        },

        // --------------------------------------------
        // Shipping
        // --------------------------------------------

        shipping: shippingAddress
          ? {
              name: customerName || "Customer",

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

    // ------------------------------------------------
    // Send client secret
    // ------------------------------------------------

    return res.status(200).json({
      clientSecret:
        paymentIntent.client_secret,
    });

  } catch (error) {
    console.error(
      "Stripe payment error:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to create payment intent.",

      details:
        error instanceof Error
          ? error.message
          : "Unknown server error.",
    });
  }
});

// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found.",
    path: req.originalUrl,
  });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use(
  (error, _req, res, _next) => {
    console.error(
      "Server error:",
      error
    );

    res.status(500).json({
      error: "Internal server error.",
    });
  }
);

// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {
  console.log(
    "========================================"
  );

  console.log(
    "Stripe backend started successfully."
  );

  console.log(
    "Port:",
    PORT
  );

  console.log(
    "Configured frontend origins:"
  );

  if (configuredOrigins.length === 0) {
    console.log(
      "  None configured."
    );
  } else {
    configuredOrigins.forEach(
      (origin) => {
        console.log(
          "  -",
          origin
        );
      }
    );
  }

  console.log(
    "All HTTPS *.vercel.app origins: ALLOWED"
  );

  console.log(
    "========================================"
  );
});
