Enterprise Task & Project Management Portal

A full-stack web application designed for teams within an organization to manage projects, assign tasks, track progress, and communicate efficiently. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and featuring real-time updates with Socket.io.

✨ Key Features

Authentication: Secure user Login/Signup via Google OAuth 2.0 or local email/password (using JWT).

Role-Based Access: Distinct roles for Admins (manage users/projects) and Employees (manage assigned tasks).

Project Management: Create, view, update (details & team members), and delete projects.

Task Management: Add, view, update (status, assignee, details), and delete tasks within projects using a visual Kanban board.

Dashboard: Overview with charts showing total projects, task breakdown (To-Do, In Progress, Done), and key stats.

Real-time Communication: Integrated chat panel for each project using Socket.io.

Profile Management: Users can update their personal details.

Admin Panel: Admins can view and delete user accounts.

Responsive Design: Modern UI built with React and Tailwind CSS, adapting to various screen sizes.

🛠️ Tech Stack

Frontend: React, Vite, React Router, Tailwind CSS, Axios, Socket.io Client, Chart.js

Backend: Node.js, Express.js, Mongoose

Database: MongoDB Atlas

Authentication: Google OAuth 2.0, JSON Web Tokens (JWT), bcryptjs

Real-time: Socket.io

🚀 Setup and Installation

To run this project locally, follow these steps:

Prerequisites:

Node.js and npm (or Yarn) installed.

A MongoDB Atlas account (or local MongoDB instance) for the connection string.

Google OAuth 2.0 credentials (Client ID and Client Secret).

Steps:

Clone the Repository:

git clone <your-repo-url>
cd <your-repo-name>


Backend Setup:

# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend folder with the following:
PORT=8080
DB_URL=your_mongodb_connection_string_here
JWT_SECRET=your_strong_random_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
# FRONTEND_URL=http://localhost:5173 (Update later after frontend deployment)

# Start the backend server
npm start 
# (Ensure package.json has "start": "nodemon index.js" or "node index.js")


Frontend Setup:

# Open a NEW terminal window/tab
# Navigate to the frontend folder FROM THE ROOT directory
cd ../frontend 
# Or directly: cd path/to/your-repo/frontend

# Install dependencies
npm install

# Create a .env file in the /frontend folder with the following:
VITE_API_URL=http://localhost:8080 
# (This should match the backend PORT)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Start the frontend development server
npm run dev


Your application should now be running locally! Frontend at http://localhost:5173, Backend at http://localhost:8080.

Google OAuth 2.0 Setup:

Go to Google Cloud Console.

Create or select a project.

Go to APIs & Services > Credentials.

Click Create Credentials > OAuth 2.0 Client ID.

Configure the OAuth consent screen.

Set Application type to Web application.

Add URIs:

Authorized JavaScript origins:

http://localhost:5173 (for local frontend dev)

(Add your deployed Vercel URL later)

Authorized redirect URIs:

http://localhost:8080/auth/google (for local backend handling)

(Add your deployed Render backend URL + /auth/google later)

Copy the Client ID and Client Secret into your .env files.

(Optional: Add sections for API Endpoints, Screenshots, etc. here later)


---

### **Step 4: Commit and Push**

Once you have organized the folders and updated the `.gitignore` and `README.md`, commit these changes to your GitHub repository:

```bash
git add .
git commit -m "Organize project into frontend and backend folders"
git push origin main # Or your default branch name
