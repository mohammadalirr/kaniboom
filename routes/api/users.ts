import express from "express";
import User from "../../models/User";

const apiUserRouter = express.Router();

apiUserRouter.get("/", async (req, res) => {
  const DataModel = User;

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

apiUserRouter.delete("/", async (req, res: any) => {
  const DataModel = User;
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

export default apiUserRouter;
