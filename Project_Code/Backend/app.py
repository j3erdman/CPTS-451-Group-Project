from flask import Flask, request, jsonify

app = Flask(__name__)

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
    data = request.get_json()

    # get the username and password
    email = data.get('email')
    password = data.get('password')

    # add it to the database and create a new user in the table

if __name__ == '__main__':
    app.run(debug=True)