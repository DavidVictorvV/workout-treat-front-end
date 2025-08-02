import { useState, useEffect } from "react";

import CustomDatePicker from "@/components/CustomDatePicker";
import ProgressChart from "@/components/ProgressChart";

interface WorkoutData {
  date: string;
  Pushups: number;
  Squats: number;
  Pullups: number;
  workout: string;
}

const allData: WorkoutData[] = [
  {
    date: "2025-07-01",
    Pushups: 20,
    Squats: 30,
    Pullups: 10,
    workout: "Indoor",
  },
  {
    date: "2025-07-03",
    Pushups: 30,
    Squats: 20,
    Pullups: 15,
    workout: "Outdoor",
  },
  {
    date: "2025-07-08",
    Pushups: 50,
    Squats: 40,
    Pullups: 20,
    workout: "Indoor",
  },
  {
    date: "2025-07-15",
    Pushups: 40,
    Squats: 35,
    Pullups: 25,
    workout: "Outdoor",
  },
  {
    date: "2025-07-20",
    Pushups: 60,
    Squats: 50,
    Pullups: 30,
    workout: "Indoor",
  },
  {
    date: "2025-08-05",
    Pushups: 55,
    Squats: 60,
    Pullups: 35,
    workout: "Outdoor",
  },
  { date: "2025-08-06", Pushups: 5, Squats: 6, Pullups: 3, workout: "Indoor" },
];

type Mode = "range" | "month";

// Date utility functions
const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

const isWithinInterval = (
  date: Date,
  { start, end }: { start: Date; end: Date }
): boolean => {
  return date >= start && date <= end;
};

const ProgressPage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string>("All");
  const [mode, setMode] = useState<Mode>("range");
  const [startDate, setStartDate] = useState<Date>(new Date("2025-07-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2025-07-20"));
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    new Date("2025-07-01")
  );

  // Validate date range
  useEffect(() => {
    if (mode === "range" && startDate && endDate && startDate >= endDate) {
      const nextDay = new Date(startDate);
      nextDay.setDate(startDate.getDate() + 1);
      setEndDate(nextDay);
    }
  }, [startDate, endDate, mode]);

  const filterData = (): WorkoutData[] => {
    if (mode === "month") {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      return allData.filter((entry) => {
        const d = new Date(entry.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
    } else {
      return allData.filter((entry) => {
        const d = parseDate(entry.date);
        return isWithinInterval(d, { start: startDate, end: endDate });
      });
    }
  };

  const workoutDates = allData.map((item) => item.date);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f1729] via-[#1a2332] to-[#2d3748] text-white">
      {/* Header */}
      <div className="w-full p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Twins <span className="text-orange-400">Workout</span>
            </h1>
          </div>
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <div className="text-orange-400 text-xl">★</div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Progress Tracking:
        </h2>

        {/* Mode Toggle */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setMode("range")}
            className={`rounded-full px-6 ${
              mode === "range"
                ? "bg-orange-400 text-black hover:bg-orange-500"
                : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            }`}
          >
            Custom Range
          </button>
          <button
            onClick={() => setMode("month")}
            className={`rounded-full px-6 ${
              mode === "month"
                ? "bg-orange-400 text-black hover:bg-orange-500"
                : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Date Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {mode === "range" ? (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  From:
                </label>
                <CustomDatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  workoutDates={workoutDates}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">To:</label>
                <CustomDatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  workoutDates={workoutDates}
                  placeholder="Select end date"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Month:</label>
              <CustomDatePicker
                selected={selectedMonth}
                onChange={setSelectedMonth}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholder="Select month"
              />
            </div>
          )}

          <div className={mode === "range" ? "sm:col-span-1" : "sm:col-span-2"}>
            <label className="block text-sm text-gray-300 mb-2">
              Exercise:
            </label>
            <select
              className="w-full bg-[#1b2a41] text-white px-4 py-3 rounded-lg border border-gray-600 hover:border-orange-400 transition-colors"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              <option value="All">All Exercises</option>
              <option value="Pushups">Pushups</option>
              <option value="Squats">Squats</option>
              <option value="Pullups">Pullups</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <ProgressChart
          data={filterData()}
          selectedExercise={selectedExercise}
        />

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["Pushups", "Squats", "Pullups"] as const).map((exercise) => {
            const filteredData = filterData();
            const exerciseData = filteredData.map((d) => d[exercise]);
            const total = exerciseData.reduce((sum, val) => sum + val, 0);
            const avg = exerciseData.length
              ? Math.round(total / exerciseData.length)
              : 0;
            const max = exerciseData.length ? Math.max(...exerciseData) : 0;

            return (
              <div key={exercise} className="bg-[#1b2a41] rounded-lg p-4">
                <h3 className="font-semibold text-orange-400 mb-2">
                  {exercise}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average:</span>
                    <span className="text-white font-medium">{avg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best:</span>
                    <span className="text-white font-medium">{max}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
