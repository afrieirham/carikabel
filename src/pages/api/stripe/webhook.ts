import { clerkClient } from "@clerk/nextjs/server";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405);
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    res.status(500);
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

  // update user to paid
  if (
    event.type === "checkout.session.completed" &&
    event.data.object.payment_status === "paid"
  ) {
    if (event.data.object.customer_email) {
      const clerkId = event.data?.object?.metadata?.clerkId;
      await clerkClient.users.updateUserMetadata(clerkId!, {
        publicMetadata: {
          expiredAt: event.data?.object?.metadata?.expiredAt,
          stripeId: event?.data?.object.customer,
        },
        // privateMetadata: { stripeId: event?.data?.object.customer },
      });
    }
  }
  res.json({ received: true });
}
