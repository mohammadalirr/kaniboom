import mongoose, { Schema } from "mongoose";

const formSchema = new Schema(
  {
    type: { type: String },
    page: { type: String },
    name: { type: String },
    birth: { type: String },
    code: { type: String },
    duty: { type: String },
    marital: { type: String },
    education: { type: String },
    field: { type: String },
    university: { type: String },
    semester: { type: String },
    phone: { type: String },
    email: { type: String },
    history: { type: String },
    more: { type: String },
    upload: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

const Form = mongoose.model("form", formSchema);
export default Form;
