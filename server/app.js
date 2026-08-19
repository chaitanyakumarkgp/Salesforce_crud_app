require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const salesforceRoutes = require("./routes/salesforce");

const app = express();

const isProd = process.env.NODE_ENV === "production";

// ===============================
// Middleware
// ===============================

if (!isProd) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
}

app.use(express.json());

// ===============================
// Session Configuration
// ===============================

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    },
  })
);

// ===============================
// Health Check
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Salesforce CRUD API running",
  });
});

// ===============================
// Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use(
  "/api/salesforce",
  salesforceRoutes
);

// ===============================
// Serve React (production)
// ===============================

const clientPath = path.join(
  __dirname,
  "../client/dist"
);

app.use(express.static(clientPath));

app.get("/{*path}", (req, res) => {
  res.sendFile(
    path.join(clientPath, "index.html")
  );
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});