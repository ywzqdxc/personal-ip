import { readdirSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const dir = join(process.cwd(), 'public', 'images', 'reward')
    const files = readdirSync(dir)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort()
      .map(f => `/images/reward/${f}`)

    return NextResponse.json({ images: files })
  } catch {
    return NextResponse.json({ images: [] })
  }
}
