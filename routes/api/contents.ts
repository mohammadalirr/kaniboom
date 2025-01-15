import express from "express";
import mongoose, { Connection } from "mongoose";
import Page from "../../models/contents/Page";
import Main from "../../models/contents/Main";
import multer from "multer";
import { GridFSBucket } from "mongodb";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const apiContentRouter = express.Router();

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

/**
 * @Imgs handler  
 * Post
 * Get all
 * Get by id
 * delete by id
 */

apiContentRouter.post("/imgs", upload.any(), async (req, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const existingFiles = await gfs.find().toArray(); // پیدا کردن همه فایل‌ها
    const existingFileNames = existingFiles.map((file) => file.filename);

    const uploadPromises = (req.files as Express.Multer.File[]).map((file) => {
      return new Promise<void>((resolve, reject) => {
        if (existingFileNames.includes(file.originalname)) {
          console.log(
            `File ${file.originalname} already exists, skipping upload.`
          );
          resolve(); // فایل موجود است، آپلود نمی‌شود
          return;
        }

        const writeStream = gfs.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        writeStream.end(file.buffer);

        writeStream.on("finish", () => {
          console.log(`File ${file.originalname} uploaded successfully.`);
          resolve();
        });

        writeStream.on("error", (error) => {
          console.error(`Error uploading file ${file.originalname}:`, error);
          reject(error);
        });
      });
    });

    await Promise.all(uploadPromises);
    res.status(200).send("Upload process completed. Duplicates were skipped.");
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send("An error occurred during file upload.");
  }
});

apiContentRouter.get("/imgs", async (req, res: any) => {
  try {
    if (!gfs) {
      return res.status(500).send("GridFS not initialized");
    }

    // جستجوی تمام فایل‌ها در GridFS
    const files = await gfs.find().toArray();

    if (!files || files.length === 0) {
      return res.status(404).send("No files found");
    }

    // فیلتر کردن فایل‌هایی که متادیتای نامعتبر دارند
    const validFiles = files.filter((file) => file.length > 0);

    const fileIds = validFiles.map((file) => file._id);
    res.status(200).json(fileIds);
  } catch (error) {
    console.error("Error fetching file IDs:", error);
    res.status(500).send("Error retrieving file IDs");
  }
});

apiContentRouter.get("/imgs/:id", async (req, res: any) => {
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

apiContentRouter.delete("/imgs/:id", async (req, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("No ObjectId provided");
    }

    const fileId = new mongoose.Types.ObjectId(id);

    if (!gfs) {
      return res.status(500).send("GridFS not initialized");
    }

    await gfs.delete(fileId);

    // بررسی اینکه آیا فایل هنوز وجود دارد یا خیر
    const files = await gfs.find({ _id: fileId }).toArray();
    if (files.length > 0) {
      return res.status(500).send("Failed to delete the file");
    }

    res.status(200).send("File deleted successfully");
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).send("Invalid ObjectId or error processing the request");
  }
});

/**
 * @Pages handler
 */

apiContentRouter.post("/", async (req, res: any) => {
  console.log(req.body);
  const content = await Page.findOne({ name: req.body.name });
  if (content) {
    return res.status(409).json({ error: "Page already exists" });
  }
  try {
    const data = req.body;
    const page = new Page({
      name: data.name,
      type: data.type,
      author: data.author,
      head: data.head,
      summary: data.summary,
      blocks: data.blocks,
      persons: data.persons,
      gallery: data.gallery,
      location: data.location,
      roadmap: data.roadmap,
      form: data.form,
      preview: data.preview,
    });
    await page.save();

    res.status(201).json({ message: "Page created successfully", data: page });
  } catch (err: any) {
    console.error("Error processing the request:", err);
    res.status(500).json({ error: err.message });
  }
});

