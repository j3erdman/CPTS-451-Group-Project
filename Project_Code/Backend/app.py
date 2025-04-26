from flask import Flask, request, jsonify, session
from flask_cors import CORS

from Database import database

import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)

@app.route('/')
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if data is None:
        return jsonify({'message': 'No data found'}), 400
    db = database.get_db()
    cur = db.cursor()

    # get the username and password
    email = data.get('email')
    password = data.get('password')

    # validate input
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    # validate if user is in User or if password matches user, also extract UserID
    cur.execute("SELECT UserID, password FROM User WHERE email == (?)", (email,))
    result = cur.fetchone()
    UserType = "User"
    
    # If not found in User, check Admin table
    if result is None:  
            cur.execute("SELECT AdminID, password FROM Admin WHERE email == (?)", (email,))
            result = cur.fetchone()
            UserType = "Admin"
            
            # If not found in Admin, check Supplier table
            if result is None:
                cur.execute("SELECT SupplierID, password FROM Supplier WHERE email == (?)", (email,))
                result = cur.fetchone()
                UserType = "Supplier"

    if result is None or result[1] != password:
        output = jsonify({"message": "Invalid email or password"})
        num = 401
    else:
        UserID = result[0]
        session['UserID'] = UserID
        output = jsonify({"message": "Login successful!", "UserID": UserID, "UserType": UserType})
        num = 200

    cur.close()
    database.close_db(db)

    return output, num

# add it to the database and create a new user in the table
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if data is None:
        return jsonify({'message': 'No data found'}), 400

    db = database.get_db()
    cur = db.cursor()

    # get the username and password
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({'message': 'Email, name, and password are required'}), 400
    
    # otherwise the forms are filled and we add it to the database
    cur.execute("INSERT INTO User (Name, Email, Password) VALUES(?, ?, ?);", (name, email, password,))
    db.commit()

    cur.close()
    database.close_db(db)

    return jsonify({"message": "Register successful!"}), 200
    

@app.route('/home')
def home():
    data = request.get_json()

@app.route('/equipment')
def equipment():
    db = database.get_db()
    cur = db.cursor()

    try:
        cur.execute('''
            SELECT
                e.EquipmentID as EquipmentID,
                e.Part as Part,
                e.Status as Status,
                e.SupplierID as SupplierID,
                e.UserID as UserID,
                u.Name as UserName,
                s.Name as SupplierName
            FROM Equipment e
            LEFT JOIN User u ON e.UserID = u.UserID
            LEFT JOIN Supplier s on e.SupplierID = s.SupplierID;
        ''')
        equipment_data = cur.fetchall()

        # Convert the data to a list of dictionaries
        equipment_list = []
        for row in equipment_data:
            equipment_list.append({
                'EquipmentID': row[0],
                'Part': row[1],
                'Status': 'Available' if row[2] == 0 else 'Not Available',
                'SupplierID': row[3],
                'UserID': row[4],
                'UserName': row[5],
                'SupplierName': row[6],
                'DetailsLink' : f"/equipment/{row[0]}"
            })

        return jsonify(equipment_list), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        cur.close()
        database.close_db(db)


@app.route('/equipment/<int:equipment_id>', methods=['GET'])
def equipment_details(equipment_id):
    db = database.get_db()
    cur = db.cursor()

    try:
        # Get the details of the specific equipment
        cur.execute('''
            SELECT
                e.EquipmentID as EquipmentID,
                e.Part as Part,
                e.Status as Status,
                e.SupplierID as SupplierID,
                e.UserID as UserID,
                u.Name as UserName,
                r.ReservationID as ReservationID,
                r.ReservationDate as ReservationDate,
                r.Status as ReservationStatus
            FROM Equipment e
            LEFT JOIN User u ON e.UserID = u.UserID
            LEFT JOIN Supplier s ON e.SupplierID = s.SupplierID
            LEFT JOIN Reservation r ON e.EquipmentID = r.EquipmentID
            WHERE e.EquipmentID = ?
        ''', (equipment_id,))

        equipment_data = cur.fetchone()
        
        if equipment_data is None:
            return jsonify({'message': 'Equipment not found'}), 404

        # Map the data into a more user-friendly format
        equipment_details = {
            'EquipmentID': equipment_data[0],
            'Part': equipment_data[1],
            'Status': 'Available' if equipment_data[2] == 0 else 'Not Available',
            'SupplierID': equipment_data[3],
            'UserID': equipment_data[4],
            'UserName': equipment_data[5] if equipment_data[5] else 'N/A',
            'ReservationID': equipment_data[6],
            'ReservationDate': equipment_data[7],
            'ReservationStatus': equipment_data[8]
        }

        return jsonify(equipment_details), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cur.close()
        database.close_db(db)

