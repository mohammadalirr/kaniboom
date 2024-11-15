import mongoose, { Schema } from "mongoose";

const masirFormSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    how: { type: String, required: true },
    applicant: { type: String, required: true },
    members: { type: String },
    fileId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const MasirForm = mongoose.model("form_masir", masirFormSchema);
export default MasirForm;
