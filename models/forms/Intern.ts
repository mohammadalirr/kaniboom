import mongoose, { Schema, Document } from "mongoose";

interface InternForm extends Document {
  name: string;
  phone: string;
  email: string;
  field: string;
  stage: string;
  university: string;
  motivation: string;
}

const internFormSchema = new Schema<InternForm>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  field: { type: String, required: true },
  stage: { type: String, required: true },
  university: { type: String, required: true },
  motivation: { type: String, required: true },

});

const InternForm = mongoose.model<InternForm>(
  "form_intern",
  internFormSchema
);
export default InternForm;
