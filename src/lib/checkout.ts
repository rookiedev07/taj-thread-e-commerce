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

export const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload
): Promise<{ clientSecret: string }> => {
  const response = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error || "Unable to start payment");
  }

  return response.json();
};

