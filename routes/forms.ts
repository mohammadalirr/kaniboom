import express from "express";
import PlanForm from "../models/forms/Plan";
import ContactForm from "../models/forms/Contact";
import InternForm from "../models/forms/Intern";
import ProductForm from "../models/forms/Product";
import MasirForm from "../models/forms/Masir";
import multer from "multer";
import SadafForm from "../models/forms/Sadaf";
import MineralForm from "../models/forms/Mineral";
import YazdForm from "../models/forms/Yazd";
import Form from "../models/forms/Form";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const formRouter = express.Router();

formRouter.post("/plan", upload.single("file"), async (req, res: any) => {
  const {
    title,
    name,
    team,
    members,
    phone,
    email,
    city,
    planPosition,
    subject,
    status,
    introduction,
  } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const emailExist = await PlanForm.findOne({ email: email });
  const mobileExist = await PlanForm.findOne({ phone: phone });
  if (mobileExist || emailExist) {
    console.log("Email or mobile already exists");
    return res.status(409).send("طرح دیگری با این مشخصات قبلا ثبت شده است.");
  }

  try {
    const uploadStream = req.gfs!.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: {
        form: "form_plan",
        email,
        phone,
      },
    });

    uploadStream.end(file.buffer);

    uploadStream.on("finish", async () => {
      try {
        console.log("Upload finished, file ID:", uploadStream.id);

        const form = new PlanForm({
          title,
          name,
          team,
          members,
          phone,
          email,
          city,
          planPosition,
          subject,
          status,
          introduction,
          fileId: uploadStream.id,
        });

        await form.save();

        res.status(200).send("اطلاعات با موفقیت ثبت شد.");
      } catch (err) {
        console.error("Error saving form:", err);
        res.status(500).send("خطا در ذخیره اطلاعات.");
      }
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading file:", err);
      res.status(500).send("خطا در آپلود فایل.");
    });
  } catch (err) {
    console.error("Error handling file upload:", err);
    res.status(500).send("خطا در مدیریت آپلود فایل.");
  }
});

formRouter.post("/contact", upload.none(), async (req, res) => {
  const { name, email, phone, company, message, page } = req.body;
  try {
    const form = new ContactForm({
      name,
      email,
      phone,
      company,
      message,
      page,
    });
    await form.save();
    res.status(200).send("اطلاعات با موفقیت ثبت شد. ");
  } catch (error) {
    res.status(500).send("Error saving form");
  }
});
formRouter.post("/sadaf", upload.none(), async (req, res) => {
  const { name, email, phone, company, message } = req.body;
  try {
    const form = new SadafForm({
      name,
      email,
      phone,
      company,
      message,
    });
    await form.save();
    res.status(200).send("اطلاعات با موفقیت ثبت شد. ");
  } catch (error) {
    res.status(500).send("Error saving form");
  }
});
formRouter.post("/yazd", upload.none(), async (req, res) => {
  const { name, email, phone, company, message } = req.body;
  try {
    const form = new YazdForm({
      name,
      email,
      phone,
      company,
      message,
    });
    await form.save();
    res.status(200).send("اطلاعات با موفقیت ثبت شد. ");
  } catch (error) {
    res.status(500).send("Error saving form");
  }
});
formRouter.post("/mineral", upload.none(), async (req, res) => {
  const { name, email, phone, company, message } = req.body;
  try {
    const form = new MineralForm({
      name,
      email,
      phone,
      company,
      message,
    });
    await form.save();
    res.status(200).send("اطلاعات با موفقیت ثبت شد. ");
  } catch (error) {
    res.status(500).send("Error saving form");
  }
});
formRouter.post("/intern", upload.none(), async (req, res: any) => {
  const { name, email, phone, field, stage, university, motivation } = req.body;

  const phoneCheck = await InternForm.findOne({ phone });
  const emailCheck = await InternForm.findOne({ email });

  if (phoneCheck || emailCheck) {
    return res.status(409).send(" پیش از این یک بار اطلاعات شما ثبت شده است.");
  }

  try {
    const form = new InternForm({
      name,
      email,
      phone,
      field,
      stage,
      university,
      motivation,
    });
    await form.save();
    res.status(200).send("اطلاعات با موفقیت ثبت شد.");
  } catch (error) {
    res.status(500).send("Error saving form");
  }
});
formRouter.post("/product", upload.none(), async (req, res: any) => {
  const {
    name,
    email,
    phone,
    acquaintance,
    job_status,
    education,
    who,
    company,
    members,
    factor,
  } = req.body;

  const phoneCheck = await ProductForm.findOne({ phone });
  const emailCheck = await ProductForm.findOne({ email });

  if (phoneCheck || emailCheck) {
    return res.status(409).send(" پیش از این یک بار اطلاعات شما ثبت شده است.");
  }

  try {
    const form = new ProductForm({
      name,
      email,
      phone,
      acquaintance,
      job_status,
      education,
      who,
      company,
      members,
      factor,
    });
    await form.save();
    res.status(200).send("اطلاعات با موفقیت ثبت شد.");
  } catch (error) {
    res.status(500).send("Error saving form");
  }
});

