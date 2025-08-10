// API Service for Backend Integration
// Use environment variable or show error if not configured
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE_URL environment variable is not set!');
  console.error('💡 Create a .env.local file with: VITE_API_BASE_URL=https://your-backend.netlify.app/.netlify/functions');
}

console.log(`🔧 API Backend: ${API_BASE_URL || 'NOT CONFIGURED'}`);

// Types for API responses
export interface User {
  id: string;
  email: string;
  displayName: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: string;
  memberSince: string;
  fitnessLevel?: number;
}

export interface Workout {
  id: string;
  name: string;
  icon: string;
  category: 'outdoor' | 'indoor' | 'anywhere';
  duration: string;
  points: number;
  level?: number;
  workoutTypeId?: string;
  description?: string;
  isCurrentLevel?: boolean;
}

export interface WorkoutHistoryEntry {
  id: string;
  workoutName: string;
  workoutIcon: string;
  category: 'outdoor' | 'indoor' | 'anywhere';
  pointsEarned: number;
  completedAt: string;
  date: string;
  level?: number;
  workoutTypeId?: string;
  description?: string;
  levelUp?: boolean;
  newLevel?: number;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

export interface Purchase {
  id: string;
  itemName: string;
  itemIcon: string;
  pointsSpent: number;
  purchasedAt: string;
}

export interface StatsOverview {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  uniqueWorkoutTypes: number;
  memberSince: string;
}

export interface WorkoutStats {
  workouts: WorkoutHistoryEntry[];
  summary: {
    totalWorkouts: number;
    pointsEarned: number;
    uniqueWorkoutTypes: number;
    activeDays: number;
  };
}

export interface ChartData {
  chartData: Array<{
    date: string;
    overall: number;
    [workoutType: string]: number | string;
  }>;
  workoutTypes: string[];
  summary: {
    totalWorkouts: number;
    activeDays: number;
    pointsEarned: number;
    averagePerDay: number;
  };
}

// Error types
export class APIError extends Error {
  public status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}


// Helper function to wait for Firebase initialization and user authentication
const waitForFirebaseAuth = async (maxWaitTime: number = 5000): Promise<boolean> => {
  const { isFirebaseReady, getCurrentFirebaseUser } = await import('./firebaseAuth');
  
  if (!isFirebaseReady()) {
    console.warn('🔥 Firebase not configured. Please add Firebase config to .env file.');
    return false;
  }

  // Check immediately first
  const firebaseUser = getCurrentFirebaseUser();
  if (firebaseUser) {
    console.log('🔥 Firebase user already authenticated, proceeding with API call');
    return true;
  }

  // Wait for Firebase user to be available (shorter timeout since context manages this)
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitTime) {
    const firebaseUser = getCurrentFirebaseUser();
    if (firebaseUser) {
      console.log('🔥 Firebase user authenticated, proceeding with API call');
      return true;
    }
    // Wait 200ms before checking again (less frequent checks)
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.warn(`🔥 Firebase authentication timeout after ${maxWaitTime}ms`);
  return false;
};

// Token refresh mechanism for Firebase tokens
let tokenRefreshTimer: NodeJS.Timeout | null = null;

export const clearTokenRefreshTimer = () => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
    tokenRefreshTimer = null;
    console.log('🔄 Token refresh timer cleared');
  }
};

const scheduleTokenRefresh = (refreshAfterMs: number) => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
  }
  
  tokenRefreshTimer = setTimeout(async () => {
    console.log('🔄 Refreshing Firebase token...');
    try {
      const { getFirebaseIdToken } = await import('./firebaseAuth');
      const newToken = await getFirebaseIdToken();
      
      if (newToken) {
        // Update localStorage with new token
        const userSession = localStorage.getItem('user');
        if (userSession) {
          const userData = JSON.parse(userSession);
          userData.token = newToken;
          userData.idToken = newToken;
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('🔄 Firebase token refreshed and updated in localStorage');
        }
        
        // Schedule next refresh (50 minutes from now)
        scheduleTokenRefresh(50 * 60 * 1000);
      }
    } catch (error) {
      console.error('❌ Failed to refresh Firebase token:', error);
      // Clear stored data on refresh failure
      localStorage.removeItem('user');
      localStorage.removeItem('autoLogin');
      window.location.reload(); // Force re-authentication
    }
  }, refreshAfterMs);
};

// Helper function to detect if token is from Firebase (JWT format)
const isFirebaseToken = (token: string): boolean => {
  // Firebase tokens are JWTs with 3 parts separated by dots
  return token.split('.').length === 3 && token.startsWith('eyJ');
};

