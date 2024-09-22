import express, { NextFunction, Request, Response } from "express";
const verifyRouter = express.Router();

const jwt = require("jsonwebtoken");

verifyRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log(token, "TOKEN TOKEN");
  

  if (!token) {
    res.status(401).json({ message: "Invalid token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_KEY);
  if (!decoded) {
    res.status(403).json({ message: "Invalid token" });
  }

  res.status(200).json({ message: "Token is valid" });
});

export default verifyRouter;
