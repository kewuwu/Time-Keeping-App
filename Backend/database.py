from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import schema as business_logic

from datetime import datetime


class Database:
    def __init__(self, collection):
        self.uri = "mongodb+srv://RWUser:XZZmfjSqC4sZRi82@cluster0.oxu6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        self.client = MongoClient(self.uri, server_api=ServerApi("1"))
        self.db = self.client["mydatabase"]
        self.col = self.db[collection]

    def _FindNextIndex(self):
        i = 0
        while True:
            entry = self.col.find_one({"_id": i})
            if entry == None:
                return i
            else:
                i += 1

    # Returns a list of all employees in the database
    def GetDictList(self):
        return list(self.col.find())


class UserDatabase(Database):
    def __init__(self):
        super().__init__("employees")

    # User Functions
    def GetUser(self, query: dict):
        user = self.col.find_one(query)
        if user == None:
            print("User not found")
            return False
        role = business_logic.Role(user["role"], user["payrate"])
        if user["admin"]:
            print("Admin")
            return business_logic.Admin(
                user["username"], user["password"], user["name"], role, user["payrate"]
            )
        else:
            print("Employee")
            return business_logic.Employee(
                user["username"], user["password"], user["name"], role, user["payrate"]
            )

    # Updates the user entry in the database
    # Returns a boolean depending on if the user is found and updated
    def UpdateUser(self, query: dict, user: business_logic.User):
        newValues = {"$set": self._GetUserDict(user)}  # Correct usage
        x = self.col.update_one(query, newValues)
        if x.matched_count == 0:  # Correct way to check if the update did anything
            return False
        else:
            return True

    # Employee Functions
    def CreateEmployee(self, employee: business_logic.Employee):
        return self._CreateUser(
            employee.name,
            employee.username,
            employee.password,
            employee.role.name,
            employee.payRate,
            False,
        )

    # Admin Functions
    def CreateAdmin(self, admin: business_logic.Admin):
        return self._CreateUser(
            admin.name,
            admin.username,
            admin.password,
            admin.role.name,
            admin.payRate,
            True,
        )

    # Private Functions
    def _CreateUser(
        self,
        name: str,
        username: str,
        password: str,
        role: str,
        payRate: float,
        admin: bool,
    ):
        x = self.col.insert_one(
            {
                "_id": self._FindNextIndex(),
                "name": name,
                "username": username,
                "password": password,
                "role": role,
                "payrate": payRate,
                "admin": admin,
            }
        )
        return x.inserted_id

    def _GetUserDict(self, user: business_logic.User):
        return {
            "name": user.name,
            "username": user.username,
            "password": user.password,
            "role": user.role.name,
            "payrate": user.payRate,
        }

    def _GetUserID(self, user: business_logic.User):
        user_entry = self.col.find_one(user.__dict__)
        if user_entry != None:
            return user_entry["_id"]
        else:
            return False


class RoleDatabase(Database):
    def __init__(self):
        super().__init__("roles")

    def GetRole(self, query: dict):
        role = self.col.find_one(query)
        if role == None:
            return None
        return business_logic.Role(name=role["name"], payRate=role["payrate"])

    def UpdateRole(self, query: dict, role: business_logic.Role):
        newValues = {"$set": self._GetRoleDict(role)}
        # RETURNS NONE OBJECT IF IT DOESNT ACTUALLY UPDATE
        x = self.col.update_one(query, newValues)
        if x == None:
            return False
        else:
            return True

    def CreateRole(self, role: business_logic.Role):
        x = self.col.insert_one(
            {"_id": self._FindNextIndex(), "name": role.name, "payrate": role.payRate}
        )
        return x.inserted_id

    def _GetRoleDict(role: business_logic.Role):
        return {"name": role.name, "payrate": role.payRate}


class LogDatabase(Database):
    def __init__(self):
        super().__init__("logs")

    def CreateLog(self, user: business_logic.User):
        x = self.col.insert_one(
            {
                "username": user.username,
                "clockIn": user.timeLogs[0],
                "clockOut": None,
                "time": datetime.now(),
            }
        )
        return x.inserted_id

    def GetLatestLog(
        self,
        user: business_logic.User,
    ):

        return self.col.find_one({"username": user.username}, sort={"time": -1})

    def updateLog(self, user: business_logic.User):
        latest = self.GetLatestLog(user)
        newValues = {
            "$set": {"clockIn": user.timeLogs[0], "clockOut": user.timeLogs[1]}
        }
        if latest == None:
            self.CreateLog(user)
            return
        if latest["clockIn"] != None and latest["clockOut"] == None:
            self.col.update_one({"_id": latest["_id"]}, newValues)
            return
        if latest["clockOut"] != None:
            self.CreateLog(user)
            return
        self.col.update_one({"_id": latest["_id"]}, newValues)
        return
