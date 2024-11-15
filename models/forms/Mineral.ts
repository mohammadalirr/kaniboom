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

const MineralForm = mongoose.model("form_mineral", sadafFormSchema);
export default MineralForm;
