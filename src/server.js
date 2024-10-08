import express from "express";
require("dotenv").config();
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB";
import loginWithGoogle from "./controller/social/GoogleController";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import viewEngine from "./config/viewEngine";
import configCors from "./config/cors";
import { v2 as cloudinary } from "cloudinary";

let app = express();
connectDB();
configCors(app);

// Config view engine
viewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Config session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

initWebRoutes(app);
initApiRoutes(app);

app.use((req, res) => {
  return res.send("404 not found");
});

cloudinary.config({
  secure: true,
});

loginWithGoogle();

let port = process.env.PORT || 8088;
app.listen(port, () => {
  console.log("NodeJSServer is running at the port : " + port);
});
