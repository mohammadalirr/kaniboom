import mongoose, { Schema, Document } from "mongoose";

interface MasirForm extends Document {
  name: string;
  phone: string;
  email: string;
  how: string;
  applicant: string;
  members: string;
  fileId: Schema.Types.ObjectId;
}

const masirFormSchema = new Schema<MasirForm>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  how: { type: String, required: true },
  applicant: { type: String, required: true },
  members: { type: String },
  fileId: { type: Schema.Types.ObjectId, required: true },
});

const MasirForm = mongoose.model<MasirForm>("form_masir", masirFormSchema);
export default MasirForm;
