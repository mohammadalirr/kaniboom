import express from "express";
import User from "../../models/User";

const authRouter = express.Router();
const bcrypt = require("bcrypt");



authRouter.post("/signin", async (req, res) => {
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

    res.status(200).json({ message: "وارد شدید." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post("/create", async (req, res) => {
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


export default authRouter;
