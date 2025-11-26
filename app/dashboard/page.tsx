export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

import DashboardClient from './DashboardClient'

export default function DashboardPage() {
  return <DashboardClient />
}
