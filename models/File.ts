import mongoose, { Schema, Document } from "mongoose";

interface IFile extends Document {
  filename: string;
  email: string;
  mobile: string;
  contentType: string;
  fileId: Schema.Types.ObjectId; // ID مربوط به فایل در GridFS
}

const fileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  contentType: { type: String, required: true },
  fileId: { type: Schema.Types.ObjectId, required: true },
});

const File = mongoose.model<IFile>("File", fileSchema);
export default File;
