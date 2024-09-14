import mongoose, { Schema, Document } from "mongoose";

interface ContactForm extends Document {
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
}

const contactFormSchema = new Schema<ContactForm>({
  name: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  company: { type: String },
  message: { type: String, required: true },
});

const ContactForm = mongoose.model<ContactForm>(
  "form_contact",
  contactFormSchema
);
export default ContactForm;
