import mongoose, { Schema } from "mongoose";


const internFormSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  field: { type: String, required: true },
  stage: { type: String, required: true },
  university: { type: String, required: true },
  motivation: { type: String, required: true },
});

const InternForm = mongoose.model(
  "form_intern",
  internFormSchema
);
export default InternForm;
