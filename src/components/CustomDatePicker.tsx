import { useState } from "react";

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date) => void;
  dateFormat?: string;
  showMonthYearPicker?: boolean;
  placeholder?: string;
  workoutDates?: string[];
}

const getMonthName = (date: Date): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[date.getMonth()];
};

const getShortMonthName = (date: Date): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[date.getMonth()];
};

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

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  dateFormat = "dd/MM/yyyy",
  showMonthYearPicker = false,
  placeholder,
  workoutDates = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const hasWorkout = (date: Date | null): boolean => {
    if (!date) return false;
    const dateStr =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");
    return workoutDates.includes(dateStr);
  };

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return placeholder || "Select date";
    return formatDate(date, dateFormat);
  };

  const handleDateSelect = (date: Date): void => {
    onChange(date);
    setIsOpen(false);
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1b2a41] text-white px-4 py-3 rounded-xl text-left flex justify-between items-center border border-gray-600/50 hover:border-orange-400 transition-colors shadow-sm"
      >
        <span className="text-gray-200">{formatDisplayDate(selected)}</span>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-[#1b2a41] border border-gray-600/50 rounded-xl shadow-2xl p-5 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3 className="text-white font-semibold text-lg">
              {showMonthYearPicker
                ? currentMonth.getFullYear()
                : `${getMonthName(currentMonth)} ${currentMonth.getFullYear()}`}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {showMonthYearPicker ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 12 }, (_, i) => {
                const monthDate = new Date(currentMonth.getFullYear(), i, 1);
                return (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(monthDate)}
                    className="py-3 px-2 text-sm text-white hover:bg-orange-400 hover:text-black rounded-lg transition-colors font-medium"
                  >
                    {getShortMonthName(monthDate)}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-3">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs text-gray-400 py-2 font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <div key={index} className="relative flex justify-center">
                    {day ? (
                      <button
                        onClick={() => handleDateSelect(day)}
                        className={`w-10 h-10 text-sm rounded-lg transition-colors relative flex items-center justify-center font-medium ${
                          selected &&
                          day.toDateString() === selected.toDateString()
                            ? "bg-orange-400 text-black shadow-md"
                            : "hover:bg-gray-700/50 text-white"
                        }`}
                      >
                        {day.getDate()}
                        {hasWorkout(day) && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        )}
                      </button>
                    ) : (
                      <div className="w-10 h-10"></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
