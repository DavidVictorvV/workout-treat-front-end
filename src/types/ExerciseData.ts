export type ExerciseData = {
  date: string; // ISO format: YYYY-MM-DD
  exercises: {
    [exerciseName: string]: number;
  };
};
