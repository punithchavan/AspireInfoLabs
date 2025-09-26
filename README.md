# Secure Login & Registration Flow



## Overview

This project implements a **secure login and registration system** using the **MERN stack**, focusing on **robust security practices**, **OWASP Top 10 prevention**, and **two-factor authentication (2FA)**. The system demonstrates how modern web applications can be secured against common attacks like SQL/NoSQL injection, cross-site scripting (XSS), and session hijacking, while providing a smooth user experience.

This project was developed as part of the **AspireInfoLabs Hackathon**.

---

## Features

### Authentication & Security
- **Secure Registration & Login** flow with hashed passwords using **bcryptjs**.
- **Two-Factor Authentication (2FA)** for an added layer of security.
- **Input Sanitization** using **mongo-sanitize** to prevent NoSQL injection.
- **HTTP Headers Hardening** using **Helmet**.
- **CORS Protection** to control resource access.
- **Session Management** with JWT tokens and secure storage.

### Attack Prevention (OWASP Top 10)
- **Injection Prevention** (NoSQL / SQL-like attacks)  
- **Broken Authentication & Session Management** protections  
- **Sensitive Data Exposure** prevention  
- **Security Misconfiguration** mitigations  
- **Cross-Site Scripting (XSS) & Cross-Site Request Forgery (CSRF) Protections**  
- And other standard OWASP Top 10 best practices

### Monitoring & Logging
- Logged-in devices with **device fingerprints** (IP, User-Agent, device label).  
- **Suspicious activity detection**: multiple failed logins, unusual IPs, unauthorized device access.  
- Automated **flagging & mitigation** with temporary session/IP block.

---

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Security Libraries:**  
  - `mongo-sanitize` – prevent NoSQL injection  
  - `helmet` – set secure HTTP headers  
  - `cors` – manage cross-origin requests  
  - `bcryptjs` – password hashing  

---

## Getting Started

### Prerequisites
- Node.js >= 18.x  
- MongoDB running locally or on cloud  
- npm or yarn package manager  

### Setup
1. Clone the repository:

```bash
git clone https://github.com/your-org/secure-login-mern.git
cd secure-login-mern
Install dependencies:

bash
Copy code
cd backend
npm install
cd ../frontend
npm install
Configure environment variables:

env
Copy code
# backend/.env
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
Start the backend server:

bash
Copy code
cd backend
npm run dev
Start the frontend server:

bash
Copy code
cd frontend
npm run dev
Open the app in your browser (typically http://localhost:5173 for Vite frontend).

Demo

Users can register, login, and view their logged-in devices.

“Check Cyber Attacks” button simulates suspicious activity detection.

Flags and logs appear in real-time, demonstrating security monitoring.

The system automatically resets after 45 seconds with a message indicating the system is secure and suspicious sessions/IPs are mitigated.

Folder Structure
project-root/
├─ backend/           # Express backend
│  ├─ models/         # Mongoose models
│  ├─ routes/         # API routes
│  ├─ controllers/    # Controller logic
│  └─ middleware/     # Security & auth middleware
├─ frontend/          # React frontend
│  ├─ components/     # Reusable components
│  ├─ pages/          # Page components (Login, Home, etc.)
│  └─ api/            # Axios API calls
├─ README.md
└─ package.json

Contributions

Punith Chavan – GitHub

Frontend & backend development, security logic, cyber-attack simulation.

Animesh Chandra – GitHub

Frontend 

Ketan Koushik - Github

UI/UX, PPT and Database Modelling

API routes, database models, device management, 2FA integration.

License

This project is licensed under the MIT License.

Acknowledgements

AspireInfoLabs Hackathon for providing the platform and theme.

MERN Stack community for tutorials and examples.

OWASP Top 10 documentation for guiding security best practices.
