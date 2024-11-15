import express from "express";

const contentRouter = express.Router();

contentRouter.get("/", (req, res) => {
  res.json("SALAAAAAM");
});
contentRouter.post("/", (req, res) => {
  console.log(req.body?.data);
  res.json({ data: req.body?.data });
});

export default contentRouter;