// Helper function to get fresh Firebase token
const getFirebaseToken = async (): Promise<string> => {
  try {
    // Wait for Firebase user authentication
    const isAuthenticated = await waitForFirebaseAuth();
    if (!isAuthenticated) {
      console.error('🔥 No authenticated Firebase user');
      throw new APIError(401, 'Firebase user authentication required. Please sign in with Google.');
    }

    // Get fresh Firebase token - backend will handle all user data
    const { getFirebaseIdToken } = await import('./firebaseAuth');
    const firebaseToken = await getFirebaseIdToken();
    
    if (firebaseToken) {
      console.log('🔑 Fresh Firebase token obtained');
      
      // Schedule token refresh for Firebase tokens (50 minutes from now)
      scheduleTokenRefresh(50 * 60 * 1000);
      
      return firebaseToken;
    } else {
      console.error('🔥 Failed to get Firebase token');
      throw new APIError(401, 'Failed to get Firebase authentication token. Please try signing in again.');
    }
  } catch (error) {
    console.error('🔥 Error getting Firebase token:', error);
    throw new APIError(401, 'Authentication failed. Please sign in again.');
  }
};

// Helper function to get auth token - prioritize fresh Firebase tokens
const getAuthToken = async (): Promise<string | null> => {
  // Check if we have an active Firebase user first (prioritize fresh tokens)
  try {
    const { isFirebaseReady, getCurrentFirebaseUser } = await import('./firebaseAuth');
    
    if (isFirebaseReady() && getCurrentFirebaseUser()) {
      console.log('🔑 Using fresh Firebase token');
      return await getFirebaseToken();
    }
  } catch {
    // Firebase not available or error, fall back to localStorage
  }

  // Fallback: try to get token from localStorage (regular login)
  try {
    const userSession = localStorage.getItem('user');
    if (userSession) {
      const userData = JSON.parse(userSession);
      if (userData.token) {
        const isFirebase = isFirebaseToken(userData.token);
        console.log(`🔑 Using localStorage token (${isFirebase ? 'Firebase' : 'regular'})`);
        
        // If it's a Firebase token and we haven't set up refresh yet, schedule it
        if (isFirebase && !tokenRefreshTimer) {
          scheduleTokenRefresh(50 * 60 * 1000); // 50 minutes
        }
        
        return userData.token;
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to parse user session from localStorage:', error);
  }

  return null;
};

// Generic API request function with automatic token refresh
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {},
  isRetry: boolean = false
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new APIError(500, 'Backend URL not configured. Please set VITE_API_BASE_URL environment variable.');
  }

  // All API calls require authentication
  const token = await getAuthToken();
  
  if (!token) {
    console.error('🔥 No authentication token available');
    throw new APIError(401, 'Authentication required. Please sign in.');
  }
  
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🔗 ${options.method || 'GET'} ${endpoint}`);
    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      let backendError = '';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        backendError = errorData.error || '';
      } catch {
        // Could not parse error response
      }
      
      // If we get 401 and haven't retried yet, try to refresh the token and retry
      if (response.status === 401 && !isRetry) {
        console.warn('🔄 401 error received, attempting token refresh...');
        
        try {
          // Force refresh the Firebase token
          const freshToken = await refreshFirebaseToken();
          if (freshToken) {
            console.log('🔄 Token refreshed successfully, retrying request...');
            // Retry the request with the fresh token (mark as retry to prevent infinite loops)
            return await apiRequest<T>(endpoint, options, true);
          }
        } catch (refreshError) {
          console.error('🔄 Token refresh failed:', refreshError);
          // Fall through to throw the original 401 error
        }
      }
      
      console.error(`❌ ${response.status} ${endpoint}: ${errorMessage}`);
      
      throw new APIError(response.status, `${errorMessage}${backendError ? ` (${backendError})` : ''}`);
    }

    const data = await response.json();
    console.log(`✅ ${options.method || 'GET'} ${endpoint}`);
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    console.error(`🔥 Network Error: ${fullUrl}`, error);
    console.error(`🔗 Failed URL: ${fullUrl}`);
    
    // Provide specific network debugging info
    let debugMessage = '';
    if (error instanceof TypeError && error.message.includes('fetch')) {
      debugMessage = 'Connection failed. Check if backend URL is correct and accessible.';
      console.error('💡 Backend Debug: Cannot connect to backend.');
      console.error('💡 Check: 1) Is the URL correct? 2) Is the backend deployed? 3) CORS configured?');
      console.error('💡 Current URL:', API_BASE_URL);
    }
    
    throw new APIError(500, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}. ${debugMessage}`);
  }
};

