# Quick Deployment Guide

## Option 1: Render.com (Recommended - Free & Easy)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add deployment config"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Configuration:
   - **Name**: tgpcet-backend
   - **Environment**: Node
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free (for testing)

### Step 3: Add Environment Variables
In Render dashboard → Settings → Environment:
- Add `SAMBANOVA_API_KEY` (if you have one)
- Add `GEMINI_API_KEY` (if you have one)

### Step 4: Deploy
Click "Create Web Service" and wait ~2-3 minutes

Your backend URL will be: `https://tgpcet-backend.onrender.com`

---

## Option 2: Heroku (Alternative)

### Step 1: Install Heroku CLI
https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Login & Create App
```bash
heroku login
heroku create tgpcet-backend
```

### Step 3: Add Environment Variables
```bash
heroku config:set SAMBANOVA_API_KEY=your_key
heroku config:set GEMINI_API_KEY=your_key
```

### Step 4: Deploy
```bash
git push heroku main
```

Your backend URL will be: `https://tgpcet-backend.herokuapp.com`

---

## Option 3: Railway.app (Easiest)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables in dashboard
5. Automatic deployment on push

---

## After Deployment

### Update Vercel with Backend URL

1. Go to **Vercel Dashboard** → Select your frontend project
2. **Settings** → **Environment Variables**
3. Add/Update:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://tgpcet-backend.onrender.com`)
4. Click "Save"
5. **Deployments** → Click "Redeploy" on latest deployment

---

## Verify Everything Works

1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to your Vercel frontend
3. Try logging in
4. Error should be gone! ✅

---

## Troubleshooting

### Backend not starting?
Check Render/Heroku logs:
- **Render**: Dashboard → Tgpcet Backend → Logs tab
- **Heroku**: `heroku logs --tail`

### Still getting 404?
1. Verify backend is running (visit `https://your-backend-url.com/api/drives` in browser)
2. Check CORS is enabled (already in your code)
3. Verify `VITE_API_URL` is set in Vercel (**case-sensitive!**)
4. Hard refresh Vercel frontend (Ctrl+Shift+R)

### Database issues?
- SQLite database is created automatically in `server/placement_portal.db`
- File persists on Render free tier, but may reset on redeploy
- For production, consider moving to PostgreSQL
