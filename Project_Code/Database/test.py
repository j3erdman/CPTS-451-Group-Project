import sqlite3

# Connect to the database (change the file path as necessary)
conn = sqlite3.connect('equipment.db')
cursor = conn.cursor()

# Fetch all data from a specific table
cursor.execute("SELECT * FROM Reservation;")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
