# TGPCET Deployment Complete ✅

Your application is now configured for cloud deployment!

## What Was Fixed

| File | Change |
|------|--------|
| `src/services/api.ts` | Uses `VITE_API_URL` environment variable instead of hardcoded proxy |
| `server/server.js` | PORT is now dynamic (`process.env.PORT`) for cloud hosting |
| `package.json` | Added `start` script for cloud deployment |
| `.env.local` | Development environment (uses `/api` proxy) |
| `.env.production` | Production environment template |
| `Procfile` | Heroku deployment configuration |
| `render.yaml` | Render.com deployment configuration |

## Quick Start (3 Steps)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Setup for cloud deployment"
git push origin main
```

### Step 2: Deploy Backend (Choose ONE)

#### 🟢 **Render.com** (Recommended - Free)
1. Go to https://render.com → Sign up with GitHub
2. Click "New Web Service" → Select your repo
3. Configure:
   - **Name**: `tgpcet-backend`
   - **Build**: `npm install`
   - **Start**: `node server/server.js`
   - **Plan**: Free
4. Deploy and copy the URL (e.g., `https://tgpcet-backend.onrender.com`)

#### OR **Heroku** (Alternative)
```bash
heroku create tgpcet-backend
git push heroku main
```

### Step 3: Update Vercel
1. **Vercel Dashboard** → Your project → **Settings**
2. **Environment Variables** → Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tgpcet-backend.onrender.com` (your backend URL from Step 2)
   - **Production**
3. Click **Redeploy** on your latest deployment

---

## Test It

1. Clear browser cache (Ctrl+Shift+Delete)
2. Visit your Vercel URL
3. Try logging in
4. ✅ Should work now!

---

## File Structure After Deployment

```
tgpcet-backend (Cloud)           tgpcet-frontend (Vercel)
├── server/server.js        ←→   ├── src/services/api.ts
├── server/database.js            ├── .env → VITE_API_URL
├── Procfile
└── render.yaml
```

---

## Troubleshooting

### Backend won't start?
- Check logs in Render/Heroku dashboard
- Verify `npm install` runs without errors
- Make sure Node.js 18+ is specified (if needed: create `runtime.txt` with `nodejs-18.17.0`)

### Still getting "Server Error (404)"?
- ✅ Backend deployed and running? Visit backend URL directly
- ✅ `VITE_API_URL` set in Vercel? Check Environment Variables
- ✅ Frontend redeployed? Click "Redeploy" in Vercel after changing env vars
- ✅ Cache cleared? Ctrl+Shift+Delete and hard refresh

### Database not persisting?
- Free Render tier resets database on redeploy
- For production: Use PostgreSQL instead of SQLite
- Or use Render's persistent disk (paid tier)

---

## Environment Variables Needed (Optional)

If using AI features, add these to your cloud deployment:

### Render/Heroku Settings:
```
SAMBANOVA_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

---

## Local Development (Still Works)

```bash
# Terminal 1: Start backend (uses port 5000)
npm run start:server

# Terminal 2: Start frontend (uses /api proxy → localhost:5000)
npm run start:client
```

---

## Next: Production Improvements

- [ ] Switch to PostgreSQL (from SQLite)
- [ ] Add input validation
- [ ] Implement real authentication (JWT)
- [ ] Add rate limiting
- [ ] Use environment-specific API keys
- [ ] Enable HTTPS (automatic on Render/Heroku)
- [ ] Setup error monitoring (Sentry, LogRocket)

---

**Need more help?** See:
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Detailed deployment steps
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full technical guide
