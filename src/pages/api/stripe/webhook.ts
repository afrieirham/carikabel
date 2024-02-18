import { clerkClient } from "@clerk/nextjs";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { db } from "~/server/db";

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
  if (event.type === "checkout.session.completed") {
    if (event.data.object.customer_email) {
      const user = await db.candidate.update({
        where: { email: event.data.object.customer_email },
        data: { type: "PAID" },
      });
      await clerkClient.users.updateUserMetadata(user.clerkId, {
        publicMetadata: {
          type: "PAID",
        },
      });
    }
    console.log(event?.data?.object);
  }
  res.json({ received: true });
}
