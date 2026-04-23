import { getTopups } from '@/lib/actions/topup'
import AdminTopupsClient from '@/components/admin/AdminTopupsClient'

export default async function AdminTopupsPage() {
  const topups = await getTopups()
  return <AdminTopupsClient topups={topups} />
}
