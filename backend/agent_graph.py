"""
PharmAgent Multi-Agent Research Workflow using LangGraph

This module implements a StateGraph-based multi-agent system that:
1. Parses user queries to extract drug names
2. Delegates research to specialized worker agents (Market, Patent, Clinical)
3. Uses DuckDuckGo search for real-time web data
4. Synthesizes findings into a comprehensive report
"""

from typing import TypedDict, List, Annotated
import re
from datetime import datetime
from langchain_community.tools import DuckDuckGoSearchRun
from langgraph.graph import StateGraph, END
import operator

# Initialize DuckDuckGo search tool (free, no API key required)
search = DuckDuckGoSearchRun()

# Define the state that will be passed between nodes
class ResearchState(TypedDict):
    """State object that flows through the graph"""
    prompt: str
    drug_name: str
    indication: str
    market_data: str
    patent_data: str
    clinical_data: str
    synthesis: str
    logs: Annotated[List[str], operator.add]
    error: str

def get_timestamp():
    """Helper to generate timestamps for logs"""
    return datetime.now().strftime("%H:%M:%S")

# ============================================================================
# MASTER NODE - Query Parser & Orchestrator
# ============================================================================

def master_node(state: ResearchState) -> ResearchState:
    """
    Master Node: Parses the user query and extracts drug name and indication.
    This node decides whether to proceed with research or return an error.
    """
    prompt = state.get('prompt', '')
    logs = state.get('logs', [])
    
    logs.append(f"[{get_timestamp()}] Master Agent: Analyzing query...")
    
    # Simple drug extraction (looks for capitalized words)
    # In production, use NER (Named Entity Recognition)
    words = prompt.split()
    drug_candidates = [w for w in words if w[0].isupper() and len(w) > 3]
    
    if drug_candidates:
        drug_name = drug_candidates[0]
        indication = "Unknown indication"  # Could be enhanced with better parsing
        
        logs.append(f"[{get_timestamp()}] Master Agent: Detected drug '{drug_name}'")
        logs.append(f"[{get_timestamp()}] Master Agent: Delegating to worker agents...")
        
        return {
            **state,
            'drug_name': drug_name,
            'indication': indication,
            'logs': logs
        }
    else:
        logs.append(f"[{get_timestamp()}] Master Agent: ERROR - No drug name detected in query")
        return {
            **state,
            'error': 'Could not identify a drug name in your query',
            'logs': logs
        }

# ============================================================================
# WORKER NODES - Specialized Research Agents
# ============================================================================

def market_worker(state: ResearchState) -> ResearchState:
    """
    Market Worker: Searches for market size, competition, and CAGR data.
    Uses DuckDuckGo to find real-time market information.
    """
    drug_name = state.get('drug_name', '')
    logs = state.get('logs', [])
    
    logs.append(f"[{get_timestamp()}] Market Agent: Searching market data...")
    
    try:
        # Perform web search
        query = f"{drug_name} market size pharmaceutical 2024"
        search_results = search.run(query)
        
        # Extract key insights (simplified)
        market_summary = f"Market research for {drug_name}:\n{search_results[:500]}..."
        
        logs.append(f"[{get_timestamp()}] Market Agent: ✓ Data retrieved successfully")
        
        return {
            **state,
            'market_data': market_summary,
            'logs': logs
        }
    except Exception as e:
        logs.append(f"[{get_timestamp()}] Market Agent: ⚠ Error - {str(e)}")
        return {
            **state,
            'market_data': f"Market data unavailable: {str(e)}",
            'logs': logs
        }

def patent_worker(state: ResearchState) -> ResearchState:
    """
    Patent Worker: Searches for patent information and expiry dates.
    Uses DuckDuckGo to find patent-related information.
    """
    drug_name = state.get('drug_name', '')
    logs = state.get('logs', [])
    
    logs.append(f"[{get_timestamp()}] Patent Agent: Searching patent data...")
    
    try:
        # Perform web search
        query = f"{drug_name} patent expiry pharmaceutical"
        search_results = search.run(query)
        
        # Extract key insights
        patent_summary = f"Patent research for {drug_name}:\n{search_results[:500]}..."
        
        logs.append(f"[{get_timestamp()}] Patent Agent: ✓ Data retrieved successfully")
        
        return {
            **state,
            'patent_data': patent_summary,
            'logs': logs
        }
    except Exception as e:
        logs.append(f"[{get_timestamp()}] Patent Agent: ⚠ Error - {str(e)}")
        return {
            **state,
            'patent_data': f"Patent data unavailable: {str(e)}",
            'logs': logs
        }

def clinical_worker(state: ResearchState) -> ResearchState:
    """
    Clinical Worker: Searches for clinical trial information.
    Uses DuckDuckGo to find trial data from ClinicalTrials.gov and other sources.
    """
    drug_name = state.get('drug_name', '')
    logs = state.get('logs', [])
    
    logs.append(f"[{get_timestamp()}] Clinical Agent: Searching clinical trial data...")
    
    try:
        # Perform web search
        query = f"{drug_name} clinical trials phase site:clinicaltrials.gov"
        search_results = search.run(query)
        
        # Extract key insights
        clinical_summary = f"Clinical trial research for {drug_name}:\n{search_results[:500]}..."
        
        logs.append(f"[{get_timestamp()}] Clinical Agent: ✓ Data retrieved successfully")
        
        return {
            **state,
            'clinical_data': clinical_summary,
            'logs': logs
        }
    except Exception as e:
        logs.append(f"[{get_timestamp()}] Clinical Agent: ⚠ Error - {str(e)}")
        return {
            **state,
            'clinical_data': f"Clinical data unavailable: {str(e)}",
            'logs': logs
        }

