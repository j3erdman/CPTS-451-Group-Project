from flask import Flask, request, jsonify
import atexit

from Database import database

app = Flask(__name__)

@app.route('/')
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # get the username and password
    email = data.get('email')
    password = data.get('password')

    # validate input
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    # then validate if the user is in the database or if the password matches the user

@app.route('/register')
def register():
    data = request.get_json()

    # get the username and password
    email = data.get('email')
    password = data.get('password')

    # add it to the database and create a new user in the table

# open the database connection when flask is opened
@app.before_first_request
def start_database():
    database.get_db()
    print("database open")

# close the database connections when flask is closed
def close_database():
    database.close_db()
    print("database closed")

atexit.register(close_database)

if __name__ == '__main__':
    app.run(debug=True)