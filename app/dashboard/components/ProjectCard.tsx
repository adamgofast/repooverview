'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { Badge } from '@/components/ui/badge'
import { Project } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  
  const tags: string[] = typeof project.tags === 'string' 
    ? (project.tags ? JSON.parse(project.tags) : [])
    : (project.tags || [])

  const priorityColors = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-blue-100 text-blue-800',
    4: 'bg-green-100 text-green-800',
    5: 'bg-gray-100 text-gray-800',
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <CardDescription className="mt-1">
              {project.summary || 'No summary available'}
            </CardDescription>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">{project.projectType}</Badge>
          <Badge className={priorityColors[project.priority as keyof typeof priorityColors] || priorityColors[3]}>
            Priority {project.priority}
          </Badge>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        <p className="text-sm text-gray-500">
          Updated {formatDistanceToNow(new Date(project.lastUpdatedAt), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  )
}

