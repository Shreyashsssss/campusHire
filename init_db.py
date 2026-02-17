from server.app import init_db, app, get_db
import sqlite3

# Ensure we are in the application context to use Flask's 'g' object?
# No, init_db() in app.py uses 'with app.app_context():' internally so it handles context.
# However, we need to make sure the path to DB is correct relative to execution.

print("Initializing database...")
try:
    # Run the initialization logic
    init_db()
    print("Database initialized and seeded successfully.")

    # Verify data
    with app.app_context():
        db = get_db()
        cursor = db.execute("SELECT * FROM users")
        users = cursor.fetchall()
        print(f"\nFound {len(users)} users in database:")
        for user in users:
            print(f"- {user['name']} ({user['email']}) - {user['role']}")

except Exception as e:
    print(f"Error initializing database: {e}")
