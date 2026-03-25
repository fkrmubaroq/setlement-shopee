import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/data-shopee/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/data-shopee/$id"!</div>
}
