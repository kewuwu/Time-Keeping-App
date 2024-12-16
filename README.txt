Time-Keeping App - Start-Up Instructions

Prerequisites:
- Ensure you have Python 3 and Node.js installed.

Starting the Backend Server:
1. Open the root file in Command Prompt.
2. Navigate to Time-Keeping-App/Backend.
3. Run the command: pip install -r requirements.txt.
4. While in the Backend directory, execute: flask run.

Launching the React App:
1. Navigate back to the root directory, then change directory to time-App.
2. In the time-app directory, execute: npm start.
   - This will launch the React app in your browser.

Application Architecture:
- The Time-keeping app utilizes a four-layer architecture connecting a MongoDB database to business logic that then feeds into our Flask API. The API serves up information for React to compile and render.

User Access:
- Different login information will navigate you to either an Admin screen for admin users or an Employee screen for non-admin users.

Admin Log-in:
- Username: Admin
- Password: Admin

Employee Log-in:
- Username: Employee
- Password: Employee

Admin Hub:
- Within the admin hub, new users can be instantiated. These new users can then log in to their respective terminals depending on the permissions granted.