/**
 * bootcamp-masir form
 */
formRouter.post(
  "/masir",
  upload.fields([{ name: "introduction" }, { name: "student_card" }]),
  async (req, res: any) => {
    console.log(req.body, "FORM");
    console.log(req.file, "FILE");

    const { name, phone, email, how, applicant, members } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const file1 =
      files && files["introduction"] ? files["introduction"][0] : null;
    const file2 =
      files && files["student_card"] ? files["student_card"][0] : null;

    if (file1 && file2) {
      return res
        .status(400)
        .send("لطفا فقط یک فیلد را برای آپلود فایل انتخاب کنید.");
    }

    const file = file1 || file2;

    if (!file) {
      return res.status(400).send("فایلی آپلود نشده است.");
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "application/pdf",
      "application/zip",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).send("فرمت فایل مجاز نیست");
    }

    const emailExist = await MasirForm.findOne({ email: email });
    const mobileExist = await MasirForm.findOne({ phone: phone });
    if (mobileExist || emailExist) {
      console.log("Email or mobile already exists");
      return res.status(409).send("پیش از این ثبت نام کرده‌اید.");
    }

    try {
      const uploadStream = req.gfs!.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: {
          form: "form_masir",
          email,
          phone,
        },
      });

      uploadStream.end(file.buffer);

      uploadStream.on("finish", async () => {
        try {
          console.log("Upload finished, file ID:", uploadStream.id);

          const form = new MasirForm({
            name,
            phone,
            email,
            how,
            applicant,
            members,
            fileId: uploadStream.id,
          });

          await form.save();

          res.status(200).send("اطلاعات با موفقیت ثبت شد.");
        } catch (err) {
          console.error("Error saving form:", err);
          res.status(500).send("Error saving form.");
        }
      });

      uploadStream.on("error", (err) => {
        console.error("Error uploading file:", err);
        res.status(500).send("Error uploading file.");
      });
    } catch (err) {
      console.error("Error handling file upload:", err);
      res.status(500).send("Error handling file upload.");
    }
  }
);

/**
 * @Dynamic routes
 */
formRouter.post("/:page", upload.single("upload"), async (req, res: any) => {
  const { page } = req.params;
  const {
    type,
    name,
    birth,
    code,
    duty,
    marital,
    education,
    field,
    univercity,
    semester,
    phone,
    email,
    history,
    more,
  } = req.body;

  const file = req.file;
console.log(type, page);

  const user = await Form.findOne({
    type,
    page,
    $or: [{ email }, { code }, { phone }],
  });
  if (user) {
    return res.status(409).send("چنین اطلاعاتی پیش از این ثبت شده است.");
  }

  try {
    let uploadId;

    // بررسی وجود فایل و آپلود آن
    if (file) {
      const uploadStream = req.gfs!.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: {
          type,
          page,
          email,
          phone,
        },
      });

      uploadStream.end(file.buffer);

      // استفاده از Promise برای اطمینان از اتمام آپلود
      await new Promise<void>((resolve, reject) => {
        uploadStream.on("finish", () => {
          uploadId = uploadStream.id;
          resolve();
        });
        uploadStream.on("error", (err) => reject(err));
      });
    }

    // ذخیره فرم در دیتابیس با در نظر گرفتن آپلود یا بدون آن
    const form = new Form({
      type,
      name,
      birth,
      code,
      duty,
      marital,
      education,
      field,
      univercity,
      semester,
      phone,
      email,
      history,
      more,
      page,
      upload: uploadId, // اگر فایلی وجود نداشته باشد، مقدار null ذخیره می‌شود
    });

    await form.save();
    res.status(200).send("اطلاعات با موفقیت ذخیره شد.");
    console.log(req.body);
  } catch (err) {
    res.status(500).send("internal server error: " + err);
  }
});


export default formRouter;
