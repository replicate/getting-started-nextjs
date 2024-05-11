// The Replicate webhook is a POST request where the request body is a prediction object.
// Identical webhooks can be sent multiple times, so this handler must be idempotent.
import { validateWebhook } from "replicate";

export default async function handler(req, res) {
  console.log("Received webhook for prediction: ", req.body.id);

  const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NGROK_HOST;
  const secret = process.env.REPLICATE_WEBHOOK_SIGNING_SECRET;

  // validateWebhook expects a capital-R Request object (not an old-school Next.js request object)
  // so we create a new Request object here with the same headers, method, and body.
  // TODO: remove this after updating the app use to Next.js App router
  const requestData = new Request(`${host}${req.url}`, {
    headers: req.headers,
    method: req.method,
    body: JSON.stringify(req.body),
  });

  const webhookIsValid = await validateWebhook(requestData, secret);

  if (webhookIsValid) {
    console.log("Webhook is valid");
  } else {
    console.log("Webhook is invalid");
  }

  res.end();
}