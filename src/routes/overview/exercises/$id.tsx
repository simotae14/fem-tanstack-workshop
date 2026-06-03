import { getDb } from "@/data/db";
import {
  exercises as exercisesTable,
  muscleGroup as muscleGroupsTable,
} from "@/drizzle/schema";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { DisplayExercise } from "./-display-exercise";

const loadExercise = createServerFn({
  method: "GET",
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const db = await getDb();
    const [exercise] = await db
      .select()
      .from(exercisesTable)
      .where(eq(exercisesTable.id, data.id));
    return exercise;
  });

const loadMuscleGroups = createServerFn({
  method: "GET",
}).handler(async () => {
  const db = await getDb();
  const muscleGroups = await db.select().from(muscleGroupsTable);
  return muscleGroups;
});

export const Route = createFileRoute("/overview/exercises/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const exercise = loadExercise({ data: { id: Number(params.id) } });
    const muscleGroups = loadMuscleGroups();

    return {
      exercise: await exercise,
      muscleGroups: await muscleGroups,
    };
  },
});

function RouteComponent() {
  const { exercise, muscleGroups } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-4">
      <DisplayExercise exercise={exercise} muscleGroups={muscleGroups} />
      <Link to="/overview/exercises" className="underline">
        Back
      </Link>
    </div>
  );
}
