import express from "express";
import ContactForm from "../../models/forms/Contact";
import InternForm from "../../models/forms/Intern";
import MasirForm from "../../models/forms/Masir";
import PlanForm from "../../models/forms/Plan";
import ProductForm from "../../models/forms/Product";
import mongoose from "mongoose";
import XLSX from "xlsx";
import SadafForm from "../../models/forms/Sadaf";
import MineralForm from "../../models/forms/Mineral";
import Form from "../../models/forms/Form";

const exportRouter = express.Router();

exportRouter.get("/:endpoint", async (req, res: any) => {
  const { endpoint } = req.params;

  let DataModel: mongoose.Model<any>;
  switch (endpoint) {
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
    case "product-bootcamp":
      DataModel = ProductForm;
      break;
    case "sadaf": // Fixed typo
      DataModel = SadafForm;
      break;
    case "mineral": // Fixed typo
      DataModel = MineralForm;
      break;
    case "dynamic": // Fixed typo
      DataModel = Form;
      break;

    default:
      return res.status(404).json({ error: "Invalid endpoint" }); // Return a response
  }

  try {
    const data = await DataModel.find({}).lean();

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MyCollectionData");

    const fileName = `kaniboom-${endpoint}-form.xlsx`;

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("خطا در گرفتن خروجی اکسل:", error);
    res.status(500).send("خطا در گرفتن خروجی اکسل");
  }
});

export default exportRouter;
