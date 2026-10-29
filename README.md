# ChangeAbility 
<img width="1920" height="1064" alt="banner" src="https://github.com/user-attachments/assets/1d933bf1-c52b-4a8c-ad4c-7d082d5d4a3e" />

---
**Operations & Field Management System**

ChangeAbility is a full-stack web application designed for a community organization to manage field operations, volunteer logistics, and beneficiary intake. It provides a centralized, secure dashboard for tracking vulnerable individuals, deploying teams to strategic projects, managing calendar events, and logging operational issues.

## Design Reference (UX200)

The foundational requirements for this project were derived from an assigned UX200 design file. However, because the provided reference designs did not meet the usability standards or visual polish required for a modern production application, I undertook a massive, personalized overhaul. I redesigned the entire user interface from the ground up to ensure a highly modern, professional, and accessible user experience.

The live application is currently deployed in an exclusive, high-contrast dark theme. This streamlined my workflow as a solo developer redesigning the entire system. A comprehensive light-mode counterpart is planned for a future release to fully match the complete design system I created in Figma.

## Features

* **Modern Authentication Flow:** Split-screen UI handling secure logins and dynamic profile-claiming for pending volunteer accounts.

* **Role-Based Access Control (RBAC):** Distinct routing and permissions for Administrators (system-wide control) versus Volunteers (personal tasks and field assignments).

* **Live Analytics Dashboard:** Real-time data visualization using Recharts to track beneficiary status distributions and vulnerability assessments.

* **Beneficiary Management:** Comprehensive intake system tracking medical needs, dietary restrictions, and mobility requirements.

* **Operational Logistics:** Management of Teams, Projects, Calendar Events, and an internal issue-ticketing system.

## Technologies Used

* **Frontend:** React, Vite, CSS3, Recharts (Data Visualization)

* **Backend:** Node.js, Express.js

* **Database:** MongoDB, Mongoose

* **Authentication:** JSON Web Tokens (JWT), bcryptjs

* **Deployment & Infrastructure:** Heroku, Google Cloud Run

## Live Deployments & Access

Both deployments utilize the same underlying MongoDB Atlas cluster, meaning data remains synchronized across both platforms.

* **Platform 1 (Google Cloud Run):** <https://changeability-45080596870.europe-west1.run.app/>

* **Platform 2 (Heroku):** <https://changeability-app-1aaa3caf4d82.herokuapp.com/>

### Test Credentials (Admin Access)

* **Email:** `admin@changeability.org`

* **Password:** `admin123`

## Local Setup Instructions

To run this project locally, ensure you have Node.js (v20+) and Git installed.

1. **Clone the repository:**

   ```
   git clone <your-repo-url>
   cd changeability
   
   ```

2. **Set up Environment Variables:**
   Create a `.env` file inside the `server` directory and add:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   
   ```

3. **Install Dependencies:**
   Because this is a unified repository, you must install dependencies for both the frontend and backend.

   ```
   cd server && npm install
   cd ../frontend && npm install
   
   ```

4. **Run the Application (Development Mode):**
   Open two terminal windows to run both servers concurrently:

   * **Terminal 1 (Backend):** `cd server && npm start`

   * **Terminal 2 (Frontend):** `cd frontend && npm run dev`

   The application will be available at `http://localhost:5173`.

## Deployment Summary

This application is configured as a monolithic unified repository, allowing the Express backend to serve the compiled React frontend in production.

* **Heroku Deployment:** Deployed via the Heroku Git CLI. A custom script in the root `package.json` (`npm install --include=dev`) was required to force the Heroku production environment to download Vite and compile the React `dist` folder before launching the Node server.

* **Google Cloud Run Deployment:** Configured via Continuous Deployment linking the GitHub repository directly to Google Cloud Build. Cloudpacks automatically generated the Docker container from the source code. Environment variables were securely injected via the GCP Console interface, and unauthenticated invocations were allowed to expose the frontend to the web.

## Challenges & Solutions

* **Recharts SVG Pattern Rendering:**

  * *Challenge:* Custom diagonal SVG patterns applied to the Recharts elements caused the Pie Chart to render completely invisible due to duplicate HTML IDs in the DOM.

  * *Solution:* Isolated the `<defs>` blocks internally within their respective components and appended unique prefixes to ensure the browser could paint the SVG patterns without conflict.

* **Express 5 Wildcard Routing Crash:**

  * *Challenge:* The Heroku deployment immediately crashed on boot with a `PathError` regarding a missing parameter name at index 1.

  * *Solution:* Express 5 updated its strict routing engine (`path-to-regexp`) and no longer accepts bare strings like `'*'` for catch-all routes. I resolved this by refactoring the production frontend-serving route to use a regex `/(.*)/`, which safely bypasses the strict parser.

* **Google Cloud Buildpack Node EOL:**

  * *Challenge:* The initial Google Cloud Run deployment failed because it detected Node.js v20, which is officially End-of-Life (EOL) and unsupported by GCP's latest secure builders.

  * *Solution:* Updated the root `package.json` engines block explicitly to `"node": "22.x"`, forcing the Cloudpack to utilize a supported modern runtime.

* **Production CORS & API Proxying:**

  * *Challenge:* Hardcoded `localhost` URLs in the frontend triggered severe Cross-Origin Resource Sharing (CORS) blocks on the live domains.

  * *Solution:* Refactored all frontend fetch requests to use relative paths (`/api/...`). Configured `vite.config.js` to proxy requests to port 5000 during local development, while the production Express server natively handles the relative paths and serves the static build.
