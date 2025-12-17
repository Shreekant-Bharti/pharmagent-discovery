# PharmAgent - AI-Powered Drug Discovery Platform

> Multi-agent AI system for pharmaceutical research and drug repurposing opportunities

## 🎯 Overview

PharmAgent is an intelligent drug discovery platform that uses multi-agent AI to analyze:

- Patent landscapes and Freedom to Operate (FTO)
- Clinical trial data and pipelines
- Market intelligence and competition
- Strategic repurposing opportunities

## 🚀 Quick Start

### Option 1: Run with Real Backend (Live Web Search)

See [QUICKSTART.md](QUICKSTART.md) for detailed setup.

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

### Option 2: Frontend Only (Mock Data)

If you just want to see the UI without the Python backend:

```bash
npm install
npm run dev
```

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

## 🎯 Features

✅ **Multi-Agent System** - Specialized agents for different research tasks  
✅ **Real-Time Search** - Live web searches via DuckDuckGo  
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
