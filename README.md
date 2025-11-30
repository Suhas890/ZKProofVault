#REST-Express Full-Stack Application

This is a full-stack application featuring a modern development stack:
- **Backend:** Node.js with Express and TypeScript, midnight ZK Proof for privacy
- **Frontend:** React with Vite, TypeScript, and Tailwind CSS (using shadcn/ui components).
- **State Management/Data Fetching:** Zustand and React Query.
- **Styling:** Tailwind CSS with PostCSS.
- **Database:** Configured for PostgreSQL/Drizzle, but currently uses an in-memory storage for the prototype.

VS Code Setup and Running Instructions
To get the project running in Visual Studio Code, you need to follow these steps to install the necessary software and dependencies.

1. Prerequisites (What needs to be installed)
You need to have the following installed on your system:

Node.js: Version 20 or higher is recommended. You can download it from the official Node.js website.

npm (Node Package Manager) or yarn/pnpm: This comes bundled with Node.js.

Git (Optional, but recommended for version control).

2. VS Code Preparation
Open the Project: Open Visual Studio Code and use File > Open Folder... to select the root directory of the project.

Install Recommended Extensions (Optional): For a better development experience with TypeScript, React, and Tailwind CSS, consider installing these extensions:

ESLint

Prettier - Code formatter

Tailwind CSS IntelliSense

3. Installation
Open Terminal: Open the integrated terminal in VS Code by going to Terminal > New Terminal or by pressing `Ctrl + `` (or `` Cmd + ``` on macOS).

Install Dependencies: Run the following command to install all required project packages:

Bash

npm install
# or yarn install
# or pnpm install
4. Configuration
Create Environment File: In the root directory of your project, create a new file named .env.development.

Populate .env.development: Add the following content to this file. The DATABASE_URL and SESSION_SECRET are placeholders, as the current configuration uses an in-memory storage (MemStorage).

Code snippet

 --- BACKEND (EXPRESS/NODE) CONFIGURATION ---
 Database is not in use for the prototype, but these placeholders are required.
DATABASE_URL=""
SESSION_SECRET="a_random_placeholder_secret_key"

 --- FRONTEND (VITE/REACT) CONFIGURATION ---
 This is the CRITICAL line that connects the React client to the Express backend.
VITE_API_URL="http://localhost:8080"
The VITE_API_URL ensures the frontend can communicate with the backend's API.

5. Running the Application
The project is configured to run both the backend server and the frontend development server simultaneously using a single command.

Start Development Server: Run the following script in your VS Code terminal:

Bash

npm run dev
This script runs the backend using tsx, which sets up the Vite development middleware.

Access the App: The backend will start on port 8080 (implied by VITE_API_URL="http://localhost:8080" and Express setup) and the frontend will be served by Vite. Open your web browser and navigate to:

http://localhost:8080