// Function to force refresh Firebase token
const refreshFirebaseToken = async (): Promise<string | null> => {
  try {
    const { getCurrentFirebaseUser } = await import('./firebaseAuth');
    const currentUser = getCurrentFirebaseUser();
    
    if (currentUser) {
      console.log('🔄 Refreshing Firebase token...');
      // Force refresh the token (true parameter forces refresh)
      const freshToken = await currentUser.getIdToken(true);
      
      if (freshToken) {
        // Update localStorage with new token
        const userSession = localStorage.getItem('user');
        if (userSession) {
          const userData = JSON.parse(userSession);
          userData.token = freshToken;
          userData.idToken = freshToken;
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('🔄 Token refreshed and updated in localStorage');
        }
        return freshToken;
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error refreshing Firebase token:', error);
    return null;
  }
};

// Authentication API
export const authAPI = {
  getProfile: (): Promise<{ user: User }> =>
    apiRequest('/auth-profile'),

  updateProfile: (displayName?: string, fitnessLevel?: number): Promise<{ user: User }> => {
    const body: { displayName?: string; fitnessLevel?: number } = {};
    if (displayName !== undefined) body.displayName = displayName;
    if (fitnessLevel !== undefined) body.fitnessLevel = fitnessLevel;
    
    return apiRequest('/auth-profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  deleteAccount: (): Promise<{ success: boolean; message: string }> =>
    apiRequest('/delete-user', {
      method: 'DELETE',
    }),
};

// Workouts API
export const workoutsAPI = {
  getAvailable: (): Promise<{ workouts: Workout[] }> =>
    apiRequest('/workouts'),
    
  getDaily: (): Promise<{ 
    workouts: Workout[];
    userProgress: Record<string, {
      currentLevel: number;
      completionsAtCurrentLevel: number;
      totalCompletions: number;
    }>;
    totalWorkouts: number;
    anywhereWorkouts: number;
  }> =>
    apiRequest('/workouts-daily'),

  complete: (workoutId: string): Promise<{
    success: boolean;
    pointsEarned: number;
    newTotalPoints: number;
    streakInfo: {
      currentStreak: number;
      longestStreak: number;
      isNewRecord: boolean;
    };
    levelInfo?: {
      levelUp: boolean;
      currentLevel: number;
      completionsAtLevel: number;
      workoutType: string;
    };
  }> =>
    apiRequest('/workouts-complete', {
      method: 'POST',
      body: JSON.stringify({ workoutId }),
    }),

  getHistory: (startDate?: string, endDate?: string): Promise<{ workouts: WorkoutHistoryEntry[] }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/workouts-history${query}`);
  },
};

// Store API
export const storeAPI = {
  getItems: (): Promise<{ items: StoreItem[] }> =>
    apiRequest('/store-items'),

  purchase: (itemId: string): Promise<{
    success: boolean;
    pointsSpent: number;
    newTotalPoints: number;
    item: { id: string; name: string; description: string };
  }> =>
    apiRequest('/store-purchase', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    }),

  getPurchases: (): Promise<{ purchases: Purchase[] }> =>
    apiRequest('/store-purchases'),
};

// Statistics API
export const statsAPI = {
  getOverview: (): Promise<StatsOverview> =>
    apiRequest('/stats-overview'),

  getWorkouts: (startDate?: string, endDate?: string): Promise<WorkoutStats> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/stats-workouts${query}`);
  },

  getCharts: (period?: 'thisMonth' | 'lastMonth', startDate?: string, endDate?: string): Promise<ChartData> => {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/stats-charts${query}`);
  },
};

// Helper functions for backward compatibility
export const isWorkoutCompletedToday = async (workoutId: string): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { workouts } = await workoutsAPI.getHistory(today, today);
    return workouts.some(w => w.id === workoutId);
  } catch (error) {
    console.error('Error checking workout completion:', error);
    return false;
  }
};

export const isItemPurchased = async (itemId: string): Promise<boolean> => {
  try {
    const { purchases } = await storeAPI.getPurchases();
    return purchases.some(p => p.id === itemId);
  } catch (error) {
    console.error('Error checking item purchase:', error);
    return false;
  }
};

// Cleanup function for token refresh
export const clearTokenRefresh = () => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
    tokenRefreshTimer = null;
    console.log('🔄 Token refresh timer cleared');
  }
};

// Logout helper function
export const logout = () => {
  clearTokenRefresh();
  localStorage.removeItem('user');
  localStorage.removeItem('autoLogin');
  console.log('🔄 User logged out, localStorage cleared');
};

// Export API status for debugging
export const getAPIStatus = () => ({
  apiBaseUrl: API_BASE_URL,
  isConfigured: !!API_BASE_URL
});