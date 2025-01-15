import mongoose, { Schema } from "mongoose";

interface IMainPage {
  type: string;
  slides: { img: string; link: string }[];
  phone: string;
  mobile: string;
  email: string;
  instagram: string;
  linkedin: string;
  intro: string;
  portfo_img: string;
  full_address: string;
  loc_address: string;
  stats: {
    funds: number;
    reqs: number;
    preboosts: number;
    boosts: number;
    jobs: number;
    tuts: number;
  };
}

const mainSchema = new Schema<IMainPage>(
  {
    type: { type: String, default: "main" },
    slides: [{ img: String, link: String }],
    phone: String,
    email: String,
    mobile: String,
    instagram: String,
    linkedin: String,
    intro: String,
    portfo_img: String,
    full_address: String,
    loc_address: String,
    stats: {
      funds: Number,
      reqs: Number,
      preboosts: Number,
      boosts: Number,
      jobs: Number,
      tuts: Number,
    },
  },
  { timestamps: true }
);

const Main = mongoose.model<IMainPage>("Main", mainSchema);
export default Main;
