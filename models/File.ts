import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
  filename: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  contentType: { type: String, required: true },
  fileId: { type: Schema.Types.ObjectId, required: true },
});

const File = mongoose.model("File", fileSchema);
export default File;
