// const express = require("express");
require("dotenv").config();

import express from "express";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import viewRouter from "./routes/views";
import formRouter from "./routes/forms";
import authRouter from "./routes/api/auth";
import apiFormRouter from "./routes/api/forms";
import apiUserRouter from "./routes/api/users";
import path from "path";
import fastAuth from "./middlewares/fastAuth";
import verifyRouter from "./routes/api/verify";
import exportRouter from "./routes/api/exports";
import apiContentRouter from "./routes/api/contents";
import contentRouter from "./routes/contents"

const cors = require("cors");
const morgan = require("morgan");
const app = express();

const allowedOrigins = [
  // customenv
  // "https://kaniboom-panel.liara.run",
  // "https://kaniboom.liara.run",
  // "https://kaniboom.ir",

  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(cors({
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // اجازه ارسال کوکی‌ها
}));

app.options("*", cors()); // برای هندل کردن preflight request‌ها

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
// app.use(
//   cors({
//     origin: "https://kaniboom-panel.liara.run",
//     credentials: true, // to allow cookies
//   })
// );
// app.options("*", cors());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://kaniboom-panel.liara.run");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

const cookieParser = require("cookie-parser");

mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => console.log("Error connecting", err));

const connection = mongoose.connection;
let gfs: GridFSBucket;

connection.once("open", () => {
  if (connection.db) {
    gfs = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: "uploads",
    });
    console.log("Connected to MongoDB (BUCKET)");
  } else {
    console.error("Failed to connect to MongoDB: No database found");
  }
});

declare global {
  namespace Express {
    interface Request {
      gfs?: GridFSBucket;
    }
  }
}

app.use(cookieParser());

app.use((req, res: any, next) => {
  if (!gfs) {
    return res.status(500).send("GridFSBucket not initialized.");
  }
  req.gfs = gfs;
  next();
});

// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
//   );
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.set("view engine", "ejs");
//customenv
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewRouter);
app.use("/forms", cors(), formRouter);
app.use("/contents", cors(), contentRouter);

// API
app.use("/kb-api", verifyRouter);
app.use("/kb-api/auth", authRouter);
app.use("/kb-api/forms", fastAuth, apiFormRouter);
app.use("/kb-api/users", fastAuth, apiUserRouter);
app.use("/kb-api/contents", fastAuth, apiContentRouter);
app.use("/kb-api/export", fastAuth, exportRouter);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
