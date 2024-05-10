import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// In production and preview deployments (on Vercel), the VERCEL_URL environment variable is set.
// In development (on your local machine), the NGROK_HOST environment variable is set.
const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const prediction = await replicate.predictions.create({
    // Pinned to a specific version of Stable Diffusion
    // See https://replicate.com/stability-ai/sdxl
    version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",

    // This is the text prompt that will be submitted by a form on the frontend
    input: { prompt: req.body.prompt },

    // The webhook is the endpoint that will receive the webhook events from Replicate
    webhook: `${WEBHOOK_HOST}/api/replicate-webhook`,

    // The webhook_events_filter is an array of events that the webhook will receive
    // See https://replicate.com/docs/reference/http#predictions.create--webhook_events_filter
    webhook_events_filter: ["start", "completed"],
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
