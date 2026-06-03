import type { MuscleGroup } from "@/data/types";
import { exercises } from "@/drizzle/schema";
import { useMemo, type FC } from "react";

export type ExerciseRow = typeof exercises.$inferSelect;

const executionLabels: Record<ExerciseRow["executionType"], string> = {
  repetition: "Repetition",
  distance: "Distance",
  time: "Time",
};

type DisplayExerciseProps = {
  exercise: ExerciseRow | undefined | null;
  muscleGroups?: MuscleGroup[];
};

export const DisplayExercise: FC<DisplayExerciseProps> = ({
  exercise,
  muscleGroups = [],
}) => {
  const muscleGroupLookup = useMemo(
    () => new Map(muscleGroups.map(g => [g.id, g.name])),
    [muscleGroups],
  );

  if (exercise == null) {
    return <p className="text-sm text-muted-foreground">Exercise not found.</p>;
  }

  const muscleLabels = exercise.muscleGroups
    .map(id => muscleGroupLookup.get(id) ?? `#${id}`)
    .join(" • ");

  return (
    <article className="rounded-xl border p-6 shadow-sm border-slate-700/80 bg-slate-800/55">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground dark:text-slate-50">
          {exercise.name}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground dark:bg-slate-700/70 dark:text-slate-200">
            {executionLabels[exercise.executionType]}
          </span>
          {exercise.isBodyweight === true ? (
            <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-800 dark:bg-sky-400/15 dark:text-sky-200">
              Bodyweight
            </span>
          ) : null}
          <span
            className={
              exercise.isCompound === true
                ? "rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200"
                : "rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground dark:bg-slate-700/70 dark:text-slate-100/90"
            }
          >
            {exercise.isCompound === true ? "Compound" : "Isolation"}
          </span>
        </div>
      </div>

      {exercise.description ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground dark:text-slate-300/90">
          {exercise.description}
        </p>
      ) : (
        <p className="mt-4 text-sm italic text-muted-foreground dark:text-slate-400">
          No description.
        </p>
      )}

      {exercise.muscleGroups.length > 0 ? (
        <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground dark:text-sky-200/80">
          {muscleLabels}
        </p>
      ) : null}
    </article>
  );
};
