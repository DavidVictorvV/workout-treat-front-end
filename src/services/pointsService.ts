const POINTS_COOKIE_KEY = 'fitpoints_user_points';
const COMPLETED_WORKOUTS_KEY = 'fitpoints_completed_workouts';
const PURCHASED_ITEMS_KEY = 'fitpoints_purchased_items';

export interface PointsData {
  totalPoints: number;
  completedWorkouts: string[];
  purchasedItems: string[];
}

export const getPointsData = (): PointsData => {
  try {
    const points = getCookie(POINTS_COOKIE_KEY);
    const workouts = getCookie(COMPLETED_WORKOUTS_KEY);
    const items = getCookie(PURCHASED_ITEMS_KEY);

    return {
      totalPoints: points ? parseInt(points, 10) : 300, // Start with 300 points
      completedWorkouts: workouts ? JSON.parse(workouts) : [],
      purchasedItems: items ? JSON.parse(items) : []
    };
  } catch (error) {
    console.error('Error parsing points data from cookies:', error);
    return {
      totalPoints: 300,
      completedWorkouts: [],
      purchasedItems: []
    };
  }
};

export const savePointsData = (data: PointsData): void => {
  try {
    setCookie(POINTS_COOKIE_KEY, data.totalPoints.toString(), 365);
    setCookie(COMPLETED_WORKOUTS_KEY, JSON.stringify(data.completedWorkouts), 365);
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

export const completeWorkout = (workoutId: string, points: number): number => {
  const data = getPointsData();
  if (!data.completedWorkouts.includes(workoutId)) {
    data.completedWorkouts.push(workoutId);
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
  return data.completedWorkouts.includes(workoutId);
};

export const isItemPurchased = (itemId: string): boolean => {
  const data = getPointsData();
  return data.purchasedItems.includes(itemId);
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