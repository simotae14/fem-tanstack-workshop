import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/lessons/1/workouts')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-green-500 m-20 p-20">
      <Outlet />
    </div>
  );
}
