'use client'

import { useEffect, useState } from 'react'
import { Project, ProjectDetail } from '@prisma/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProjectStatusBadge } from '@/app/dashboard/components/ProjectStatusBadge'
// TODO: implement later
// import { NotesEditor } from './NotesEditor'
// import { BuildHistory } from './BuildHistory'
// import { ClientOwes } from './ClientOwes'
// import { NextActions } from './NextActions'

interface DetailTabsProps {
  projectId: string
}

export function DetailTabs({ projectId }: DetailTabsProps) {
  const [project, setProject] = useState<(Project & { details?: ProjectDetail | null }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data)
        }
      } catch (error) {
        console.error('Failed to fetch project:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [projectId])

  if (loading) {
    return <div>Loading project...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  const tags = typeof project.tags === 'string' 
    ? (project.tags ? JSON.parse(project.tags) : [])
    : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <div className="flex gap-2 items-center">
          <ProjectStatusBadge status={project.status} />
          <Badge variant="outline">{project.projectType}</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="bugs">Open Bugs</TabsTrigger>
          <TabsTrigger value="milestones">Next Milestones</TabsTrigger>
          <TabsTrigger value="client">Client Owes / I Owe</TabsTrigger>
          <TabsTrigger value="builds">Build History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.summary && (
                <div>
                  <h3 className="font-semibold mb-1">Summary</h3>
                  <p className="text-gray-600">{project.summary}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Repository URLs</h3>
                <div className="space-y-1">
                  {project.frontendRepoUrl && (
                    <div>
                      <span className="text-sm text-gray-600">Frontend: </span>
                      <a href={project.frontendRepoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {project.frontendRepoUrl}
                      </a>
                    </div>
                  )}
                  {project.backendRepoUrl && (
                    <div>
                      <span className="text-sm text-gray-600">Backend: </span>
                      <a href={project.backendRepoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {project.backendRepoUrl}
                      </a>
                    </div>
                  )}
                  {project.deploymentUrl && (
                    <div>
                      <span className="text-sm text-gray-600">Deployment: </span>
                      <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {project.deploymentUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {project.dbAttached && (
                <div>
                  <h3 className="font-semibold mb-1">Database</h3>
                  <p className="text-gray-600">Type: {project.dbType || 'Not specified'}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-1">Priority</h3>
                <Badge>{project.priority}</Badge>
              </div>
              {tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {project.owner && (
                <div>
                  <h3 className="font-semibold mb-1">Owner</h3>
                  <p className="text-gray-600">{project.owner}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          {/* TODO: implement later */}
          <div>Hello World</div>
        </TabsContent>

        <TabsContent value="bugs" className="mt-6">
          {/* TODO: implement later */}
          <div>Hello World</div>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          {/* TODO: implement later */}
          <div>Hello World</div>
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          {/* TODO: implement later */}
          <div>Hello World</div>
        </TabsContent>

        <TabsContent value="builds" className="mt-6">
          {/* TODO: implement later */}
          <div>Hello World</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

