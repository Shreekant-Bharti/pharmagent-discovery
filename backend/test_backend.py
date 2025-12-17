"""
Quick test script to verify the backend is working correctly.
Run this AFTER starting the Flask server.

Usage:
    python test_backend.py
"""

import requests
import json
import sys

BACKEND_URL = "http://127.0.0.1:5000"

def test_health():
    """Test the health endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed!")
            print(f"   Status: {data.get('status')}")
            print(f"   Service: {data.get('service')}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed!")
        print("   Make sure Flask is running: python backend/app.py")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_research():
    """Test the research endpoint"""
    print("\n" + "="*60)
    print("TEST 2: Research Endpoint")
    print("="*60)
    
    test_query = "Analyze Gefitinib for cancer treatment"
    print(f"Query: {test_query}")
    print("⏳ This will take 20-30 seconds (real web search)...\n")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/research",
            json={"prompt": test_query},
            timeout=60  # Allow up to 60 seconds
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                print("✅ Research endpoint passed!")
                print(f"\n📊 Results:")
                print(f"   Drug: {data.get('drug')}")
                print(f"   Indication: {data.get('indication')}")
                print(f"\n   Patent data: {len(data.get('patent', {}).get('summary', ''))} chars")
                print(f"   Market data: {len(data.get('market', {}).get('summary', ''))} chars")
                print(f"   Clinical data: {len(data.get('trials', {}).get('summary', ''))} chars")
                print(f"\n   Synthesis: {len(data.get('synthesis', ''))} chars")
                print(f"   Logs: {len(data.get('logs', []))} entries")
                
                print(f"\n📝 Sample from synthesis:")
                synthesis = data.get('synthesis', '')
                print(f"   {synthesis[:200]}...")
                
                return True
            else:
                print(f"❌ Research failed: {data.get('error')}")
                return False
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out!")
        print("   This might happen if DuckDuckGo is slow.")
        print("   Try running the test again.")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("🧪 PharmAgent Backend Test Suite")
    print("="*60)
    print("\n⚠️  Make sure Flask is running before running this test!")
    print("   Terminal 1: cd backend && python app.py")
    print("   Terminal 2: python backend/test_backend.py")
    
    # Test 1: Health
    health_passed = test_health()
    
    if not health_passed:
        print("\n" + "="*60)
        print("❌ Backend is not running. Start it with: python backend/app.py")
        print("="*60)
        sys.exit(1)
    
    # Test 2: Research
    research_passed = test_research()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    print(f"Health Check:      {'✅ PASS' if health_passed else '❌ FAIL'}")
    print(f"Research Endpoint: {'✅ PASS' if research_passed else '❌ FAIL'}")
    
    if health_passed and research_passed:
        print("\n🎉 All tests passed! Backend is ready.")
        print("\nNext step: Start frontend with 'npm run dev'")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
