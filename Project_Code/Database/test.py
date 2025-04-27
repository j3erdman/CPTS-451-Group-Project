import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('equipment.db')
cursor = conn.cursor()

# Select all rows from Reservation
cursor.execute('SELECT * FROM Reservation')

# Fetch all results
rows = cursor.fetchall()

# Print each row
for row in rows:
    print(row)

# Close the connection
conn.close()
