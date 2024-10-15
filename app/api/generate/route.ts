import { NextResponse } from 'next/server'
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
 
    const output = await replicate.run(
      "meta/meta-llama-3-70b-instruct",
      {
        input: {
          prompt: prompt
        }
      }
    )

    return NextResponse.json({ result: output })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 })
  }
}