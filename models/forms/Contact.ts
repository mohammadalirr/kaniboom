import mongoose, { Schema } from "mongoose";


const contactFormSchema = new Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  company: { type: String },
  message: { type: String, required: true },
  page: { type: String }
});

const ContactForm = mongoose.model(
  "form_contact",
  contactFormSchema
);
export default ContactForm;
