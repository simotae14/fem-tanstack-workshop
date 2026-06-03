import { useMemo } from "react";
import { asc, desc } from "drizzle-orm";

import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import {
  workout as workoutTable,
  exercises as exercisesTable,
} from "@/drizzle/schema";
import { getDb } from "@/data/db";

// TODO: 1. add server function and call in loader
// TODO: 2. Call with ssr
// TODO: 3. Call with csr and note call in dev tools

const loadWorkouts = createServerFn({
  method: "GET",
})
  .handler(async () => {
    const db = await getDb();
    const workouts = await db
      .select()
      .from(workoutTable)
      .orderBy(desc(workoutTable.workoutDate))
      .limit(3);
    return workouts.map(workout => {
      return {
        ...workout,
        exercises: [1, 2, 3],
      };
    });
  });

const loadExercises = createServerFn({
  method: "GET",
})
  .handler(async () => {
    const db = await getDb();
    const exercises = await db
      .select()
      .from(exercisesTable)
      .orderBy(asc(exercisesTable.name));
    return exercises;
  });

export const Route = createFileRoute("/lessons/3/workouts/")({
  // TODO: 4. Add a pending component and note when it works
  component: RouteComponent,
  loader: async () => {
    const [workouts, exercises] = await Promise.all([
      loadWorkouts(),
      loadExercises(),
    ]);

    return {
      workouts,
      exercises,
    };
  },
  gcTime: 0,
  staleTime: 0,
});

function RouteComponent() {
  const { workouts, exercises } = Route.useLoaderData();
  const exerciseLookup = useMemo(() => {
    return new Map(exercises.map(exercise => [exercise.id, exercise]));
  }, [exercises]);

  return (
    <div className="flex flex-col gap-4">
      <h1>Workouts</h1>
      {workouts.map(workout => (
        <div key={workout.id}>
          <span className="flex gap-2">
            <span>{workout.name}</span>
            <span>Exercises:</span>
            <span>
              (
              {workout.exercises
                .map(exercise => exerciseLookup.get(exercise)!.name)
                .join(", ")}
              )
            </span>
            <Link
              to={`/lessons/3/workouts/$id`}
              params={{ id: String(workout.id) }}
              className="ml-auto"
              preload={false}
            >
              View
            </Link>
          </span>
        </div>
      ))}
    </div>
  );
}
