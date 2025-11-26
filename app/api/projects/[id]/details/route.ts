import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    const body = await request.json()
    const {
      notes,
      openBugs,
      nextMilestones,
      clientOwesMe,
      iOweClient,
      buildHistory,
    } = body

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if details exist
    const existingDetails = await prisma.projectDetail.findUnique({
      where: { projectId: params.id },
    })

    const updateData: any = {}
    if (notes !== undefined) updateData.notes = notes
    if (openBugs !== undefined) updateData.openBugs = JSON.stringify(openBugs)
    if (nextMilestones !== undefined) updateData.nextMilestones = JSON.stringify(nextMilestones)
    if (clientOwesMe !== undefined) updateData.clientOwesMe = clientOwesMe
    if (iOweClient !== undefined) updateData.iOweClient = iOweClient
    if (buildHistory !== undefined) updateData.buildHistory = JSON.stringify(buildHistory)

    let details
    if (existingDetails) {
      details = await prisma.projectDetail.update({
        where: { projectId: params.id },
        data: updateData,
      })
    } else {
      details = await prisma.projectDetail.create({
        data: {
          projectId: params.id,
          ...updateData,
        },
      })
    }

    return NextResponse.json(details)
  } catch (error) {
    console.error('Error updating project details:', error)
    return NextResponse.json(
      { error: 'Failed to update project details' },
      { status: 500 }
    )
  }
}

