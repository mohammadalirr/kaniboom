import mongoose, { Schema, Document } from "mongoose";

interface PlanForm extends Document {
  title: string;
  name: string;
  team: string;
  members: string;
  phone: string;
  email: string;
  city: string;
  planPosition: string;
  subject: string;
  status: string;
  introduction: string;
  fileId: Schema.Types.ObjectId;
}

const planFormSchema = new Schema<PlanForm>({
  title: { type: String, required: true },
  name: { type: String, required: true },
  team: { type: String },
  members: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String },
  planPosition: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, required: true },
  introduction: { type: String, required: true },
  fileId: { type: Schema.Types.ObjectId, required: true },
});

const PlanForm = mongoose.model<PlanForm>("form_plan", planFormSchema);
export default PlanForm;
