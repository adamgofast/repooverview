import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Get owner from auth header or session
    const authHeader = request.headers.get('authorization')
    // For now, get all projects - we'll filter by owner later
    const projects = await prisma.project.findMany({
      include: {
        details: true,
        owner: true,
      },
      orderBy: {
        lastUpdatedAt: 'desc',
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    const body = await request.json()
    const {
      name,
      summary,
      projectType,
      status,
      frontendRepoUrl,
      backendRepoUrl,
      deploymentUrl,
      dbAttached,
      dbType,
      priority,
      tags,
      ownerId,
    } = body

    const project = await prisma.project.create({
      data: {
        name,
        summary,
        projectType,
        status,
        frontendRepoUrl,
        backendRepoUrl,
        deploymentUrl,
        dbAttached: dbAttached || false,
        dbType,
        ownerId,
        priority: priority || 3,
        tags: tags ? JSON.stringify(tags) : JSON.stringify([]),
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

