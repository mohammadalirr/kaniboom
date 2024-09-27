import mongoose, { Schema } from "mongoose";


const productFormSchema = new Schema({
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

const ProductForm = mongoose.model(
  "form_product",
  productFormSchema
);
export default ProductForm;
