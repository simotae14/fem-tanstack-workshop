import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";

import { getInClassWorkoutById } from "@/server-functions/in-class/workouts-simple";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { getExercisesServerFn } from "@/server-functions/exercises";

export const Route = createFileRoute("/rsc-demo/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const workout = getInClassWorkoutById({
      data: { id: Number(params.id) },
    });

    const exercises = getExercisesServerFn({
      data: { operation: "load-exercises" },
    });

    return {
      workout: (await workout)!,
      exercises: await exercises,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 0,
  gcTime: 1000 * 60 * 5,
  staleTime: 1000 * 60 * 5,
});

function RouteComponent() {
  const { workout, exercises } = Route.useLoaderData();
  const { isFetching } = Route.useMatch();

  const routeApi = getRouteApi("/rsc-demo");

  const exerciseLookup = useMemo(() => {
    return new Map(exercises.map(exercise => [exercise.id, exercise]));
  }, [exercises]);

  return (
    <div className="flex flex-col gap-4">
      <span
        className={cn(
          "text-sm text-pink-500 -my-2 ml-auto",
          !isFetching && "invisible",
        )}
      >
        Reloading...
      </span>
      <div className="flex">
        <h1 className="text-lg">{workout.name}</h1>
        <Link to="/rsc-demo" className="ml-auto" preload={false}>
          Back
        </Link>
      </div>
      <span>Id: {workout.id}</span>
      <span>Date: {workout.date}</span>
      <span>
        exercises:{" "}
        {workout.exercises
          .map(exercise => exerciseLookup.get(exercise)!.name)
          .join(", ")}
      </span>
    </div>
  );
}
