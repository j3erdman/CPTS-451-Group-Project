import sqlite3

# Step 1: Connect to the SQLite database (it will create a new database if it doesn't exist)
conn = sqlite3.connect('equipment.db')

# Step 2: Create a cursor object to interact with the database
cursor = conn.cursor()

# Step 4: Insert data into the table
cursor.execute('''
INSERT INTO Reservation (ReservationDate, Status, EquipmentID, UserID, AdminID) 
VALUES ('2000-10-17', True, 1, 4, 1)
''')

# Step 5: Commit the transaction to save the data
conn.commit()

# Step 6: Optionally, fetch data to verify
cursor.execute('SELECT * FROM Reservation')
print(cursor.fetchall())

# Step 7: Close the connection
conn.close()
