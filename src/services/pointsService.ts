const POINTS_COOKIE_KEY = 'fitpoints_user_points';
const COMPLETED_WORKOUTS_KEY = 'fitpoints_completed_workouts';
const WORKOUT_HISTORY_KEY = 'fitpoints_workout_history';
const PURCHASED_ITEMS_KEY = 'fitpoints_purchased_items';

export interface WorkoutEntry {
  workoutId: string;
  workoutName: string;
  workoutIcon: string;
  category: 'outdoor' | 'indoor';
  points: number;
  completedAt: string; // ISO date string
}

export interface PointsData {
  totalPoints: number;
  completedWorkouts: string[];
  workoutHistory: WorkoutEntry[];
  purchasedItems: string[];
}

export const getPointsData = (): PointsData => {
  try {
    const points = getCookie(POINTS_COOKIE_KEY);
    const workouts = getCookie(COMPLETED_WORKOUTS_KEY);
    const history = getCookie(WORKOUT_HISTORY_KEY);
    const items = getCookie(PURCHASED_ITEMS_KEY);

    return {
      totalPoints: points ? parseInt(points, 10) : 300, // Start with 300 points
      completedWorkouts: workouts ? JSON.parse(workouts) : [],
      workoutHistory: history ? JSON.parse(history) : [],
      purchasedItems: items ? JSON.parse(items) : []
    };
  } catch (error) {
    console.error('Error parsing points data from cookies:', error);
    return {
      totalPoints: 300,
      completedWorkouts: [],
      workoutHistory: [],
      purchasedItems: []
    };
  }
};

export const savePointsData = (data: PointsData): void => {
  try {
    setCookie(POINTS_COOKIE_KEY, data.totalPoints.toString(), 365);
    setCookie(COMPLETED_WORKOUTS_KEY, JSON.stringify(data.completedWorkouts), 365);
    setCookie(WORKOUT_HISTORY_KEY, JSON.stringify(data.workoutHistory), 365);
    setCookie(PURCHASED_ITEMS_KEY, JSON.stringify(data.purchasedItems), 365);
  } catch (error) {
    console.error('Error saving points data to cookies:', error);
  }
};

export const addPoints = (points: number): number => {
  const data = getPointsData();
  data.totalPoints += points;
  savePointsData(data);
  return data.totalPoints;
};

export const deductPoints = (points: number): boolean => {
  const data = getPointsData();
  if (data.totalPoints >= points) {
    data.totalPoints -= points;
    savePointsData(data);
    return true;
  }
  return false;
};

export const completeWorkout = (workoutId: string, workoutName: string, workoutIcon: string, category: 'outdoor' | 'indoor', points: number): number => {
  const data = getPointsData();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const workoutKey = `${workoutId}-${today}`;
  
  // Check if this specific workout was already completed today
  const alreadyCompletedToday = data.workoutHistory.some(
    entry => entry.workoutId === workoutId && entry.completedAt.startsWith(today)
  );
  
  if (!alreadyCompletedToday) {
    // Add to completed workouts list (for backward compatibility)
    if (!data.completedWorkouts.includes(workoutKey)) {
      data.completedWorkouts.push(workoutKey);
    }
    
    // Add to detailed workout history
    data.workoutHistory.push({
      workoutId,
      workoutName,
      workoutIcon,
      category,
      points,
      completedAt: new Date().toISOString()
    });
    
    data.totalPoints += points;
    savePointsData(data);
  }
  return data.totalPoints;
};

export const purchaseItem = (itemId: string, cost: number): boolean => {
  const data = getPointsData();
  if (data.totalPoints >= cost && !data.purchasedItems.includes(itemId)) {
    data.totalPoints -= cost;
    data.purchasedItems.push(itemId);
    savePointsData(data);
    return true;
  }
  return false;
};

export const isWorkoutCompleted = (workoutId: string): boolean => {
  const data = getPointsData();
  const today = new Date().toISOString().split('T')[0];
  return data.workoutHistory.some(
    entry => entry.workoutId === workoutId && entry.completedAt.startsWith(today)
  );
};

export const isItemPurchased = (itemId: string): boolean => {
  const data = getPointsData();
  return data.purchasedItems.includes(itemId);
};

export const getWorkoutHistory = (): WorkoutEntry[] => {
  const data = getPointsData();
  return data.workoutHistory;
};

export const getWorkoutsByDateRange = (startDate: string, endDate: string): WorkoutEntry[] => {
  const data = getPointsData();
  return data.workoutHistory.filter(entry => {
    const entryDate = entry.completedAt.split('T')[0];
    return entryDate >= startDate && entryDate <= endDate;
  });
};

export const getWorkoutsByMonth = (year: number, month: number): WorkoutEntry[] => {
  const data = getPointsData();
  const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
  return data.workoutHistory.filter(entry => 
    entry.completedAt.startsWith(monthStr)
  );
};

export const getWorkoutTypeStats = (entries: WorkoutEntry[]): Record<string, number> => {
  const stats: Record<string, number> = {};
  entries.forEach(entry => {
    stats[entry.workoutName] = (stats[entry.workoutName] || 0) + 1;
  });
  return stats;
};

export const getWorkoutsByDate = (entries: WorkoutEntry[]): Record<string, WorkoutEntry[]> => {
  const byDate: Record<string, WorkoutEntry[]> = {};
  entries.forEach(entry => {
    const date = entry.completedAt.split('T')[0];
    if (!byDate[date]) {
      byDate[date] = [];
    }
    byDate[date].push(entry);
  });
  return byDate;
};

// Cookie utility functions
const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};