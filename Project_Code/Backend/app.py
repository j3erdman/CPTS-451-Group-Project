from flask import Flask, request, jsonify
from flask_cors import CORS

from Database import database

app = Flask(__name__)
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

    # then validate if the user is in the database or if the password matches the user
    cur.execute("SELECT password FROM User WHERE email == (?)", (email,))
    result = cur.fetchone()
    result = result[0]

    if result is None or result != password:
        output = jsonify({"message": "Invalid email or password"})
        num = 401
    else:
        output = jsonify({"message": "Login successful!"})
        num = 200

    cur.close()
    database.close_db(db)

    return output, num

# add it to the database and create a new user in the table
@app.route('/register')
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
    database.close_db()

    return jsonify({"message": "Register successful!"}), 200

if __name__ == '__main__':
    app.run(debug=True)