<p align="center">
  <img src="https://github.com/user-attachments/assets/07eb4ee3-951a-4fe2-b942-289a31e926b4" width="150" />
</p>

# EFIR Management Portal 🚨






A comprehensive and centralized platform for **electronic First Information Report (FIR)** registration, efficient management, and insightful analytics. This monorepo is designed to streamline crime reporting processes and provide robust tools for both citizens and government personnel.

## ✨ Features

* **Citizen Portal:** Easy-to-use interface for electronic FIR registration with user authentication.
* **Admin Portal:** Exclusive dashboard for government personnel, featuring data visualization and analytics for informed FIR management.
* **Role-Based Access Control (RBAC):** Ensures secure and appropriate access levels for different user types.
* **Botpress Chatbot Integration:** Provides seamless user support and enhances the overall user experience.
* **Responsive and Aesthetic UI:** Designed for optimal usability across various devices.
* **High Efficiency:** Achieved 75% boost in processing efficiency for crime reporting.

## 📦 Tech Stack

**Frontend:**
* React.js
* HTML
* CSS
* JavaScript
* Bootstrap

**Backend:**
* Node.js
* Express.js

**Database:**
* MongoDB
* SQL (Though MongoDB is listed, if you use SQL anywhere, consider specifying where or removing it if not used for this project)

**Other Tools:**
* Botpress Chatbot
* Git / GitHub (for Version Control)

## 📁 Folder Structure
EFIRManagement portal/
│
├── backend/                  # Main Node.js/Express backend API for citizens
│   └── server.js
│
├── E-FIR/                    # Citizen-facing React frontend
│   └── src/index.js
│
├── admin/
│   ├── backend/              # Admin Node.js/Express backend API
│   │   └── server.js
│   └── frontend/             # Admin React frontend
│       └── src/index.js
## 🚀 Quick Start (Development)

Follow these steps to get your development environment up and running.

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd "EFIRManagement portal"
    ```

2.  **Install dependencies:**
    * For the Citizen Backend:
        ```bash
        cd backend && npm install
        ```
    * For the Citizen Frontend:
        ```bash
        cd ../E-FIR && npm install
        ```
    * For the Admin Backend:
        ```bash
        cd ../admin/backend && npm install
        ```
    * For the Admin Frontend:
        ```bash
        cd ../admin/frontend && npm install
        ```

3.  **Set up Environment Variables:**
    Create a `.env` file in both `backend/` and `admin/backend/` directories with the following:
    ```
    MONGODB_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    ```
    * *Note*: Replace `your-mongodb-uri` with your MongoDB connection string and `your-jwt-secret` with a strong, random string.

4.  **Start Development Servers:**
    * **Citizen Backend:**
        ```bash
        cd backend
        npm start # Runs on http://localhost:5000
        ```
    * **Admin Backend:**
        ```bash
        cd ../admin/backend
        npm start # Runs on http://localhost:5001
        ```
    * **Citizen Frontend:**
        ```bash
        cd ../E-FIR
        npm start # Runs on http://localhost:3000 (usually default for React, adjust if needed)
        ```
    * **Admin Frontend:**
        ```bash
        cd ../admin/frontend
        npm start # Runs on http://localhost:3001
        ```

## ✅ Requirements

* Node.js (v14 or above)
* npm (Node Package Manager)
* MongoDB (local instance or cloud service like MongoDB Atlas)

## 🤝 Contributing

Contributions are always welcome! Feel free to:

* Fork the repository.
* Open issues for bug reports or feature requests.
* Submit pull requests with improvements.

## 📝 Notes

* Ensure your backend APIs are running and accessible to the frontends, especially during development and after deployment.
* For optimal security, use strong, randomly generated `JWT_SECRET` keys and never expose your `MONGODB_URI` publicly.
