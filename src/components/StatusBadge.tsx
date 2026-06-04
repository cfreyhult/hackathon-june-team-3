import type { ItemStatus } from '../types'

const config: Record<ItemStatus, { label: string; className: string }> = {
  complete: { label: 'Fullfort', className: 'bg-green-100 text-green-800' },
  open: { label: 'Åpen', className: 'bg-blue-100 text-blue-800' },
  blocked: { label: 'Blokkert', className: 'bg-red-100 text-red-800' },
  overdue: { label: 'Forfalt', className: 'bg-orange-100 text-orange-800' },
}

export default function StatusBadge({ status }: { status: ItemStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
