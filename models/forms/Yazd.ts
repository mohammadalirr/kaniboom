import mongoose, { Schema } from "mongoose";

const yazdFormSchema = new Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    company: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const YazdForm = mongoose.model("form_yazd", yazdFormSchema);
export default YazdForm;