apiContentRouter.put("/:id", async (req, res: any) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(404).send("Id`s not exists");
  }
  try {
    console.log(req.body);
    const data = req.body;
    await Page.findByIdAndUpdate(id, {
      name: data.name,
      type: data.type,
      author: data.author,
      head: data.head,
      summary: data.summary,
      blocks: data.blocks,
      persons: data.persons,
      gallery: data.gallery,
      location: data.location,
      roadmap: data.roadmap,
      form: data.form,
      preview: data.preview,
    });
    res.status(201).json({ message: "content updated successfully" });
  } catch (err: any) {
    console.error("Error when processing the request:", err);
    res.status(500).json({ error: err.message });
  }
});

apiContentRouter.delete("/:endpoint", async (req, res: any) => {
  const { endpoint } = req.params;
  const { id } = req.query;

  let DataModel: mongoose.Model<any>;
  switch (endpoint) {
    case "pages":
      DataModel = Page;
      break;
    default:
      return res.status(404).json({ error: "Invalid endpoint" }); // Return a response
  }

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const deletePage = await DataModel.findByIdAndDelete(id);
    if (!deletePage) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

apiContentRouter.get("/pages/all", async (req, res: any) => {

  try {
    const pagesData = await Page.find({})
    res.status(200).json(pagesData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
apiContentRouter.get("/pages", async (req, res: any) => {
  const { page = 1, limit = 2 } = req.query; // Default values
  const limitValue = parseInt(limit as string) || 2;
  const pageValue = parseInt(page as string) || 1;

  try {
    const startIndex = (pageValue - 1) * limitValue;
    const formData = await Page.find()
      .limit(limitValue)
      .skip(startIndex)
      .exec();

    const totalDocuments = await Page.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limitValue);

    res.status(200).json({
      formData,
      totalPages,
      currentPage: pageValue,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

apiContentRouter.delete("/", async (req, res: any) => {
  const DataModel = Page;
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const deletedForm = await DataModel.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("Error when deleting form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @About page
 */

apiContentRouter.get("/pages/about", async (req, res: any) => {
  try {
    const about = await Page.findOne({ type: "about" });
    if (about) {
      return res.status(200).json({ disabled: true });
    } else {
      return res.status(200).json({ disabled: false });
    }
  } catch (err: any) {
    console.error("Error processing the request:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @Get Page details by id
 */
apiContentRouter.get("/pages/:pageId", async (req, res) => {
  const { pageId } = req.params;
  try {
    const pageData = await Page.findById(pageId);
    if (pageData) {
      res.status(200).json({ data: pageData });
    } else {
      res.status(404).json({ error: "Page is not defined" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @Post @Get @Put Main page
 */

apiContentRouter.post("/main-page", async (req, res: any) => {
  const data = req.body.data;
  try {
    const content = await Main.countDocuments();
    if (content === 0) {
      const main_page = new Main({
        slides: data.slides,
        phone: data.phone,
        email: data.email,
        mobile: data.mobile,
        instagram: data.instagram,
        linkedin: data.linkedin,
        intro: data.intro,
        portfo_img: data.portfo_img,
        full_address: data.full_address,
        loc_address: data.loc_address,
        stats: data.stats,
      });
      await main_page.save();

      res
        .status(201)
        .json({ message: "Page created successfully", data: main_page });
    } else {
      const main_page = await Main.findOneAndUpdate(
        { type: "main" },
        {
          slides: data.slides,
          phone: data.phone,
          email: data.email,
          mobile: data.mobile,
          instagram: data.instagram,
          linkedin: data.linkedin,
          intro: data.intro,
          portfo_img: data.portfo_img,
          full_address: data.full_address,
          loc_address: data.loc_address,
          stats: data.stats,
        },
        { new: true } // Ensures the updated document is returned
      );

      res
        .status(201)
        .json({ message: "Page updated successfully", data: main_page });
    }
  } catch (err: any) {
    console.error("Error processing the request:", err);
    res.status(500).json({ error: err.message });
  }
});

apiContentRouter.get("/main-page", async (req, res) => {
  try {
    const data = await Main.findOne({ type: "main" });
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(404).json({ error: "Page is not defined" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default apiContentRouter;
