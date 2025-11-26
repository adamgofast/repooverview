// TODO: implement later - disabled for SSG
// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 503 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 503 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 503 })
}

