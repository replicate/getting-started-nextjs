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

export async function GET(req) {
  return NextResponse.json({ message: "Chat API is working. Use POST to send messages." });
}

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

  // Ask Replicate for a streaming chat completion using meta/meta-llama-3-8b-instruct model
  const response = await replicate.predictions.create({
    version: "8ca98e4faeb9f3e32b7c234a9bbf8a5a0e7f0f18e3fd8b8193916e4c8731efc7",
    input: {
      prompt: userMessage,
      max_new_tokens: 500,
      temperature: 0.75,
      top_p: 0.9,
      repetition_penalty: 1,
      seed: 42,
      system_prompt: "You are a helpful AI assistant.",
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