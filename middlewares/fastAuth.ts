import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const fastAuth = async function isFamiliar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token;
    console.log(token, "FAMILIAR");

    if (!token) {
      res.status(401).json({ message: "unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      res.status(403).json({ message: "forbidden" });
    }
    next();

    // res.status(200).json({ token, id: decoded.id });
  } catch (err: any) {
    console.error("ERROR", err.message);
  }
};

export default fastAuth;
