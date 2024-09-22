import { Request } from "express";
import express from "express";
import User from "../../models/User";
import fastAuth from "../../middlewares/fastAuth";

const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// authRouter.get("/verify", async (req: Request, res, next) => {
//   const token = req.cookies.token;
//   console.log("TOKEN", token);

//   if (!token) {
//     res.status(401).json({ message: "Invalid token" });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_KEY);
//   if (!decoded) {
//     res.status(403).json({ message: "Invalid token" });
//   }

//   res.status(200).json({ message: "Token is valid" });
// });

authRouter.post("/verify", async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded, "DECODED");

    if (!decoded) {
      res.status(403).json({ message: "Invalid token" });
    }

    res.status(200).json({
      message: "Token is valid",
      data: { username: decoded.username, role: decoded.role },
    });
  } else {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ error: "رمز عبور یا نام کاربری اشتباه است." });
      }

      const isMatchPass = await bcrypt.compare(password, user.password);
      if (!isMatchPass) {
        return res
          .status(400)
          .json({ error: "رمز عبور یا نام کاربری اشتباه است." });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 3600000 * 6),
        sameSite: "lax",
      });

      res.status(200).json({
        message: "وارد شدید.",
        data: { username: user.username, role: user.role },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
});

authRouter.post("/create", fastAuth, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ error: "چنین کاربری وجود دارد." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(200).json({ message: "کاربر با موفقیت ایجاد شد." });
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

export default authRouter;
