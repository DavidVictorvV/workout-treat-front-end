import { createContext } from 'react';
import type { User, Workout, WorkoutHistoryEntry, StoreItem, Purchase, WorkoutStats, ChartData } from '@/services/apiService';

export interface LevelInfo {
  levelUp: boolean;
  currentLevel: number;
  completionsAtLevel: number;
  workoutType: string;
}

export interface UserProgress {
  currentLevel: number;
  completionsAtCurrentLevel: number;
  totalCompletions: number;
}

export interface BackendDataContextType {
  // User data
  user: User | null;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  
  // Workouts
  availableWorkouts: Workout[];
  workoutHistory: WorkoutHistoryEntry[];
  userProgress: Record<string, UserProgress>;
  
  // Store
  storeItems: StoreItem[];
  purchases: Purchase[];
  
  // Stats data
  workoutStats: WorkoutStats | null;
  chartData: ChartData | null;
  
  // Loading states
  loading: boolean;
  workoutsLoading: boolean;
  storeLoading: boolean;
  statsLoading: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  completeWorkout: (workoutId: string) => Promise<{ success: boolean; levelInfo?: LevelInfo }>;
  purchaseItem: (itemId: string) => Promise<boolean>;
  isWorkoutCompleted: (workoutId: string) => Promise<boolean>;
  isItemPurchased: (itemId: string) => Promise<boolean>;
  getStatsData: (startDate?: string, endDate?: string, period?: 'thisMonth' | 'lastMonth') => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshWorkouts: () => Promise<void>;
  refreshStore: () => Promise<void>;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

export const BackendDataContext = createContext<BackendDataContextType | undefined>(undefined);