import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        details: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      owner,
      priority,
      tags,
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (summary !== undefined) updateData.summary = summary
    if (projectType !== undefined) updateData.projectType = projectType
    if (status !== undefined) updateData.status = status
    if (frontendRepoUrl !== undefined) updateData.frontendRepoUrl = frontendRepoUrl
    if (backendRepoUrl !== undefined) updateData.backendRepoUrl = backendRepoUrl
    if (deploymentUrl !== undefined) updateData.deploymentUrl = deploymentUrl
    if (dbAttached !== undefined) updateData.dbAttached = dbAttached
    if (dbType !== undefined) updateData.dbType = dbType
    if (owner !== undefined) updateData.owner = owner
    if (priority !== undefined) updateData.priority = priority
    if (tags !== undefined) updateData.tags = JSON.stringify(tags)

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
      include: {
        details: true,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Project deleted' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

