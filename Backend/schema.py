class User:
    # This class stores information for a generic user no matter the role
    def __init__(self, username, password, name, role, payRate):
        self.username = username
        self.password = password
        self.name = name
        self.role = role
        self.payRate = max(payRate, role.payRate)
        # self.id = id ## Connect with DB to get an ID
        self.timeLogs = [None, None]  # stores id and time

    def jsonify(self):
        return {
            "username": self.username,
            "name": self.name,
            "role": self.role.jsonify(),
            "payRate": self.payRate,
            "timeLogs": self.timeLogs,
        }


class Employee(User):
    # This class stores information for an employee (inherites User) and handles the logic to clocking in and out and calculating weekly pay
    def __init__(self, username, password, name, role, payRate):
        super().__init__(username, password, name, role, payRate)


class Admin(User):
    # This class stores information for an admin (inherites User) and handles the logic for Admin responsibilities
    def __init__(self, username, password, name, role, payRate):
        super().__init__(
            username, password, name, role, payRate
        )  # Role will always be Admin for this class


class Role:
    def __init__(self, name, payRate):
        self.name = name
        self.payRate = payRate

    def jsonify(self):
        return {"name": self.name, "payRate": self.payRate}
