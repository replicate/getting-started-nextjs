// The Replicate webhook is a POST request where the request body is a prediction object.
// Identical webhooks can be sent multiple times, so this handler must be idempotent.

import { NextResponse } from 'next/server';
import Replicate, { validateWebhook } from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  console.log("Received webhook for prediction: ", req.body.id);

  const secret = process.env.REPLICATE_WEBHOOK_SIGNING_SECRET;
  const webhookIsValid = await validateWebhook(request, secret);

  if (!webhookIsValid) {
    return NextResponse.json({ detail: "Webhook is invalid" }, { status: 401 });
  }

  // process webhook here...

  return NextResponse.json({ detail: "Webhook is valid" }, { status: 200 });
}