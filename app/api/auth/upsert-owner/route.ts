import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { firebaseId, email, firstName, lastName } = body

    if (!firebaseId || !email) {
      return NextResponse.json(
        { error: 'firebaseId and email are required' },
        { status: 400 }
      )
    }

    // Get or create Trunorth master container
    let trueNorth = await prisma.trueNorth.findFirst()
    if (!trueNorth) {
      trueNorth = await prisma.trueNorth.create({
        data: {
          name: 'Trunorth',
          description: 'Master container for Trunorth Stack Overview',
        },
      })
    }

    // Upsert Owner
    const owner = await prisma.owner.upsert({
      where: { firebaseId },
      update: {
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        updatedAt: new Date(),
      },
      create: {
        firebaseId,
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        trueNorthId: trueNorth.id,
      },
    })

    return NextResponse.json(owner)
  } catch (error) {
    console.error('Error upserting owner:', error)
    return NextResponse.json(
      { error: 'Failed to upsert owner' },
      { status: 500 }
    )
  }
}

