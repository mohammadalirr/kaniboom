import express from "express";
import mongoose, { Connection } from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";


const contentRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uri = process.env.MONGODB_URL || "mongodb://localhost:27017/kb";
mongoose.connect(uri);

const connection: Connection = mongoose.connection;
let gfs: GridFSBucket;

connection.once("open", () => {
  if (connection.db) {
    gfs = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: "page_imgs",
    });
    console.log("Connected to MongoDB (CONTENT BUCKET)");
  }
});

contentRouter.get("/imgs/:id", async (req, res: any) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // بررسی وجود gfs
    if (!gfs) {
      return res.status(500).send("GridFS not initialized");
    }

    // بررسی اینکه آیا فایلی با این ID وجود دارد یا خیر
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).send("File not found");
    }

    // تنظیم header مناسب و ارسال استریم فایل
    res.set("Content-Type", files[0].contentType);
    const downloadStream = gfs.openDownloadStream(fileId);

    downloadStream.pipe(res).on("error", (err: any) => {
      console.error("Download stream error:", err);
      res.status(500).send("Error while reading the file");
    });
  } catch (error) {
    console.error("Error fetching the file:", error);
    res.status(500).send("Invalid ObjectId or error retrieving the file");
  }
});

export default contentRouter;
