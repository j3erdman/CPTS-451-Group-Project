from flask import Flask, request, jsonify

from Database import database

app = Flask(__name__)

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

    if result is None or result != password:
        output = jsonify({"message": "Invalid email or password"})
        num = 401
    else:
        output = jsonify({"message": "Login successful!"})
        num = 200

    cur.close()
    database.close_db(db)

    return output, num


@app.route('/register')
def register():
    data = request.get_json()

    # get the username and password
    email = data.get('email')
    password = data.get('password')

    # add it to the database and create a new user in the table

if __name__ == '__main__':
    app.run(debug=True)