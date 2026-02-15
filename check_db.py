import sqlite3
import json

db_path = 'server/placement_portal.db'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("\n--- Users ---")
    cursor.execute("SELECT id, name, email, role, cgpa FROM users")
    for row in cursor.fetchall():
        print(row)

    print("\n--- Drives ---")
    cursor.execute("SELECT id, companyName, title, ctc FROM drives")
    for row in cursor.fetchall():
        print(row)

    print("\n--- Applications ---")
    cursor.execute("SELECT id, studentId, driveId, status FROM applications")
    for row in cursor.fetchall():
        print(row)

    conn.close()
except Exception as e:
    print(f"Error reading database: {e}")
