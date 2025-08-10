# Backend Authentication Changes Required

The frontend has been modified to use **Google/Firebase authentication only**. The following backend endpoints need to be updated or removed:

## Endpoints to REMOVE (no longer used):
- `POST /login` - Email/password authentication
- `POST /register` - Email/password registration  
- `DELETE /deleteAccount` - Custom account deletion

## Existing Endpoints That Should Work (using Firebase tokens):
All other endpoints in the backend should continue working as they are, since they expect Firebase ID tokens in the Authorization header, which the frontend now provides through Google authentication.

## Authentication Flow:
1. User signs in with Google on frontend
2. Firebase returns ID token
3. Frontend stores user data with Firebase token
4. All API calls use Firebase token in Authorization header
5. Backend verifies Firebase token for each request

## Required Backend Authentication Logic:
The backend should:
1. ✅ Accept Firebase ID tokens in Authorization header
2. ✅ Verify Firebase tokens using Firebase Admin SDK
3. ✅ Extract user information (uid, email, displayName) from verified token
4. ✅ Use Firebase uid as the user identifier for database operations

## Frontend Changes Made:
- ❌ Removed email/password login/register forms
- ❌ Removed `authService.ts` (email/password API calls)
- ❌ Removed `LoginForm.tsx` and `RegisterForm.tsx` components
- ✅ Updated `AuthContainer.tsx` to show only Google sign-in
- ✅ Updated `GoogleSignIn.tsx` to handle Firebase authentication directly
- ✅ Updated `UserDashboard.tsx` to use Firebase sign-out

## Testing:
1. Clear localStorage/cookies
2. Visit the app - should only show Google sign-in option
3. Sign in with Google - should authenticate and access all features
4. All API calls should work with Firebase tokens

## Note:
Account deletion functionality has been temporarily disabled (just signs out). If you want to implement account deletion, you'll need to create a new backend endpoint that:
1. Verifies Firebase token
2. Deletes user data from your database
3. Returns success response