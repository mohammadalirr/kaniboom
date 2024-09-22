import express from "express";
import ContactForm from "../../models/forms/Contact";
import PlanForm from "../../models/forms/Plan";
import InternForm from "../../models/forms/Intern";
import ProductForm from "../../models/forms/Product";
import MasirForm from "../../models/forms/Masir";
import mongoose from "mongoose";
import User from "../../models/User";

const apiFormRouter = express.Router();

apiFormRouter.get("/:endpoint", async (req, res) => {
  const { endpoint } = req.params;

  let DataModel: mongoose.Model<any>;
  switch (endpoint) {
    case "users":
      DataModel = User;
      break;
    case "contact":
      DataModel = ContactForm;
      break;
    case "internship":
      DataModel = InternForm;
      break;
    case "masir-bootcamp":
      DataModel = MasirForm;
      break;
    case "plans":
      DataModel = PlanForm;
      break;
    case "product-bootcamp": // Fixed typo
      DataModel = ProductForm;
      break;
    default:
      return res.status(404).json({ error: "Invalid endpoint" }); // Return a response
  }

  const { page = 1, limit = 2 } = req.query; // Default values
  const limitValue = parseInt(limit as string) || 2;
  const pageValue = parseInt(page as string) || 1;

  try {
    const startIndex = (pageValue - 1) * limitValue;
    const formData = await DataModel.find()
      .limit(limitValue)
      .skip(startIndex)
      .exec();

    const totalDocuments = await DataModel.countDocuments();
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

apiFormRouter.delete("/:endpoint", async (req, res) => {
  const { endpoint } = req.params;
  let DataModel: mongoose.Model<any>;
  switch (endpoint) {
    case "users":
      DataModel = User;
      break;
    case "contact":
      DataModel = ContactForm;
      break;
    case "internship":
      DataModel = InternForm;
      break;
    case "masir-bootcamp":
      DataModel = MasirForm;
      break;
    case "plans":
      DataModel = PlanForm;
      break;
    case "product-bootcamp": // Fixed typo
      DataModel = ProductForm;
      break;
    default:
      return res.status(404).json({ error: "Invalid endpoint" }); // Return a response
  }

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
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

apiFormRouter.get("/download/:fileId", (req, res) => {
  const gfs = req.gfs;
  const { fileId } = req.params;

  // Validate if fileId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res.status(400).send("Invalid file ID.");
  }

  const downloadStream = gfs!.openDownloadStream(
    new mongoose.Types.ObjectId(fileId)
  );

  downloadStream.on("data", (chunk: any) => {
    res.write(chunk);
  });

  downloadStream.on("end", () => {
    res.end();
  });

  downloadStream.on("error", (err: Error) => {
    console.error("Error downloading file:", err);
    res.status(404).send("File not found.");
  });
});

// apiFormRouter.get('/download/:filename', async (req, res) => {
//   const gfs = req.gfs;
//   const filename = req.params.filename;

//   const files = await gfs!.find({ filename }).toArray();
//   console.log(files);

//   if (!files || files.length === 0) {
//     return res.status(404).json({ message: 'File not found' });
//   }

//   const downloadStream = gfs!.openDownloadStreamByName(filename);

//   res.set('Content-Type', 'application/octet-stream');
//   res.set('Content-Disposition', `attachment; filename="${filename}"`);

//   downloadStream.pipe(res);

//   downloadStream.on('error', (err) => {
//     console.error('Error downloading file:', err);
//     res.status(404).send('File not found.');
//   });
// });

export default apiFormRouter;
