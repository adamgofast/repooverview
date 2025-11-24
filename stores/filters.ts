import { create } from 'zustand'

type StatusFilter = 'all' | 'green' | 'yellow' | 'red'
type ProjectTypeFilter = 'all' | 'fullstack' | 'frontend' | 'backend' | 'script' | 'utility' | 'experiment'

interface FiltersState {
  statusFilter: StatusFilter
  projectTypeFilter: ProjectTypeFilter
  searchQuery: string
  setStatusFilter: (filter: StatusFilter) => void
  setProjectTypeFilter: (filter: ProjectTypeFilter) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  statusFilter: 'all',
  projectTypeFilter: 'all',
  searchQuery: '',
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setProjectTypeFilter: (filter) => set({ projectTypeFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({ statusFilter: 'all', projectTypeFilter: 'all', searchQuery: '' }),
}))

