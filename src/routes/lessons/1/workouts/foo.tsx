import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lessons/1/workouts/foo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lessons/1/workouts/foo"!</div>
}
