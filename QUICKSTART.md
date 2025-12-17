# 🚀 QUICK START - Real Backend Setup

## 📋 What Changed?

Your PharmAgent now uses a **REAL Python backend** with live web searches instead of mock data!

## ⚡ Quick Start (2 Terminals)

### **Terminal 1: Start Backend**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Wait for: `✓ Running on http://127.0.0.1:5000`

### **Terminal 2: Start Frontend**

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## 🧪 Test It

Type: **"Analyze Gefitinib for cancer"**

Watch real-time web searches happen! 🔍

---

## 📖 Full Documentation

See [backend/README_BACKEND.md](backend/README_BACKEND.md) for:

- Architecture details
- Troubleshooting
- Deployment options
- API documentation

## ⚠️ Important Notes

- **First query takes 20-30 seconds** (real web search is slow)
- **DuckDuckGo is free** but rate-limited (wait between queries)
- **For video demos:** Mock version is faster and more reliable
- **For live demos:** This real backend is more impressive

## 🎯 What Was Built

✅ **Flask Backend** - REST API on port 5000  
✅ **LangGraph StateGraph** - Multi-agent orchestration  
✅ **DuckDuckGo Search** - Real-time data (no API keys)  
✅ **React Integration** - Frontend calls real API  
✅ **Worker Agents** - Market, Patent, Clinical research  
✅ **Synthesizer** - Combines all findings

Enjoy! 🎉
