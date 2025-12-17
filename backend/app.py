from flask import Flask, request, jsonify
from flask_cors import CORS
from agent_graph import run_research_workflow
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/research', methods=['POST'])
def research():
    """
    Main research endpoint that orchestrates the multi-agent workflow.
    
    Expected JSON body:
    {
        "prompt": "Analyze Gefitinib for Glioblastoma"
    }
    
    Returns:
    {
        "success": true,
        "drug": "Gefitinib",
        "indication": "Glioblastoma",
        "patent": {...},
        "trials": {...},
        "market": {...},
        "synthesis": "...",
        "logs": [...]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing "prompt" field in request body'
            }), 400
        
        user_prompt = data['prompt']
        
        # Run the LangGraph multi-agent workflow
        result = run_research_workflow(user_prompt)
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in /api/research: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'PharmAgent Backend'}), 200

if __name__ == '__main__':
    print("=" * 60)
    print("🧪 PharmAgent Backend Server")
    print("=" * 60)
    print("Server starting on http://127.0.0.1:5000")
    print("Endpoints:")
    print("  POST /api/research - Main research endpoint")
    print("  GET  /health       - Health check")
    print("=" * 60)
    print("\n⚠️  Note: This uses DuckDuckGo search which is free but slower.")
    print("    Each query takes 10-20 seconds to complete.\n")
    
    app.run(host='127.0.0.1', port=5000, debug=True)
