import { Badge } from "@/components/ui/badge"

interface ProjectStatusBadgeProps {
  status: string
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const statusColors: Record<string, string> = {
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    red: "bg-red-500 hover:bg-red-600",
  }

  const normalizedStatus = (status || 'green').toLowerCase() as 'green' | 'yellow' | 'red'
  const colorClass = statusColors[normalizedStatus] || statusColors.green

  return (
    <Badge className={`${colorClass} text-white border-0`}>
      {normalizedStatus.toUpperCase()}
    </Badge>
  )
}

