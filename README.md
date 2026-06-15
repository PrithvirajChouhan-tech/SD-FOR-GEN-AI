# ZENITH AI — Software Engineering Copilot Web App

ZENITH AI is an elite, full-stack AI-powered software engineering copilot web application built with a modern React + Vite frontend and an Express backend. It utilizes the Featherless.ai API with advanced coding models like DeepSeek V4 and Gemma.

---

## Key Features

1. **Voice Input**: Speech-to-text input with an interactive microphone visualizer and animation rings.
2. **File Upload & Analysis**: Upload PDFs, documents, or code files for inline contextual analysis.
3. **Usage Dashboard**: Track message counts, active models, tokens, and storage metrics in a sliding sidebar.
4. **Compare Mode**: Side-by-side model comparison to test prompts across two AI models simultaneously.
5. **Aesthetic UI**: Dark theme (`#0a0a0f`) with glassmorphism and animated custom background loop.

---

## Local Development Setup

To start developing locally, follow these simple steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Environment Variables Configuration
Create a `.env` file in the root directory (or modify the existing one) and add your API key:
```env
FEATHERLESS_API_KEY=your_featherless_api_key_here
PORT=3001
```

### 3. Install Dependencies
Run npm install in the root folder and in the server folder:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm install --prefix server
```

### 4. Run Locally
We use `concurrently` to launch both the frontend (Vite) and backend (Express) with a single command:
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3001](http://localhost:3001)

Vite is configured to proxy `/api` routes directly to the Express server, so no CORS configuration is needed.

---

## Production Build & Single-Service Hosting

You can easily build the app and host it on any standard Node.js cloud hosting provider (e.g., **Render**, **Railway**, **Heroku**, **Vercel**).

The Express backend is configured to serve the built static React frontend assets from the `dist` folder. This means you only need to host **one unified web service**.

### 1. Build the Frontend
Compiles your React code into optimization static files:
```bash
npm run build
```

### 2. Start the Production Server
Runs the unified backend server which hosts the API and serves the React client:
```bash
npm start
```
Go to `http://localhost:3001` in your browser.

### Cloud Deployment (e.g. Render / Railway)
1. Link your GitHub repository.
2. Configure the environment variables (e.g. `FEATHERLESS_API_KEY`, `NODE_ENV=production`).
3. Set the **Build Command** to:
   ```bash
   npm install && npm install --prefix server && npm run build
   ```
4. Set the **Start Command** to:
   ```bash
   npm start
   ```
