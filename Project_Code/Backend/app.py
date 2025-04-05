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
                u.Name as UserName
            FROM Equipment e
            LEFT JOIN User u ON e.UserID = u.UserID;
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
            FULL OUTER JOIN Reservation as r
            ON er.ReservationID = r.ReservationID
            WHERE e.Status = False AND (r.Status IS NULL OR r.Status = False)
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
        userID = data.get('UserID')

        # split the option into the equipmentID and the equipment name
        optionList = option.split(" ")
        equipmentID = optionList[0]
        equipment = optionList[1]

        # query to insert the reservations table
        query = """
        INSERT INTO Reservation (ReservationDate, Status, EquipmentID, UserID)
        VALUES (?, TRUE, ?, ?);
        """
        print(userID)
        cur.execute(query, (date, equipmentID, userID,))
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


@app.route('/api/account/<int:user_id>', methods=['GET', 'PUT'])
def account_info(user_id):
    if user_id is None:
        return jsonify({'message': 'User ID is required'}), 400

    db = database.get_db()
    cur = db.cursor()

    if request.method == 'GET':
        # Fetch Name and Email from User table based on UserID
        cur.execute("SELECT Name, Email, Password FROM User WHERE UserID = ?", (user_id,))
        user_data = cur.fetchone()
        
        # Check if user was found
        if user_data is None:
            # If not, check admin table
            cur.execute("SELECT Name, Email, Password FROM Admin WHERE AdminID = ?", (user_id,))
            user_data = cur.fetchone()
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

        # Check if user exists in User table
        cur.execute("SELECT UserID FROM User WHERE UserID = ?", (user_id,))
        user_exists = cur.fetchone()

        if user_exists:
            cur.execute("UPDATE User SET Name = ?, Email = ?, Password = ? WHERE UserID = ?",
                        (new_name, new_email, new_password, user_id))
        else:
            # Check if user exists in Admin table
            cur.execute("SELECT AdminID FROM Admin WHERE AdminID = ?", (user_id,))
            admin_exists = cur.fetchone()

            if admin_exists:
                cur.execute("UPDATE Admin SET Name = ?, Email = ?, Password = ? WHERE AdminID = ?",
                            (new_name, new_email, new_password, user_id))
            else:
                return jsonify({'message': 'User not found'}), 404

        db.commit()
        cur.close()
        database.close_db(db)

        return jsonify({'message': 'Account updated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)