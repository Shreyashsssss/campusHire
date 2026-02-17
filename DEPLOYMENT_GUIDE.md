# Backend Error Fix & Deployment Guide

## The Problem
Your frontend is deployed on Vercel but the backend is running on localhost. The frontend can't access a local server from the cloud.

**Error**: `Server Error (404): The backend might be down.`

## The Solution

### Step 1: Deploy Your Backend Server

Choose one of these options:

#### Option A: Render.com (Recommended - Free tier available)

1. **Create a Render account**: https://render.com
2. **Push your code to GitHub** (if not already done)
3. **Create new Web Service**:
   - Connect your GitHub repo
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server/server.js`
   - Set Port: 5000
4. **Add Environment Variables**:
   - Add `GEMINI_API_KEY` if you use Gemini AI
5. **Deploy** - Render will give you a URL like `https://tgpcet-backend.onrender.com`

#### Option B: Railway.app (Free tier)

1. Create account: https://railway.app
2. Create new project from GitHub
3. Configure start command: `node server/server.js`
4. Add environment variables
5. Get your deployment URL

#### Option C: Heroku (Now paid, but simple)

1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Run: `git push heroku main`

### Step 2: Update Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com` (from Step 1)
   - Example: `https://tgpcet-backend.onrender.com`
4. **Redeploy** your frontend:
   - Push a git commit, or
   - Click "Redeploy" in Vercel dashboard

### Step 3: Verify the Fix

1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Try logging in again
3. The error should be gone!

## Local Development (Optional)

To test locally before deployment:

1. **Terminal 1** - Start backend:
   ```bash
   npm run start:server
   ```

2. **Terminal 2** - Start frontend:
   ```bash
   npm run start:client
   ```

The frontend will use the Vite proxy (configured in `vite.config.ts`) to route `/api` calls to `http://127.0.0.1:5000`.

## Files Changed

- `src/services/api.ts` - Now uses `VITE_API_URL` environment variable
- `.env.local` - Local development (uses proxy)
- `.env.production` - Production settings
- `.env.example` - Template for environment variables

## Environment Variable Summary

| Environment | VITE_API_URL | Notes |
|---|---|---|
| **Local Dev** | Not needed | Uses `/api` proxy → `http://127.0.0.1:5000` |
| **Production** | `https://your-backend-url.com` | Set in Vercel dashboard |

## Troubleshooting

If still getting errors after deployment:

1. **Check backend is running**: Visit `https://your-backend-url.com/api/drives` in browser
2. **Check CORS enabled**: Backend has `cors()` middleware (already enabled in your code)
3. **Check environment variable**: Verify `VITE_API_URL` is set correctly in Vercel
4. **Redeploy frontend**: After changing env vars, Vercel needs to rebuild

## Security Notes

- Keep your backend URL in Vercel environment variables (already visible in production)
- Never commit `.env` files with secrets
- Use `.env.example` as template only
