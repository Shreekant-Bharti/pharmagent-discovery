# PharmAgent - Real Backend Setup Guide

## 🎯 Overview

You've successfully replaced the mock database with a **real Python backend** that performs live web searches using DuckDuckGo. The system now uses:

- **Flask** backend with REST API
- **LangGraph** multi-agent orchestration
- **DuckDuckGo Search** for real-time data (no API keys needed!)
- **React** frontend with real-time API integration

---

## 📁 Project Structure

```
pharmagent-discovery/
├── backend/
│   ├── app.py              # Flask server with /api/research endpoint
│   ├── agent_graph.py      # LangGraph StateGraph implementation
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── pages/Index.tsx     # Updated to call real backend API
│   └── components/...      # React components (unchanged)
└── README_BACKEND.md       # This file
```

---

## 🚀 Quick Start (Local Development)

### **Step 1: Install Python Dependencies**

Open a terminal in the project root and run:

```bash
cd backend
pip install -r requirements.txt
```

This will install:

- `flask` - Web server
- `flask-cors` - Enable frontend connection
- `langchain` - AI framework
- `langchain-community` - Community tools
- `langgraph` - Multi-agent orchestration
- `duckduckgo-search` - Free web search (no API key!)

### **Step 2: Start the Flask Backend**

In the same terminal (inside `backend/` folder):

```bash
python app.py
```

You should see:

```
============================================================
🧪 PharmAgent Backend Server
============================================================
Server starting on http://127.0.0.1:5000
Endpoints:
  POST /api/research - Main research endpoint
  GET  /health       - Health check
============================================================

⚠️  Note: This uses DuckDuckGo search which is free but slower.
    Each query takes 10-20 seconds to complete.
```

**Keep this terminal open!** The backend must be running for the frontend to work.

### **Step 3: Start the React Frontend**

Open a **NEW terminal** (leave the first one running) and run:

```bash
npm install    # Only needed first time
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar).

### **Step 4: Test the Integration**

1. Open the app in your browser
2. Type a query like: **"Analyze Gefitinib for cancer"**
3. Watch the agents perform **real web searches**
4. Results are fetched from DuckDuckGo in real-time!

---

## 🔧 How It Works

### **Backend Architecture (Python)**

```
User Query → Flask API → LangGraph StateGraph → DuckDuckGo Search → Synthesis → JSON Response
```

**agent_graph.py Flow:**

1. **Master Node**: Parses the query, extracts drug name
2. **Market Worker**: Searches "drug market size 2024" on DuckDuckGo
3. **Patent Worker**: Searches "drug patent expiry" on DuckDuckGo
4. **Clinical Worker**: Searches "drug clinical trials site:clinicaltrials.gov"
5. **Synthesizer**: Combines all results into a strategic report

### **Frontend Integration (React)**

**Before (Mock):**

```typescript
const detectedDrug = detectDrug(userMessage); // Local lookup
```

**After (Real):**

```typescript
const response = await fetch("http://127.0.0.1:5000/api/research", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: userMessage }),
});
const data = await response.json();
```

---

## 🧪 Testing the Backend Independently

You can test the LangGraph workflow without running the full app:

```bash
cd backend
python agent_graph.py
```

This will run a test query and show the complete workflow output.

---

## ⚠️ Common Issues & Fixes

### **Issue: "Connection Refused" or CORS Error**

**Cause:** Backend is not running or on wrong port.

**Fix:**

1. Check if Flask is running in terminal 1
2. Verify it says `Running on http://127.0.0.1:5000`
3. Make sure CORS is enabled in `app.py` (already configured)

### **Issue: "Module Not Found" Errors**

**Cause:** Python dependencies not installed.

**Fix:**

```bash
cd backend
pip install -r requirements.txt
```

### **Issue: Search Takes 20+ Seconds**

**Cause:** DuckDuckGo search is slower than mock data.

**Expected Behavior:** Each worker takes 5-10 seconds. Total: 15-30 seconds.

**For Video Demos:** Consider using the mock version for faster demos.

