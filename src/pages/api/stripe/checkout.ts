// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const productId = process.env.STRIPE_PRODUCT_ID!;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
    clerkId: string;
    expiredAt: string;
    baseUrl: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method not allowed" });
  }

  const { email, clerkId, expiredAt, baseUrl } = req.body;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      metadata: { clerkId, expiredAt },
      mode: "payment",
      cancel_url: `${baseUrl}/dashboard`,
      success_url: `${baseUrl}/dashboard`,
      line_items: [{ price: productId, quantity: 1 }],
      customer_email: email,
      customer_creation: "always",
      allow_promotion_codes: true,
    });

    res.status(200).json({ redirect: checkoutSession.url });
  } catch (error) {
    // TODO handle error
    console.log(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}
