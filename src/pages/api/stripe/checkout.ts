// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getBaseUrl } from "~/utils/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const productIt = process.env.STRIPE_PRODUCT_ID!;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method not allowed" });
  }

  const { email } = req.body;

  try {
    const baseUrl = getBaseUrl();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      cancel_url: `${baseUrl}/dashboard`,
      success_url: `${baseUrl}/dashboard`,
      line_items: [{ price: productIt, quantity: 1 }],
      customer_email: email,
    });

    res.status(200).json({ redirect: checkoutSession.url });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}
