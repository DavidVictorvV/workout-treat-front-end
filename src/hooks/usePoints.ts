import { useState, useEffect } from 'react';
import { 
  getPointsData, 
  completeWorkout, 
  purchaseItem, 
  isWorkoutCompleted, 
  isItemPurchased,
  getWorkoutHistory,
  getWorkoutsByDateRange,
  getWorkoutsByMonth,
  getWorkoutTypeStats,
  getWorkoutsByDate,
  type PointsData
} from '@/services/pointsService';

export const usePoints = () => {
  const [pointsData, setPointsData] = useState<PointsData>(() => getPointsData());

  const refreshPoints = () => {
    setPointsData(getPointsData());
  };

  const handleCompleteWorkout = (workoutId: string, workoutName: string, workoutIcon: string, category: 'outdoor' | 'indoor', points: number): boolean => {
    if (!isWorkoutCompleted(workoutId)) {
      completeWorkout(workoutId, workoutName, workoutIcon, category, points);
      refreshPoints();
      return true;
    }
    return false;
  };

  const handlePurchaseItem = (itemId: string, cost: number): boolean => {
    if (purchaseItem(itemId, cost)) {
      refreshPoints();
      return true;
    }
    return false;
  };

  const checkWorkoutCompleted = (workoutId: string): boolean => {
    return isWorkoutCompleted(workoutId);
  };

  const checkItemPurchased = (itemId: string): boolean => {
    return isItemPurchased(itemId);
  };

  useEffect(() => {
    refreshPoints();
  }, []);

  return {
    totalPoints: pointsData.totalPoints,
    completedWorkouts: pointsData.completedWorkouts,
    workoutHistory: pointsData.workoutHistory,
    purchasedItems: pointsData.purchasedItems,
    completeWorkout: handleCompleteWorkout,
    purchaseItem: handlePurchaseItem,
    isWorkoutCompleted: checkWorkoutCompleted,
    isItemPurchased: checkItemPurchased,
    getWorkoutHistory,
    getWorkoutsByDateRange,
    getWorkoutsByMonth,
    getWorkoutTypeStats,
    getWorkoutsByDate,
    refreshPoints
  };
};