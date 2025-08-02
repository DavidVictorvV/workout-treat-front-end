import { useState, useEffect } from 'react';
import { 
  getPointsData, 
  completeWorkout, 
  purchaseItem, 
  isWorkoutCompleted, 
  isItemPurchased,
  type PointsData 
} from '@/services/pointsService';

export const usePoints = () => {
  const [pointsData, setPointsData] = useState<PointsData>(() => getPointsData());

  const refreshPoints = () => {
    setPointsData(getPointsData());
  };

  const handleCompleteWorkout = (workoutId: string, points: number): boolean => {
    if (!isWorkoutCompleted(workoutId)) {
      completeWorkout(workoutId, points);
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
    purchasedItems: pointsData.purchasedItems,
    completeWorkout: handleCompleteWorkout,
    purchaseItem: handlePurchaseItem,
    isWorkoutCompleted: checkWorkoutCompleted,
    isItemPurchased: checkItemPurchased,
    refreshPoints
  };
};