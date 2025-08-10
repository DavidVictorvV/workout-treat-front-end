# Backend Integration Setup

## Current Issue
The frontend is trying to connect to your backend API but getting network errors. Here are the solutions:

## Option 1: Use Your Deployed Backend (Recommended for Testing)

1. Create a `.env.local` file in your project root:
```bash
VITE_API_BASE_URL=https://your-actual-backend-domain.netlify.app/.netlify/functions
```

2. Replace `your-actual-backend-domain.netlify.app` with your actual Netlify site URL

3. Restart your development server:
```bash
npm run dev
```

## Option 2: Run Backend Locally

If you want to run the backend locally alongside the frontend:

1. In your backend project, run:
```bash
netlify dev
```

2. Create a `.env.local` file:
```bash
VITE_API_BASE_URL=http://localhost:8888/.netlify/functions
```

## Option 3: Mock Development Mode

For pure frontend development without backend, you can create a mock mode:

1. Create a `.env.local` file:
```bash
VITE_API_BASE_URL=mock
```

2. The frontend will use mock data for development

## Troubleshooting

### Check API Connection
Open browser console to see detailed API request logs:
- 🌐 API Request logs show outgoing requests
- ✅ API Success logs show successful responses  
- ❌ API Error logs show server errors
- 🔥 Network Error logs show connection issues

### Common Issues
1. **CORS errors**: Make sure your backend allows requests from `http://localhost:5173`
2. **404 errors**: Verify the backend URL and endpoint paths
3. **401 errors**: Check authentication token handling
4. **Network errors**: Verify backend is running and accessible

### Quick Test
You can test if your backend is accessible by visiting:
```
https://your-backend-domain.netlify.app/.netlify/functions/workouts
```

This should return the list of available workouts.