# ============================================================================
# SYNTHESIZER NODE - Final Report Generation
# ============================================================================

def synthesizer_node(state: ResearchState) -> ResearchState:
    """
    Synthesizer: Combines all worker outputs into a final strategic report.
    In production, this would use an LLM (GPT-4) for better synthesis.
    """
    logs = state.get('logs', [])
    drug_name = state.get('drug_name', '')
    
    logs.append(f"[{get_timestamp()}] Synthesizer: Generating strategic report...")
    
    # Combine all data sources
    synthesis = f"""**Strategic Analysis: {drug_name}**

## Market Intelligence
{state.get('market_data', 'No market data available')}

## Patent Landscape
{state.get('patent_data', 'No patent data available')}

## Clinical Pipeline
{state.get('clinical_data', 'No clinical data available')}

## Recommendation
Based on the available data, {drug_name} shows potential for repurposing or continued development. 
Further due diligence is recommended for specific indications.

---
*Report generated by PharmAgent Multi-Agent System*
"""
    
    logs.append(f"[{get_timestamp()}] Synthesizer: ✓ Report complete")
    
    return {
        **state,
        'synthesis': synthesis,
        'logs': logs
    }

# ============================================================================
# BUILD THE GRAPH
# ============================================================================

def build_research_graph():
    """
    Constructs the StateGraph for the multi-agent research workflow.
    
    Flow:
    START → Master → Market Worker → Patent Worker → Clinical Worker → Synthesizer → END
    """
    workflow = StateGraph(ResearchState)
    
    # Add nodes
    workflow.add_node("master", master_node)
    workflow.add_node("market_worker", market_worker)
    workflow.add_node("patent_worker", patent_worker)
    workflow.add_node("clinical_worker", clinical_worker)
    workflow.add_node("synthesizer", synthesizer_node)
    
    # Define edges (sequential flow)
    workflow.set_entry_point("master")
    workflow.add_edge("master", "market_worker")
    workflow.add_edge("market_worker", "patent_worker")
    workflow.add_edge("patent_worker", "clinical_worker")
    workflow.add_edge("clinical_worker", "synthesizer")
    workflow.add_edge("synthesizer", END)
    
    return workflow.compile()

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

def run_research_workflow(prompt: str) -> dict:
    """
    Main entry point called by Flask app.
    
    Args:
        prompt: User query (e.g., "Analyze Gefitinib for cancer")
    
    Returns:
        Dictionary with research results and logs
    """
    print(f"\n{'='*60}")
    print(f"🔬 Starting Research Workflow")
    print(f"{'='*60}")
    print(f"Query: {prompt}\n")
    
    # Initialize state
    initial_state = {
        'prompt': prompt,
        'drug_name': '',
        'indication': '',
        'market_data': '',
        'patent_data': '',
        'clinical_data': '',
        'synthesis': '',
        'logs': [],
        'error': ''
    }
    
    # Build and run the graph
    graph = build_research_graph()
    final_state = graph.invoke(initial_state)
    
    # Check for errors
    if final_state.get('error'):
        print(f"\n❌ Workflow failed: {final_state['error']}\n")
        return {
            'success': False,
            'error': final_state['error'],
            'logs': final_state.get('logs', [])
        }
    
    # Format response for frontend
    response = {
        'success': True,
        'drug': final_state['drug_name'],
        'indication': final_state.get('indication', 'Unknown'),
        'patent': {
            'summary': final_state['patent_data'],
            'id': 'Retrieved from web search',
            'expiry': 'See summary',
            'fto': 'Requires legal review'
        },
        'trials': {
            'summary': final_state['clinical_data'],
            'count': 'Multiple trials found',
            'phase': 'Various phases',
            'indication': final_state.get('indication', 'Unknown')
        },
        'market': {
            'summary': final_state['market_data'],
            'size': 'See summary',
            'competition': 'Varies by indication',
            'cagr': 'See market analysis'
        },
        'synthesis': final_state['synthesis'],
        'logs': final_state.get('logs', [])
    }
    
    print(f"\n✅ Workflow completed successfully")
    print(f"{'='*60}\n")
    
    return response

# ============================================================================
# TEST FUNCTION (for local testing)
# ============================================================================

if __name__ == "__main__":
    # Test the workflow directly
    test_prompt = "Analyze Gefitinib for cancer treatment"
    result = run_research_workflow(test_prompt)
    
    print("\n" + "="*60)
    print("FINAL RESULT:")
    print("="*60)
    print(f"Success: {result['success']}")
    print(f"Drug: {result.get('drug', 'N/A')}")
    print(f"\nSynthesis:\n{result.get('synthesis', 'N/A')}")
    print("\nLogs:")
    for log in result.get('logs', []):
        print(f"  {log}")
