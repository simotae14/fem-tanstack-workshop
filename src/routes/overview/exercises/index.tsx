import { getDb } from "@/data/db";
import { exercises as exercisesTable } from "@/drizzle/schema";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc } from "drizzle-orm";

const loadExercises = createServerFn({
  method: "GET",
}).handler(async () => {
  const db = await getDb();
  const exercises = await db
    .select()
    .from(exercisesTable)
    .orderBy(asc(exercisesTable.name));
  return exercises;
});

export const Route = createFileRoute("/overview/exercises/")({
  component: RouteComponent,
  loader: async () => {
    const exercises = await loadExercises();
    return {
      exercises,
    };
  },
});

function RouteComponent() {
  const { exercises } = Route.useLoaderData();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3">
      {exercises.map(exercise => (
        <div
          key={exercise.id}
          className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-ring dark:border-slate-700/80 dark:bg-slate-800/55 dark:hover:border-slate-600"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground dark:text-slate-50">
                {exercise.name}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground dark:text-slate-300/80">
                {exercise.description}
              </p>
            </div>
            <Link
              to="/overview/exercises/$id"
              params={{ id: String(exercise.id) }}
              className="shrink-0 text-sm font-medium text-sky-600 underline-offset-4 transition hover:text-sky-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:ring-offset-slate-900"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
