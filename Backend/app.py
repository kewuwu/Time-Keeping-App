from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

import logic
from schema import Admin, Employee, User

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests
import json

tempUser = None


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    print(username, password)
    user = logic.logIn(username, password)
    if user is False:
        return {"message": "Invalid username or password"}, 401
    if isinstance(user, Admin):
        return {
            "message": "Login Successful",
            "userType": "admin",
            "username": username,
        }, 200
    elif isinstance(user, Employee):
        print("Employee")
        return {
            "message": "Login Successful",
            "userType": "employee",
            "username": username,
        }, 200


@app.route("/clock/<string:username>", methods=["GET"])
def getClockState(username):
    user = logic.getUser(username)
    if user.timeLogs[0] and user.timeLogs[1]:
        return jsonify({"clockIn": None, "clockOut": None}), 200
    return jsonify({"clockIn": user.timeLogs[0], "clockOut": user.timeLogs[1]}), 200


@app.route("/clock", methods=["POST", "PUT"])
def postClock():
    data = request.get_json()
    if data.get("clockIn") is not None:
        return logic.clockIn(data["username"])
    else:
        return logic.clockOut(data["username"])


if __name__ == "__main__":
    app.run(debug=True)


@app.route("/admin", methods=["GET"])
def getAdmin():
    return jsonify(logic.getAllUsers()), 200


@app.route("/admin", methods=["POST"])
def postAdmin():
    data = request.get_json()
    id = data["_id"]
    if id is None:
        id - 0
    username = data["username"]
    password = data["password"]
    name = data["name"]
    role = data["role"]
    payrate = data["payrate"]
    admin = data["admin"]
    print(data)
    ex = logic.modifyEmployee(id, username, password, name, role, payrate, admin)
    return jsonify(ex), 200
