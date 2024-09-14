// const express = require("express");
require("dotenv").config();

import express from "express";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import viewRouter from "./routes/views";
import formRouter from "./routes/forms";
import authRouter from "./routes/api/auth";
import apiFormRouter from "./routes/api/forms";

import path from "path";

const morgan = require("morgan");
const cors = require("cors");
const app = express();
mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Error connecting", err));

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

app.use((req, res, next) => {
  if (!gfs) {
    return res.status(500).send("GridFSBucket not initialized.");
  }
  req.gfs = gfs;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewRouter);
app.use("/forms", formRouter);

// API

app.use("/kb-api/auth", authRouter);
app.use("/kb-api/forms", apiFormRouter);

app.listen(process.env.PORT, () => {
  console.log("listening on port 3000");
});
