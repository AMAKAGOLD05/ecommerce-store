import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    published: { type: Boolean, default: true },
    showInFooter: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

export type PageDoc = InferSchemaType<typeof PageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Page: Model<PageDoc> =
  mongoose.models.Page || mongoose.model<PageDoc>("Page", PageSchema);
