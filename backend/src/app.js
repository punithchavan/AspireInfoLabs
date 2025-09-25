// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app = express();

// app.use(cors({
//     origin: "http://localhost:5173" ,
//     credentials: true,
// }))

// app.use(express.json({
//     limit: "16kb"
// }))

// app.use(express.urlencoded({
//     extended: true,
//     limit: "16kb"
// }))

// app.use(express.static("public"));

// app.use(cookieParser());

// export { app }

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

// Initialize app
const app = express();

/* ---------------- Security Middlewares ---------------- */

// Helmet → sets various secure HTTP headers 
// (e.g., X-Frame-Options, X-XSS-Protection, HSTS)
app.use(helmet());

// CORS → allow frontend to communicate with backend securely
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true, // allow cookies/auth headers
  })
);

// Parse incoming JSON & form data safely
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// Serve static files (e.g., images, docs)
app.use(express.static("public"));

// Cookie parser → to read/write cookies
app.use(cookieParser());

// Prevent MongoDB operator injection in queries
// Example: { "email": { "$gt": "" } } → blocked
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  // skip req.query to avoid "Cannot set property query" error
  next();
});

// Rate limiting on auth routes → stops brute force attacks
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 20, // 20 requests per IP
    message: "Too many login attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

import userRoutes from "./routes/user.routes.js";
import deviceRoutes from "./routes/device.routers.js";

app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);



export { app };
