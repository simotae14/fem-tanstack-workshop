import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/overview/exercises")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <Outlet />
    </div>
  );
}
