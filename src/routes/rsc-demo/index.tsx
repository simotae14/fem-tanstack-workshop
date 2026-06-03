import { useMemo, useRef, useState, type FC } from "react";
import {
  createFileRoute,
  getRouteApi,
  Link,
  useRouter,
} from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  editExercise,
  getExercisesServerFn,
} from "@/server-functions/exercises";
import { mutateWorkoutName } from "@/server-functions/in-class/mutate-workout-name";
import {
  getInClassWorkoutHistoryServerFn,
  type InClassWorkout,
} from "@/server-functions/in-class/workouts-simple";

type InClassExercise = {
  id: number;
  name: string;
};

export const Route = createFileRoute("/rsc-demo/")({
  component: RouteComponent,
  loader: async () => {
    const workoutsPayload = getInClassWorkoutHistoryServerFn({
      data: { operation: "load-workouts" },
    });

    const exercises = getExercisesServerFn({
      data: { operation: "load-exercises" },
    });

    return {
      workouts: (await workoutsPayload).workouts,
      exercises: await exercises,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 0,
  gcTime: 1000 * 60 * 5,
  staleTime: 1000 * 60 * 5,
});

function RouteComponent() {
  const { workouts, exercises } = Route.useLoaderData();
  const { isFetching } = Route.useMatch();

  const layoutRoute = getRouteApi("/rsc-demo/");
  const { isFetching: isLayoutFetching } = layoutRoute.useMatch();

  const exerciseLookup = useMemo(() => {
    return new Map(exercises.map(exercise => [exercise.id, exercise]));
  }, [exercises]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1>Workouts</h1>
        {isFetching ? (
          <span className="text-sm text-pink-500">Reloading...</span>
        ) : null}
        {isLayoutFetching ? (
          <span className="text-sm text-purple-500">Layout Reloading...</span>
        ) : null}
      </div>
      {workouts.map(workout => (
        <RenderWorkout
          key={workout.id}
          workout={workout}
          exerciseLookup={exerciseLookup}
        />
      ))}
      <hr className="my-4" />
      <ExerciseList workouts={workouts} exercises={exercises} />
    </div>
  );
}

const RenderWorkout: FC<{
  workout: InClassWorkout;
  exerciseLookup: Map<number, { name: string }>;
}> = props => {
  const { workout, exerciseLookup } = props;
  const workoutNameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="flex gap-2">
          <span>{workout.name}</span>
          <Link
            to={`/rsc-demo/$id`}
            params={{ id: String(workout.id) }}
            className="ml-auto"
            preload={false}
          >
            View
          </Link>
        </span>
        <div>
          <span>Exercises:</span>
          <span>
            (
            {workout.exercises
              .map(exercise => exerciseLookup.get(exercise)!.name)
              .join(", ")}
            )
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Input ref={workoutNameInputRef} defaultValue={workout.name} />
        <Button
          type="button"
          onClick={async () => {
            const newName = workoutNameInputRef.current?.value ?? "";
            await mutateWorkoutName({
              data: {
                id: workout.id,
                newName,
              },
            });
            await router.invalidate();
          }}
        >
          Update name
        </Button>
      </div>
    </div>
  );
};

const ExerciseList: FC<{
  workouts: InClassWorkout[];
  exercises: InClassExercise[];
}> = props => {
  const { workouts, exercises } = props;

  const exercisesToRender = useMemo(() => {
    const exerciseIds = new Set(workouts.flatMap(workout => workout.exercises));

    return exercises.filter(exercise => exerciseIds.has(exercise.id));
  }, [workouts, exercises]);

  return (
    <div className="flex flex-col gap-2">
      {exercisesToRender.map(exercise => (
        <Exercise key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
};

const Exercise: FC<{
  exercise: InClassExercise;
}> = props => {
  const { exercise } = props;
  const [saving, setSaving] = useState(false);
  const exerciseNameInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Input ref={exerciseNameInputRef} defaultValue={exercise.name} />
      <Button
        type="button"
        disabled={saving}
        onClick={async () => {
          const name = exerciseNameInputRef.current?.value ?? "";

          setSaving(true);
          await editExercise({
            data: {
              id: exercise.id,
              name,
            },
          });
          setSaving(false);

          await router.invalidate();
        }}
      >
        Update exercise
      </Button>
    </div>
  );
};
