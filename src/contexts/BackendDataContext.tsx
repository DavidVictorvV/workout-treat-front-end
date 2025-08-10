import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { 
  authAPI, 
  workoutsAPI, 
  storeAPI,
  statsAPI,
  APIError,
  type User,
  type Workout,
  type WorkoutHistoryEntry,
  type StoreItem,
  type Purchase,
  type WorkoutStats,
  type ChartData
} from '@/services/apiService';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { BackendDataContext, type BackendDataContextType } from './BackendDataContextDefinition';

interface BackendDataProviderProps {
  children: ReactNode;
}

export const BackendDataProvider: React.FC<BackendDataProviderProps> = ({ children }) => {
  // Firebase auth state
  const { isFirebaseReady, firebaseUser } = useFirebaseAuth();
  
  // Track localStorage auth state
  const [hasStoredAuth, setHasStoredAuth] = useState(() => {
    return localStorage.getItem('user') && localStorage.getItem('autoLogin') === 'true';
  });
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [availableWorkouts, setAvailableWorkouts] = useState<Workout[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  
  // Stats state
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle API errors
  const handleError = (error: unknown, action: string) => {
    console.error(`Error ${action}:`, error);
    if (error instanceof APIError) {
      // Provide more user-friendly error messages
      let userMessage = error.message;
      
      switch (error.status) {
        case 401:
          userMessage = "Your session has expired. Please sign in again.";
          break;
        case 403:
          userMessage = "You don't have permission to perform this action.";
          break;
        case 404:
          userMessage = "The requested resource was not found.";
          break;
        case 429:
          userMessage = "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
        case 503:
          userMessage = "Server error. Please try again later.";
          break;
        default:
          // Keep the original message for other status codes
          userMessage = error.message;
      }
      
      setError(`${action}: ${userMessage}`);
    } else {
      setError(`${action}: An unexpected error occurred`);
    }
  };

  // Refresh user profile data
  const refreshUserData = useCallback(async () => {
    try {
      setError(null);
      const { user: userData } = await authAPI.getProfile();
      setUser(userData);
    } catch (error) {
      handleError(error, 'fetching user profile');
    }
  }, []);

  // Refresh workouts data
  const refreshWorkouts = useCallback(async () => {
    try {
      setWorkoutsLoading(true);
      setError(null);
      
      // Fetch available workouts and user's workout history in parallel
      const [availableData, historyData] = await Promise.all([
        workoutsAPI.getAvailable(),
        workoutsAPI.getHistory()
      ]);
      
      setAvailableWorkouts(availableData.workouts);
      setWorkoutHistory(historyData.workouts);
    } catch (error) {
      handleError(error, 'fetching workouts');
    } finally {
      setWorkoutsLoading(false);
    }
  }, []);

  // Refresh store data
  const refreshStore = useCallback(async () => {
    try {
      setStoreLoading(true);
      setError(null);
      
      // Fetch store items and user's purchases in parallel
      const [itemsData, purchasesData] = await Promise.all([
        storeAPI.getItems(),
        storeAPI.getPurchases()
      ]);
      
      setStoreItems(itemsData.items);
      setPurchases(purchasesData.purchases);
    } catch (error) {
      handleError(error, 'fetching store data');
    } finally {
      setStoreLoading(false);
    }
  }, []);

  // Refresh stats data
  const refreshStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setError(null);
      
      // Only fetch filtered stats and charts (user stats come from authAPI.getProfile)
      const [workoutStatsData, chartStatsData] = await Promise.all([
        statsAPI.getWorkouts(),
        statsAPI.getCharts('thisMonth')
      ]);
      
      setWorkoutStats(workoutStatsData);
      setChartData(chartStatsData);
    } catch (error) {
      handleError(error, 'fetching stats data');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Get stats data with specific filters
  const getStatsData = useCallback(async (startDate?: string, endDate?: string, period?: 'thisMonth' | 'lastMonth') => {
    try {
      setStatsLoading(true);
      setError(null);
      
      // Fetch both workout stats and chart data with the provided filters
      const [workoutStatsData, chartStatsData] = await Promise.all([
        statsAPI.getWorkouts(startDate, endDate),
        statsAPI.getCharts(period, startDate, endDate)
      ]);
      
      setWorkoutStats(workoutStatsData);
      setChartData(chartStatsData);
    } catch (error) {
      handleError(error, 'fetching filtered stats data');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Complete a workout
  const completeWorkout = useCallback(async (workoutId: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await workoutsAPI.complete(workoutId);
      
      if (result.success) {
        // Update user points and streaks
        if (user) {
          setUser({
            ...user,
            totalPoints: result.newTotalPoints,
            currentStreak: result.streakInfo.currentStreak,
            longestStreak: result.streakInfo.longestStreak,
          });
        }
        
        // Add the completed workout to workoutHistory immediately
        const workout = availableWorkouts.find(w => w.id === workoutId);
        if (workout) {
          const today = new Date().toISOString().split('T')[0];
          const newHistoryEntry: WorkoutHistoryEntry = {
            id: workoutId,
            workoutName: workout.name,
            workoutIcon: workout.icon,
            category: workout.category,
            pointsEarned: workout.points,
            date: today,
            completedAt: new Date().toISOString()
          };
          setWorkoutHistory(prev => [...prev, newHistoryEntry]);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      // Check if the error is "already completed today" - this should be treated as success
      if (error instanceof APIError && error.status === 400 && error.message.includes('already completed today')) {
        console.log('Workout already completed today - treating as success');
        
        // Make sure the workout is in our local history
        const workout = availableWorkouts.find(w => w.id === workoutId);
        if (workout) {
          const today = new Date().toISOString().split('T')[0];
          const existsInHistory = workoutHistory.some(w => w.id === workoutId && w.date === today);
          if (!existsInHistory) {
            const newHistoryEntry: WorkoutHistoryEntry = {
              id: workoutId,
              workoutName: workout.name,
              workoutIcon: workout.icon,
              category: workout.category,
              pointsEarned: workout.points,
              date: today,
              completedAt: new Date().toISOString()
            };
            setWorkoutHistory(prev => [...prev, newHistoryEntry]);
          }
        }
        
        return true;
      }
      
      handleError(error, 'completing workout');
      return false;
    }
  }, [user, availableWorkouts, workoutHistory]);

  // Purchase an item
  const purchaseItem = useCallback(async (itemId: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await storeAPI.purchase(itemId);
      
      if (result.success) {
        // Update user points
        if (user) {
          setUser({
            ...user,
            totalPoints: result.newTotalPoints,
          });
        }
        
        // Refresh purchases to include the new purchase
        await refreshStore();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, 'purchasing item');
      return false;
    }
  }, [user, refreshStore]);

  // Check if workout is completed today (using cached workoutHistory data)
  const isWorkoutCompleted = useCallback(async (workoutId: string): Promise<boolean> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return workoutHistory.some(w => w.id === workoutId && w.date === today);
    } catch (error) {
      console.error('Error checking workout completion:', error);
      return false;
    }
  }, [workoutHistory]);

  // Check if item is purchased
  const isItemPurchased = useCallback(async (itemId: string): Promise<boolean> => {
    try {
      return purchases.some(p => p.id === itemId);
    } catch (error) {
      console.error('Error checking item purchase:', error);
      return false;
    }
  }, [purchases]);


  // Listen for localStorage auth changes
  useEffect(() => {
    const checkStoredAuth = () => {
      const newHasStoredAuth = !!(localStorage.getItem('user') && localStorage.getItem('autoLogin') === 'true');
      
      // If auth was removed, clear all state
      if (hasStoredAuth && !newHasStoredAuth) {
        console.log('🔄 Authentication cleared - resetting backend data');
        setUser(null);
        setAvailableWorkouts([]);
        setWorkoutHistory([]);
        setStoreItems([]);
        setPurchases([]);
        setWorkoutStats(null);
        setChartData(null);
        setError(null);
      }
      
      setHasStoredAuth(newHasStoredAuth);
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', checkStoredAuth);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkStoredAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkStoredAuth);
      clearInterval(interval);
    };
  }, [hasStoredAuth]);

  // Initial data loading - check for any authentication before making API calls
  useEffect(() => {
    const loadInitialData = async () => {
      // Check if we have any form of authentication (localStorage token or Firebase)
      const hasFirebaseAuth = isFirebaseReady && firebaseUser;
      
      if (!hasStoredAuth && !hasFirebaseAuth) {
        console.log('🔄 No auth - skipping data load');
        setLoading(false);
        return;
      }

      console.log('🔄 Loading data from backend');
      setLoading(true);
      
      // Clear any previous errors before attempting to load data
      setError(null);
      
      try {
        // For Firebase auth, wait for valid token before proceeding
        if (hasFirebaseAuth && !hasStoredAuth) {
          console.log('🔄 Waiting for Firebase token');
          
          // Wait for a valid Firebase token to be available
          let tokenReady = false;
          let attempts = 0;
          const maxAttempts = 10;
          
          while (!tokenReady && attempts < maxAttempts) {
            try {
              const { getFirebaseIdToken } = await import('@/services/firebaseAuth');
              const token = await getFirebaseIdToken();
              if (token) {
                console.log('🔑 Token ready');
                tokenReady = true;
              } else {
                throw new Error('Token not ready');
              }
            } catch {
              attempts++;
              if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
          }
          
          if (!tokenReady) {
            console.error('🔥 Firebase token timeout');
            setError('Authentication not ready. Please try signing in again.');
            setLoading(false);
            return;
          }
        }
        
        // Load essential data in parallel with individual error handling
        // Backend will validate token for each request (Firebase or regular login)
        const results = await Promise.allSettled([
          refreshUserData(),
          refreshWorkouts(),
          refreshStore(),
          refreshStats()
        ]);
        
        // Check if all requests failed with auth errors
        const authErrors = results.filter(result => 
          result.status === 'rejected' && 
          result.reason instanceof APIError && 
          result.reason.status === 401
        );
        
        // If all requests failed with 401, it means token is invalid
        if (authErrors.length === results.length) {
          console.error('🔄 All requests failed with 401 - token may be invalid');
          setError('Your session has expired. Please sign in again.');
        }
        
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isFirebaseReady, firebaseUser, hasStoredAuth, refreshUserData, refreshWorkouts, refreshStore, refreshStats]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Manual error clearing function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: BackendDataContextType = {
    // User data
    user,
    totalPoints: user?.totalPoints || 0,
    currentStreak: user?.currentStreak || 0,
    longestStreak: user?.longestStreak || 0,
    
    // Workouts
    availableWorkouts,
    workoutHistory,
    
    // Store
    storeItems,
    purchases,
    
    // Stats
    workoutStats,
    chartData,
    
    // Loading states
    loading,
    workoutsLoading,
    storeLoading,
    statsLoading,
    
    // Error state
    error,
    
    // Actions
    completeWorkout,
    purchaseItem,
    isWorkoutCompleted,
    isItemPurchased,
    getStatsData,
    refreshUserData,
    refreshWorkouts,
    refreshStore,
    refreshStats,
    clearError,
  };

  return (
    <BackendDataContext.Provider value={contextValue}>
      {children}
    </BackendDataContext.Provider>
  );
};

