# PharmAgent - AI-Powered Drug Discovery Platform

> Multi-agent AI system for pharmaceutical research and drug repurposing opportunities

## 🎯 Overview

PharmAgent is an intelligent drug discovery platform that uses multi-agent AI to analyze:

- Patent landscapes and Freedom to Operate (FTO)
- Clinical trial data and pipelines
- Market intelligence and competition
- Strategic repurposing opportunities

## 🚀 Quick Start

### ⚡ Fastest Way (Auto-Fallback Enabled)

The app **automatically works** whether or not the backend is running!

```bash
npm install
npm run dev
```

**How it works:**

- If backend is running → Uses real-time web search 🌐
- If backend is offline → Automatically switches to local simulation 💾

### Option 1: With Real Backend (Live Web Search)

For real-time web research, start both backend and frontend:

**Terminal 1: Start Backend**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2: Start Frontend**

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

### Option 2: Frontend Only (Local Simulation)

Just want to demo the UI? No backend needed:

```bash
npm install
npm run dev
```

The app will automatically use local database for known drugs (Gefitinib, Metformin, Aspirin).

## 📁 Project Structure

```
pharmagent-discovery/
├── backend/              # Python Flask + LangGraph backend
│   ├── app.py           # REST API server
│   ├── agent_graph.py   # Multi-agent workflow
│   └── requirements.txt # Python dependencies
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── pages/          # Main pages
│   └── data/           # Mock data (if not using backend)
└── public/             # Static assets
```

## 🛠️ Technologies

### Frontend

- **React** + **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations

### Backend

- **Flask** - Python web framework
- **LangGraph** - Multi-agent orchestration
- **LangChain** - AI framework
- **DuckDuckGo Search** - Free web search (no API keys)

## 📖 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Fast 2-step setup
- [backend/README_BACKEND.md](backend/README_BACKEND.md) - Backend guide
- [backend/ARCHITECTURE.md](backend/ARCHITECTURE.md) - System architecture
- [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - Full implementation details

## ⚙️ Configuration

Edit `src/config.ts` to customize behavior:

```typescript
export const config = {
  BACKEND_URL: "http://127.0.0.1:5000", // Backend server URL
  AUTO_FALLBACK_TO_MOCK: true, // Auto-switch to local data if backend offline
  BACKEND_TIMEOUT: 60000, // Request timeout (60 seconds)
  DEBUG_MODE: false, // Enable verbose logging
};
```

**AUTO_FALLBACK_TO_MOCK:**

- `true` (default): Seamlessly works with or without backend
- `false`: Requires backend to be running, shows error if offline

## 🎯 Features

✅ **Smart Fallback** - Auto-switches between live and local data  
✅ **Multi-Agent System** - Specialized agents for different research tasks  
✅ **Real-Time Search** - Live web searches via DuckDuckGo (when backend available)  
✅ **Patent Analysis** - FTO and patent expiry tracking  
✅ **Clinical Trials** - Pipeline and phase analysis  
✅ **Market Intelligence** - Size, competition, CAGR  
✅ **PDF Reports** - Download strategic summaries  
✅ **Terminal Logs** - Real-time workflow visibility

## 🧪 Example Queries

- "Analyze Gefitinib for Glioblastoma"
- "What about Metformin for diabetes?"
- "Research Aspirin repurposing opportunities"

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details

## 🎓 Built For

PharmAgent Hackathon - Accelerating Drug Discovery with AI
