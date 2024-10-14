import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { ReplicateStream } from 'ai';
import { validateWebhook } from 'replicate';

// Create a Replicate API client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge';

export async function POST(req) {
  const secret = process.env.REPLICATE_WEBHOOK_SIGNING_SECRET;

  // Check if it's a webhook request
  const webhookSignature = req.headers.get('x-replicate-signature');

  if (webhookSignature) {
    console.log("Received webhook...");

    if (!secret) {
      console.log("Skipping webhook validation. To validate webhooks, set REPLICATE_WEBHOOK_SIGNING_SECRET");
      const body = await req.json();
      console.log(body);
      return NextResponse.json({ detail: "Webhook received (but not validated)" }, { status: 200 });
    }
    
    const webhookIsValid = await validateWebhook(req.clone(), secret);

    if (!webhookIsValid) {
      return NextResponse.json({ detail: "Webhook is invalid" }, { status: 401 });
    }

    // process validated webhook here...
    console.log("Webhook is valid!");
    const body = await req.json();
    console.log(body);

    return NextResponse.json({ detail: "Webhook is valid" }, { status: 200 });
  }

  // If it's not a webhook, process as a regular chat request
  const { messages } = await req.json();

  // Get the last user message
  const userMessage = messages[messages.length - 1].content;

  // Ask Replicate for a streaming chat completion using OpenAI's model
  const response = await replicate.predictions.create({
    // You need to use a model on Replicate that supports streaming
    // This is an example using OpenAI's GPT-3.5-turbo
    version: "d5da757d7bc4632efb0f7f84c4f9a6a0c1e2f9f9e4b6c5d4b3a2f1e0d9c8b7a6",
    input: {
      prompt: userMessage,
      max_tokens: 500,
    },
    stream: true,
  });

  // Convert the response into a friendly text-stream
  const stream = ReplicateStream(response);

  // Create a ReadableStream from the ReplicateStream
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  // Return the stream response
  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}