# function to create page that has json data of all available to reserve equipment
@app.route("/get_equipment", methods=['GET'])
def get_equipment():
    db = database.get_db()
    cur = db.cursor()

    # query to get the equipment that can be reserved
    try:
        query = """
            SELECT e.EquipmentID, e.Part
            FROM Equipment AS e
            LEFT OUTER JOIN Equipment_Reservation AS er 
            ON e.EquipmentID = er.EquipmentID
            LEFT OUTER JOIN Reservation as r
            ON er.ReservationID = r.ReservationID
            WHERE e.Status = TRUE AND (r.Status = FALSE OR r.Status IS NULL)
        """
        cur.execute(query)
        data = cur.fetchall()

        # format data into dictionary
        data_list = []
        for row in data:
            data_list.append(str(row[0]) + " " + str(row[1]))

        return jsonify(data_list), 200
      
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cur.close()
        database.close_db(db)


# add the reservation to the reservations list
@app.route("/submit_reservation", methods=['POST'])
def submit_reservation():
    db = database.get_db()
    cur = db.cursor()
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'message': 'No data found'}), 400

        option = data.get('option')
        date = data.get('date')

        # split the option into the equipmentID and the equipment name
        optionList = option.split(" ")
        equipmentID = optionList[0]
        equipment = optionList[1]

        # query to insert the reservations table
        query = """
        INSERT INTO Reservation (ReservationDate, Status, EquipmentID, UserID)
        VALUES (?, TRUE, ?, ?);
        """
        cur.execute(query, (date, equipmentID, session.get('UserID'),))
        db.commit()

        query = "INSERT INTO Equipment_Reservation (EquipmentID, ReservationID) VALUES (?, ?)"
        cur.execute(query, (equipmentID, cur.lastrowid,))
        db.commit()

        return jsonify({"message": "Reservation created!"}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        cur.close()
        database.close_db(db)


@app.route('/api/account/<user_type>/<int:user_id>', methods=['GET', 'PUT'])
def account_info(user_type, user_id):
    if user_id is None:
        return jsonify({'message': 'User ID is required'}), 400

    db = database.get_db()
    cur = db.cursor()

    if request.method == 'GET':
        # Use to map from user type to table and id name
        table_map = {
            'User': ('User', 'UserID'),
            'Admin': ('Admin', 'AdminID'),
            'Supplier': ('Supplier', 'SupplierID')
        }
        
        table, id_col = table_map[user_type]
        
        # Fetch Name and Email from appropriate table based on UserID
        query = f"SELECT Name, Email, Password FROM {table} WHERE {id_col} = ?"
        cur.execute(query, (user_id,))
        user_data = cur.fetchone()
        
        # Check if user was found
        if user_data is None:
            return jsonify({'message': 'User not found'}), 404

        output = jsonify({
            "Name": user_data[0],
            "Email": user_data[1],
            "Password": user_data[2]
        })
        num = 200

        cur.close()
        database.close_db(db)

        return output, num

    elif request.method == 'PUT':
        # Update user information
        data = request.json
        new_name = data.get('Name')
        new_email = data.get('Email')
        new_password = data.get('Password')

        if not new_name or not new_email or not new_password:
            return jsonify({'message': 'Name, Email, and Password are required'}), 400
        
        # Use to map from user type to table and id name
        table_map = {
            'User': ('User', 'UserID'),
            'Admin': ('Admin', 'AdminID'),
            'Supplier': ('Supplier', 'SupplierID')
        }
        
        table, id_col = table_map[user_type]
        
        # Check if user exists
        query_check = f"SELECT {id_col} FROM {table} WHERE {id_col} = ?"
        cur.execute(query_check, (user_id,))
        user_exists = cur.fetchone()

        if not user_exists:
            return jsonify({'message': 'User not found'}), 404

        # Update user info
        query_update = f"UPDATE {table} SET Name = ?, Email = ?, Password = ? WHERE {id_col} = ?"
        cur.execute(query_update, (new_name, new_email, new_password, user_id))

        db.commit()
        cur.close()
        database.close_db(db)

        return jsonify({'message': 'Account updated successfully'}), 200

@app.route('/api/account_reservations/<int:user_id>', methods=['GET', 'DELETE'])
def account_reservations(user_id):
    if user_id is None:
        return jsonify({'message': 'User ID is required'}), 400
    
    db = database.get_db()
    cur = db.cursor()

    if request.method == 'GET':
        try:
            # Modify the query to include the `status` field
            cur.execute("""
                SELECT r.ReservationID, r.ReservationDate, e.Part, r.Status
                FROM Reservation r
                JOIN Equipment e ON r.EquipmentID = e.EquipmentID
                WHERE r.UserID = ?
            """, (user_id,))
            reservations = cur.fetchall()

            if not reservations:
                return jsonify([]), 200

            reservation_list = [{
                'ReservationID': row[0],
                'ReservationDate': row[1],
                'Part': row[2],
                'Status': row[3]  # Add the status field to the response
            } for row in reservations]

            return jsonify(reservation_list), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            cur.close()
            database.close_db(db)

    elif request.method == 'DELETE':
        try:
            # Assuming reservation_id is passed correctly in the request
            reservation_id = user_id  # In DELETE, we use this as the reservation ID
            # Update the status to false instead of deleting
            cur.execute("UPDATE Reservation SET Status = FALSE WHERE ReservationID = ?", (reservation_id,))
            db.commit()
            return jsonify({'message': 'Reservation canceled successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            cur.close()
            database.close_db(db)


@app.route('/api/reservations', methods=['GET'])
def get_all_reservations():
    db = database.get_db()
    cur = db.cursor()

    try:
        cur.execute('''
            SELECT r.ReservationID, r.ReservationDate, r.Status, u.Name AS UserName, e.Part AS Equipment
            FROM Reservation r
            JOIN User u ON r.UserID = u.UserID
            JOIN Equipment e ON r.EquipmentID = e.EquipmentID
        ''')
        reservations = cur.fetchall()

        # Convert data into a list of dictionaries
        reservation_list = [
            {
                "ReservationID": row[0],
                "ReservationDate": row[1],
                "Status": row[2],
                "UserName": row[3],
                "Equipment": row[4]
            }
            for row in reservations
        ]

        return jsonify(reservation_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cur.close()
        database.close_db(db)


@app.route('/api/add_equipment', methods=['POST'])
def add_equipment():
    data = request.get_json()
    part = data.get('Part')
    status = data.get('Status')
    supplier_id = data.get('SupplierID')
    user_id = data.get('UserID')
    if isinstance(status, bool):
        status = int(not status)
    elif isinstance(status, str):
        status = 0 if status.lower() == 'true' else 1
    else:
        status = 1

    if not part or status is None:
        return jsonify({'message': 'Part and Status are required.'}), 400

    db = database.get_db()
    cur = db.cursor()
    cur.execute(
        "INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES (?, ?, ?, ?)",
        (part, status, supplier_id, user_id)
    )
    
    db.commit()
    cur.close()
    database.close_db(db)
    return jsonify({'message': 'Equipment added successfully.'}), 200

if __name__ == '__main__':
    app.run(debug=True)