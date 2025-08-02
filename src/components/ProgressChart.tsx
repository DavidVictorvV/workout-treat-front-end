import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const formatDate = (
  date: Date | null,
  format: string = "dd/MM/yyyy"
): string => {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  if (format === "MM/yyyy") {
    return `${month}/${year}`;
  }
  if (format === "dd/MM") {
    return `${day}/${month}`;
  }
  return `${day}/${month}/${year}`;
};

interface ProgressChartProps {
  data: WorkoutData[];
  selectedExercise: string;
}

interface WorkoutData {
  date: string;
  Pushups: number;
  Squats: number;
  Pullups: number;
  workout: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  selectedExercise,
}) => {
  if (data.length === 0) {
    return (
      <div className="bg-[#1b2a41] rounded-lg p-8 text-center">
        <p className="text-gray-400">
          No data available for the selected period
        </p>
      </div>
    );
  }

  // Date utility functions
  const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
  };

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(parseDate(item.date), "dd/MM"),
  }));

  return (
    <div className="bg-[#1b2a41] rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-white">
        {selectedExercise === "All" ? "All Exercises" : selectedExercise}{" "}
        Progress
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1b2a41",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#F3F4F6" }}
          />
          <Legend />
          {(selectedExercise === "All" || selectedExercise === "Pushups") && (
            <Line
              type="monotone"
              dataKey="Pushups"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
            />
          )}
          {(selectedExercise === "All" || selectedExercise === "Squats") && (
            <Line
              type="monotone"
              dataKey="Squats"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
            />
          )}
          {(selectedExercise === "All" || selectedExercise === "Pullups") && (
            <Line
              type="monotone"
              dataKey="Pullups"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
