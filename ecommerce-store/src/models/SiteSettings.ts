import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    siteName: { type: String, default: "Lumen Lagos" },
    tagline: { type: String, default: "Nigerian design for everyday living" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    announcement: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: "" },
    },
    hero: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "Your store" },
      subtitle: {
        type: String,
        default: "Add products and update this hero from the admin dashboard.",
      },
      ctaText: { type: String, default: "Shop" },
      ctaHref: { type: String, default: "/shop" },
      secondaryCtaText: { type: String, default: "" },
      secondaryCtaHref: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
      overlay: { type: Number, default: 40 },
    },
    featured: {
      heading: { type: String, default: "Featured" },
      subheading: { type: String, default: "" },
    },
    newsletter: {
      heading: { type: String, default: "Join the list" },
      subheading: { type: String, default: "" },
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    social: {
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    footer: {
      blurb: { type: String, default: "" },
      copyright: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings: Model<SiteSettingsDoc> =
  mongoose.models.SiteSettings ||
  mongoose.model<SiteSettingsDoc>("SiteSettings", SiteSettingsSchema);
