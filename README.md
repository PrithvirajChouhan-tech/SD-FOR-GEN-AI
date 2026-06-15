# 🌌 ZENITH AI — Elite Software Engineering Copilot

Zenith AI is a premium, full-stack AI-powered software engineering workspace designed to assist throughout the complete software development lifecycle — from initial requirements and UML diagrams to automated test suites, DevOps configurations, and deployment strategies.

🚀 **Live Deployed Web Application**: [https://prithvi-ai-copilot.vercel.app](https://prithvi-ai-copilot.vercel.app)

---

## 🌟 Key Capabilities

### 1. 🎤 Interactive AI Assistant & Speech Input
*   **Voice Integration**: Speech-to-text input with an interactive microphone visualizer and animation rings.
*   **File Context**: Upload PDFs, documents, or raw code files for inline contextual analysis and refactoring.
*   **Dual-Model Compare Mode**: Compare response outputs side-by-side across two distinct AI models simultaneously.

### 2. 📊 Advanced Engineering Suite
*   **SRS Generator**: Generate comprehensive Software Requirements Specification documents.
*   **UML & Database Designer**: Create use case, class, and sequence diagrams, or optimize SQL database schemas.
*   **Repository Analyzer**: Deep code intelligence, dependency graph mapping, and commit checks.
*   **DevOps & Testing**: Automatically scaffold Jest test suites, Dockerfiles, and CI/CD pipelines.

### 3. 📈 Usage & Cost Dashboard
*   **Token Statistics**: Track message count, token usage, and active models in real time.
*   **Cost Estimation**: Out-of-the-box billing estimation based on individual model pricing configurations.
*   **Model Options**: Access DeepSeek V4 Pro, DeepSeek V4 Flash, GPT-OSS 120B, Google Gemma 4, Qwen 3.6, and Llama 3.1.

---

## 🛠️ Technology Stack

*   **Frontend**: React, Framer Motion (for premium micro-animations), Recharts (for usage data visualization), Lucide React (icons).
*   **Styling**: Vanilla CSS with glassmorphism effects, a glowing alien teal theme, and an animated video background overlay.
*   **Backend**: Node.js, Express, and OpenAI compatibility layers.
*   **AI Engine**: Featherless AI API integration with advanced reasoning coding models.
*   **Deployment**: Optimized for Vercel Serverless Functions and Render cloud hosting.

---

## ⚙️ Local Development Setup

To run Zenith AI on your local machine, follow these steps:

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   npm (v9+ recommended)

### 2. Environment Configuration
Create a `.env` file in the root directory and add your Featherless API Key:
```env
FEATHERLESS_API_KEY=your_featherless_api_key_here
PORT=3001
AI_MODEL=deepseek-ai/DeepSeek-V4-Flash
```

### 3. Install Dependencies
Install packages for both the frontend client and backend server:
```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
npm install --prefix server
```

### 4. Run the Project
Launch both the Vite dev server and the Express API server concurrently:
```bash
npm run dev
```
*   **Frontend Client**: [http://localhost:5173](http://localhost:5173)
*   **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 🚀 Cloud Deployment

Zenith AI is configured for unified deployment (serving the static React build from the Express backend).

### Production Build
Compile client-side assets into the `dist` directory:
```bash
npm run build
```

### Start Production Server
Run the Express server to serve API endpoints and static client files:
```bash
npm start
```
Go to `http://localhost:3001` in your browser.
