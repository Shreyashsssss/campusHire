import sqlite3
import os

DATABASE = os.path.join(os.path.dirname(__file__), 'server/placement_portal.db')

def inspect_db():
    try:
        if not os.path.exists(DATABASE):
            print(f"Database file NOT found at {DATABASE}")
            return

        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        print("--- Table Info: users ---")
        columns = cursor.execute("PRAGMA table_info(users)").fetchall()
        col_names = [col['name'] for col in columns]
        print(f"Columns: {col_names}")
        
        print("\n--- Trying to find user: shreyashnannaware236@gmail.com ---")
        user = cursor.execute("SELECT * FROM users WHERE email = ?", ('shreyashnannaware236@gmail.com',)).fetchone()
        if user:
            print("User found!")
            print(dict(user))
        else:
            print("User NOT found in DB.")
            
        conn.close()
    except Exception as e:
        print(f"Error inspecting DB: {e}")

if __name__ == "__main__":
    inspect_db()
