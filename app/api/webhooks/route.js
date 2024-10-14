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
  const input = {
    top_k: 0,
    top_p: 0.9,
    prompt: userMessage,
    max_tokens: 512,
    min_tokens: 0,
    temperature: 0.6,
    system_prompt: "You are a helpful assistant",
    length_penalty: 1,
    stop_sequences: "<|end_of_text|>,<|eot_id|>",
    prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    presence_penalty: 1.15,
    log_performance_metrics: false
  };
  
  for await (const event of replicate.stream("meta/meta-llama-3-70b-instruct", { input })) {
    process.stdout.write(event.toString());
  };
  // Ask Replicate for a streaming chat completion using meta/meta-llama-3-8b-instruct model
  const response = await replicate.predictions.create({
    version: "b63acc3f54e3c08cb3b081f049ebc881420035dfc6db48f554530e9c4bc02ba3",
    input: {
      prompt: userMessage,
      system_prompt: "You are a helpful AI assistant",
      max_new_tokens: 512,
      temperature: 0.7,
      top_p: 0.95,
      presence_penalty: 0,
      frequency_penalty: 0,
      prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
      stop_sequences: ["<|end_of_text|>", "<|eot_id|>"],
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