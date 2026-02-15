import requests
import json
import sys

URL = "http://127.0.0.1:5001/api/auth/login"

def check_server():
    print(f"Checking Live Server at {URL}...")
    try:
        response = requests.post(URL, 
                               json={'email': 'rahul@college.edu', 'role': 'student'},
                               headers={'Content-Type': 'application/json'},
                               timeout=5)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")
        try:
            print(f"Response Body: {response.json()}")
        except:
            print(f"Response Text: {response.text}")
            
        if response.status_code == 200:
            print("SUCCESS: Live verify passed!")
        else:
            print("FAILURE: Server returned error or unexpected status.")
            
    except requests.exceptions.ConnectionError:
        print("CRITICAL FAILURE: Connection Refused. The server is NOT running on port 5001.")
        print("Suggestion: Stop all terminals and run 'npm run dev' again.")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check_server()