### **Issue: "Rate Limited" from DuckDuckGo**

**Cause:** Too many searches in short time.

**Fix:**

1. Wait 1-2 minutes between queries
2. For production, consider using paid APIs (Google Custom Search, Serper, etc.)

---

## 🎥 For Hackathon Video Submissions

### **Option 1: Show Real Backend (Impressive but Slow)**

**Pros:**
✅ Demonstrates real API integration  
✅ Shows actual web scraping  
✅ More impressive technically

**Cons:**
❌ Slower (20-30 seconds per query)  
❌ May fail if rate limited  
❌ Requires stable internet

**Best for:** Technical demos to judges

### **Option 2: Use Mock Simulation (Fast & Reliable)**

If you just need a working demo for the video, the original mock version is:

- ⚡ **Instant** (2-3 seconds)
- 🛡️ **Never fails**
- 🎬 **Perfect for recordings**

To switch back to mock, revert `src/pages/Index.tsx` to the previous version.

---

## 🔑 Adding Real API Keys (Optional Enhancement)

For production-quality results, consider:

### **1. OpenAI GPT-4 (for better synthesis)**

Add to `backend/agent_graph.py`:

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4", temperature=0.7)

def synthesizer_node(state):
    # Use LLM to generate better synthesis
    prompt = f"Synthesize this drug research: {state}"
    synthesis = llm.invoke(prompt)
    return {"synthesis": synthesis.content}
```

### **2. ClinicalTrials.gov API (free, no key needed)**

Replace DuckDuckGo in `clinical_worker`:

```python
import requests

def clinical_worker(state):
    drug_name = state['drug_name']
    url = f"https://clinicaltrials.gov/api/query/full_studies?expr={drug_name}&fmt=json"
    response = requests.get(url)
    data = response.json()
    # Parse real trial data
```

### **3. USPTO PatentsView API (free, no key needed)**

Replace DuckDuckGo in `patent_worker`:

```python
url = f"https://api.patentsview.org/patents/query?q={{\"_text_any\":{{\"patent_abstract\":\"{drug_name}\"}}}}&f=[\"patent_number\",\"patent_date\"]"
```

---

## 📦 Deployment Options

### **Local Development** (Current Setup)

- Backend: `python backend/app.py`
- Frontend: `npm run dev`

### **Production Deployment**

**Backend:**

- Deploy Flask to: Heroku, AWS Lambda, Google Cloud Run, Azure Functions
- Add environment variables for API keys

**Frontend:**

- Build: `npm run build`
- Deploy to: Vercel, Netlify, GitHub Pages

**Example (Heroku):**

```bash
# In backend/
echo "web: python app.py" > Procfile
git init
heroku create pharmagent-backend
git push heroku main
```

Update frontend fetch URL to: `https://pharmagent-backend.herokuapp.com/api/research`

---

## 🎓 Learning Resources

- **LangGraph Docs:** https://langchain-ai.github.io/langgraph/
- **Flask Tutorial:** https://flask.palletsprojects.com/
- **DuckDuckGo Search:** https://pypi.org/project/duckduckgo-search/
- **CORS in Flask:** https://flask-cors.readthedocs.io/

---

## 🐛 Debugging Tips

**Enable verbose logging in backend:**

```python
# In agent_graph.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Check backend health:**

```bash
curl http://127.0.0.1:5000/health
```

**View React network requests:**

- Open browser DevTools → Network tab
- Send a query
- Check the `/api/research` request/response

---

## ✅ Verification Checklist

Before demo/submission, verify:

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Search queries return real results
- [ ] Agent cards display correctly
- [ ] PDF download works
- [ ] Logs show in terminal visualizer
- [ ] No CORS errors in browser console

---

## 🎉 You're All Set!

You now have a **fully functional multi-agent AI system** with:
✅ Real-time web scraping  
✅ Multi-agent orchestration  
✅ Professional Flask API  
✅ React frontend integration

**Next Steps:**

1. Test with various drug names
2. Customize the search queries
3. Add more worker agents
4. Deploy to production

Good luck with your hackathon! 🚀
