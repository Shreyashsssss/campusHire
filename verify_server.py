from server.app import app
import json

def test_login():
    print("Testing Login Endpoint...")
    with app.test_client() as client:
        try:
            # Test Login
            response = client.post('/api/auth/login', 
                                 data=json.dumps({'email': 'shreyashnannaware236@gmail.com', 'role': 'student'}),
                                 content_type='application/json')
            
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print("Login Successful!")
                print("Response:", response.get_json())
            elif response.status_code == 401:
                print("Login Failed (Expected): 401 Unauthorized")
                print("Response:", response.get_json())
            else:
                print(f"Login Failed with Unexpected Status: {response.status_code}")
                # Important: Print the error data to see traceback
                print("Response Data:", response.get_data(as_text=True))
        except Exception as e:
            print(f"CRITICAL ERROR: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_login()
