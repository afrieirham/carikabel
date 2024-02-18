// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getBaseUrl } from "~/utils/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    stripeId: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method not allowed" });
  }

  const { stripeId } = req.body;

  try {
    const baseUrl = getBaseUrl();

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeId,
      return_url: `${baseUrl}/dashboard`,
    });

    res.status(200).json({ redirect: session.url });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}
