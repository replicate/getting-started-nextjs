import { NextResponse } from 'next/server'
import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
  try {
    const result = await sql`SELECT * FROM users`
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${password})
      RETURNING id, name, email
    `
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}