import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  type: "events" | "news" | "kanicamps" | "bootcamps" | "startups" | string;
  name: string;
  author: string;
  head: {
    logo_img: string;
    bg_img: string;
    html: string;
    date: string;
    is_manual: boolean;
  }[];
  summary: {
    img: string;
    html: string;
    is_manual: boolean;
  }[];
  blocks: {
    html: string;
    is_manual: boolean;
    bg_text: string;
  }[];
  persons: {
    title: string;
    profiles: { img: string; name: string; desc: string; inc: string }[];
    bg_text: string;
  }[];
  gallery: {
    title: string;
    imgs: string[];
    size: "sm" | "lg" | "";
    bg_text: string;
  }[];
  location: {
    city: string;
    desc: string;
    coord: { x: number; y: number };
  }[];
  roadmap: {
    title: string;
    html: string;
    bg_text: string;
    is_manual: boolean;
  }[];
  form: {
    title: string;
    inputs: string[];
    bg_text: string;
  }[];
  preview: {
    title: string;
    description: string;
    img: string;
  }[];
}

const eventSchema = new Schema<IPage>(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, required: true },
    head: [
      {
        logo_img: String, // Store as string path/URL
        bg_img: String,
        html: String,
        date: String,
        is_manual: Boolean,
      },
    ],
    summary: [
      {
        img: String, // Store as string path/URL
        html: String,
        is_manual: Boolean,
      },
    ],
    blocks: [
      {
        html: String,
        is_manual: Boolean,
        bg_text: String,
      },
    ],
    persons: [
      {
        title: String,
        profiles: [
          {
            img: String, // Store as string path/URL
            name: String,
            desc: String,
            inc: String,
          },
        ],
        bg_text: String,
      },
    ],
    gallery: [
      {
        title: String,
        imgs: [String], // Store as array of string paths/URLs
        size: String,
        bg_text: String,
      },
    ],
    location: [
      {
        city: String,
        desc: String,
        coord: {
          x: Number,
          y: Number,
        },
      },
    ],
    roadmap: [
      {
        title: String,
        html: String,
        bg_text: String,
        is_manual: Boolean,
      },
    ],
    form: [
      {
        title: String,
        inputs: [],
        bg_text: String,
      },
    ],
    preview: [
      {
        title: String,
        description: String,
        img: String,
      },
    ],
  },
  { timestamps: true }
);

const Page = mongoose.model<IPage>("Page", eventSchema);
export default Page;
