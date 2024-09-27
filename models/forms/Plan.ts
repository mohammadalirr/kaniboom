import mongoose, { Schema } from "mongoose";


const planFormSchema = new Schema({
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

const PlanForm = mongoose.model("form_plan", planFormSchema);
export default PlanForm;
