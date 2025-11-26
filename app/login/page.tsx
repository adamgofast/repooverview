export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

import LoginClient from './LoginClient'

export default function LoginPage() {
  return <LoginClient />
}
