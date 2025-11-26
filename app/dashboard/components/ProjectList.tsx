'use client'

import { useEffect, useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { useFiltersStore } from '@/stores/filters'

type Project = any

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { statusFilter, projectTypeFilter, searchQuery } = useFiltersStore()

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false
    if (projectTypeFilter !== 'all' && project.projectType !== projectTypeFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const tags = typeof project.tags === 'string' 
        ? (project.tags ? JSON.parse(project.tags) : [])
        : []
      const searchableText = [
        project.name,
        project.summary,
        ...tags,
      ].join(' ').toLowerCase()
      if (!searchableText.includes(query)) return false
    }
    return true
  })

  if (loading) {
    return <div className="text-center py-12">Loading projects...</div>
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects found. Start by adding your first project!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project: Project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

