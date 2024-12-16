from datetime import datetime, timedelta
from database import UserDatabase, RoleDatabase, LogDatabase
from schema import User, Employee, Admin, Role


userDB = UserDatabase()
roleDB = RoleDatabase()
logDB = LogDatabase()


def getUser(username):
    user = userDB.GetUser({"username": username})
    latest_log = logDB.GetLatestLog(user)
    if not latest_log:
        user.timeLogs = [None, None]
        return user
    user.timeLogs[0] = latest_log["clockIn"]
    user.timeLogs[1] = latest_log["clockOut"]
    return user


def getAllUsers():
    return userDB.GetDictList()


def clockIn(username):
    # Operation to record a clock-in for an employee
    user = getUser(username)
    clockInTime = datetime.now().strftime("%H:%M:%S")
    user.timeLogs[0] = clockInTime
    user.timeLogs[1] = None
    print("Before database")
    print(user.username)
    logDB.updateLog(user)
    return "Clocked in successfully!"


def clockOut(username):
    # Operation to record a clock-out for an employee
    user = getUser(username)
    clockOutTime = datetime.now().strftime("%H:%M:%S")
    if user.timeLogs[0] is None:
        return "Error: User is not clocked in!"
    user.timeLogs = [user.timeLogs[0], clockOutTime]
    logDB.updateLog(user)  # Save clockOutTime to database
    user.timeLogs = [None, None]
    return "Clocked out successfully!"


def logIn(username, password):
    user = userDB.GetUser({"username": username})
    if not user or user.password != password:
        print("Invalid username or password")
        return False
    print("Valid username and password")
    return user


def save(user: User):
    # Update user data to the database

    userDB.UpdateUser({"username": user.username})


def createRole(roleName, payRate):
    # Operation to create a new role
    oldRole = roleDB.GetRole({"name": roleName})
    if oldRole:
        return f"Error: Role '{roleName}' already exists!"

    newRole = Role(roleName, payRate)
    roleDB.CreateRole(newRole)
    return newRole


def createEmployee(username, password, name, roleName, payRate, admin):
    # Operation to create a new employee
    role = roleDB.GetRole({"name": roleName})
    if not role:
        role = createRole(roleName, float(payRate))
    if admin is True:
        admin = Admin(username, password, name, role, float(payRate))
        return userDB.CreateAdmin(admin)

    employee = Employee(username, password, name, role, float(payRate))
    userDB.CreateEmployee(employee)


# In Progress
def modifyEmployee(
    id: str,
    username: str,
    password: str,
    name: str,
    roleName: str,
    payRate: int,
    admin: str,
):
    # Operation to modify an existing employee
    if id == "-1":
        if userDB.GetUser({"username": username}):
            return f"Error: User '{username}' already exists!"
        createEmployee(username, password, name, roleName, payRate, admin)
        return
    # Find employee in the database based on username input
    employee = userDB.GetUser({"_id": id})

    # Check if the username is already a user in the database
    if username is not None:
        employee.username = username

    # Check if the roleName exist in the Role database
    if roleName is not None:
        role = roleDB.GetRole({"name": roleName})
        if not role:
            createRole(roleName, payRate)

    # Update username if one is provided
    if username is not None:
        employee.username = username

    # Update password if one is provided
    if password is not None:
        employee.password = password

    # Update name if one is provided
    if name is not None:
        employee.name = name

    # Update role if one is provided
    if roleName is not None:
        employee.role = role

    # Update payRate if one is provided
    if payRate is not None:
        employee.payRate = payRate

    userDB.UpdateUser({"_id": id}, employee)
