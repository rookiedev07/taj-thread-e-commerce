import { CartItem } from "@/types/product";

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CheckoutAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreatePaymentIntentPayload {
  items: CartItem[];
  customer: CheckoutCustomer;
  shippingAddress: CheckoutAddress;
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL;

export const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload
): Promise<{ clientSecret: string }> => {
  if (!API_URL) {
    throw new Error(
      "VITE_API_URL is missing. Please configure the Render backend URL in Vercel."
    );
  }

  const response = await fetch(
    `${API_URL}/api/create-payment-intent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error?.error ||
        `Payment server returned ${response.status}.`
    );
  }

  return response.json();
};
