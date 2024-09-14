import mongoose, { Schema, Document } from "mongoose";

interface ProductForm extends Document {
      name: string;
      email: string;
      phone: string;
      acquaintance: string;
      job_status: string;
      education: string;
      who: string;
      company: string;
      members: number;
      factor: string;
}

const productFormSchema = new Schema<ProductForm>({
    name: {type: "string", required: true},
    email: {type: "string", required: true},
    phone: {type: "string", required: true},
    acquaintance: {type: "string", required: true},
    job_status: {type: "string", required: true},
    education: {type: "string", required: true},
    who: {type: "string"},
    company: {type: "string"},
    members: {type: "number"},
    factor: {type: "string"}
});

const ProductForm = mongoose.model<ProductForm>(
  "form_product",
  productFormSchema
);
export default ProductForm;
