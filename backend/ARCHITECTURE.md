# PharmAgent Architecture - Real Backend

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                    (React + TypeScript)                         │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │  Chat UI   │  │  Agent     │  │  Terminal  │               │
│  │ Interface  │  │ Visualizer │  │    Logs    │               │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘               │
│        │                │                │                       │
└────────┼────────────────┼────────────────┼───────────────────────┘
         │                │                │
         │ HTTP POST /api/research         │
         ▼                                 │
┌─────────────────────────────────────────┼───────────────────────┐
│               FLASK BACKEND (Python)    │                       │
│                                         │                       │
│  ┌──────────────────────────────────────▼─────────────────┐   │
│  │                app.py                                    │   │
│  │  • CORS enabled                                          │   │
│  │  • POST /api/research endpoint                           │   │
│  │  • Error handling & logging                              │   │
│  └─────────────────────┬────────────────────────────────────┘   │
│                        ▼                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              agent_graph.py                               │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │          LangGraph StateGraph                      │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌──────────────┐                                  │  │  │
│  │  │  │ Master Node  │  Parse query, extract drug      │  │  │
│  │  │  └──────┬───────┘                                  │  │  │
│  │  │         │                                           │  │  │
│  │  │         ├──────────────┬──────────────┬───────────┤  │  │
│  │  │         ▼              ▼              ▼           │  │  │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │  │
│  │  │  │   Market   │ │   Patent   │ │  Clinical  │   │  │  │
│  │  │  │   Worker   │ │   Worker   │ │   Worker   │   │  │  │
│  │  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘   │  │  │
│  │  │        │               │               │          │  │  │
│  │  │        └───────────────┴───────────────┘          │  │  │
│  │  │                        │                           │  │  │
│  │  │                        ▼                           │  │  │
│  │  │                 ┌────────────┐                    │  │  │
│  │  │                 │ Synthesizer│                    │  │  │
│  │  │                 │    Node    │                    │  │  │
│  │  │                 └────────────┘                    │  │  │
│  │  │                                                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                        │                                   │  │
│  └────────────────────────┼───────────────────────────────────┘  │
│                           ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          DuckDuckGoSearchRun                              │   │
│  │  • Free, no API key required                              │   │
│  │  • Searches: Market data, Patents, Clinical trials        │   │
│  └─────────────────────┬────────────────────────────────────┘   │
└────────────────────────┼──────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │      LIVE WEB (DuckDuckGo)         │
        │  • Market intelligence websites    │
        │  • Patent databases (USPTO, etc.)  │
        │  • ClinicalTrials.gov              │
        │  • PubMed, FDA, WHO                │
        └────────────────────────────────────┘
```

## Data Flow

### 1. User Query

```
User types: "Analyze Gefitinib for cancer"
   ↓
React calls: POST http://127.0.0.1:5000/api/research
   ↓
Flask receives: { "prompt": "Analyze Gefitinib for cancer" }
```

### 2. LangGraph Workflow

```
Master Node extracts: drug="Gefitinib"
   ↓
Parallel Worker Execution:
   ├─ Market Worker: Search "Gefitinib market size 2024"
   ├─ Patent Worker: Search "Gefitinib patent expiry"
   └─ Clinical Worker: Search "Gefitinib clinical trials"
   ↓
Each worker returns: ~500 chars of search results
   ↓
Synthesizer combines all data into report
```

### 3. Response

```
Flask returns JSON:
{
  "success": true,
  "drug": "Gefitinib",
  "indication": "Unknown",
  "patent": { "summary": "...", "id": "...", ... },
  "trials": { "summary": "...", "count": "...", ... },
  "market": { "summary": "...", "size": "...", ... },
  "synthesis": "**Strategic Analysis...**",
  "logs": ["[12:00:00] Master Agent: ...", ...]
}
   ↓
React displays:
   ├─ Agent cards with status animations
   ├─ Terminal logs
   └─ Final synthesis with Download PDF button
```

## File Structure

```
pharmagent-discovery/
│
├── backend/                    ← NEW PYTHON BACKEND
│   ├── app.py                  # Flask server (port 5000)
│   ├── agent_graph.py          # LangGraph StateGraph
│   ├── requirements.txt        # Python dependencies
│   └── README_BACKEND.md       # Full documentation
│
├── src/
│   ├── pages/
│   │   └── Index.tsx           # MODIFIED: Now calls real API
│   ├── components/
│   │   ├── ChatInterface.tsx   # (Unchanged)
│   │   ├── AgentVisualizer.tsx # (Unchanged)
│   │   └── ...
│   └── data/
│       └── drugDatabase.ts     # DEPRECATED: No longer used
│
├── QUICKSTART.md               ← Quick setup guide
└── package.json
```

## Key Technologies

| Component        | Technology         | Purpose                          |
| ---------------- | ------------------ | -------------------------------- |
| Frontend         | React + TypeScript | User interface                   |
| Backend          | Flask (Python)     | REST API server                  |
| Orchestration    | LangGraph          | Multi-agent workflow             |
| Search           | DuckDuckGo         | Free web search (no API key)     |
| State Management | StateGraph         | Pass data between agents         |
| Networking       | fetch() API        | Frontend ↔ Backend communication |
| CORS             | flask-cors         | Allow cross-origin requests      |

## Advantages of Real Backend

✅ **Live Data**: Real-time web searches  
✅ **No Mock Data**: Actual information from the web  
✅ **Scalable**: Can add more data sources  
✅ **Professional**: Industry-standard architecture  
✅ **Extensible**: Easy to add LLMs (GPT-4, etc.)  
✅ **Realistic**: True multi-agent system

## Limitations

⚠️ **Slower**: 20-30 seconds per query (vs 3 seconds for mock)  
⚠️ **Rate Limits**: DuckDuckGo may throttle requests  
⚠️ **Quality**: Search results vary in quality  
⚠️ **No LLM**: Synthesis is template-based (not AI-generated)

## Future Enhancements

1. **Add OpenAI GPT-4** for better synthesis
2. **Use real APIs** (ClinicalTrials.gov, USPTO, PubMed)
3. **Caching** to avoid repeated searches
4. **Async workers** for parallel execution
5. **Database** to store research history
6. **User authentication** for saved sessions

---

**Built for PharmAgent Hackathon** 🚀
