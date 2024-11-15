import mongoose, { Schema } from "mongoose";

const sadafFormSchema = new Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    company: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const SadafForm = mongoose.model("form_sadaf", sadafFormSchema);
export default SadafForm;
