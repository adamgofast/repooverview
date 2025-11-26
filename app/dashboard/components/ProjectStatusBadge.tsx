import { Badge } from "@/components/ui/badge"

interface ProjectStatusBadgeProps {
  status: 'green' | 'yellow' | 'red'
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const statusColors = {
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    red: "bg-red-500 hover:bg-red-600",
  }

  return (
    <Badge className={`${statusColors[status]} text-white border-0`}>
      {status.toUpperCase()}
    </Badge>
  )
}

