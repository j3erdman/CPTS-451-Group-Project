from flask import Flask, request, jsonify, session
from flask_cors import CORS
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
                'UserName': row[5] # if row[4] is not None else None
            })
            
        print(equipment_list)

        return jsonify(equipment_list), 200
    
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

if __name__ == '__main__':
    app.run(debug=True)