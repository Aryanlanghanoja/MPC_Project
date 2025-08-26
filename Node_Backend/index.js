require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const passport = require("passport");
const passportStrategy = require("./passport");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const authRoute = require("./middleware/auth");

// Database Connection
const dbConfig = require("./config/db.config");
const db = require("./helper/db.helper");

// Routes
const webRouter = require("./routes/web.routes");
const userRouter = require("./routes/user.routes");
const leadRouter = require("./routes/leads.routes");
const followupRouter = require("./routes/followup.routes");
const taskRouter = require("./routes/tasks.routes");
const documentRouter = require("./routes/documents.routes");

const app = express();

// View engine and static files
app.set("view engine", "ejs");
app.set("views", "./view");
app.use("/public", express.static(path.join(__dirname, "public/")));

app.use(
  cors({
    origin: "https://trackly-five.vercel.app", // change as needed
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", webRouter);
app.use("/auth", authRoute.router);
app.use("/api/user", userRouter);
app.use("/api/lead", leadRouter);
app.use("/api/followup", followupRouter);
app.use("/api/task", taskRouter);
app.use("/api/document", documentRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Trackly Lead Management API!");
});

// Conditional for local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// ✅ Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);