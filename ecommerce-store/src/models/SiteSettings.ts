import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    siteName: { type: String, default: "Lumen Lagos" },
    tagline: { type: String, default: "Nigerian design for everyday living" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    announcement: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: "Free nationwide shipping on orders over ₦80,000 · Pay on delivery available",
      },
    },
    hero: {
      enabled: { type: Boolean, default: true },
      eyebrow: { type: String, default: "Made in Nigeria" },
      title: { type: String, default: "Quiet luxury, from Lagos to your door" },
      subtitle: {
        type: String,
        default:
          "Adire, aso-oke, and home objects from Nigerian makers — delivered across the country, pay on delivery.",
      },
      ctaText: { type: String, default: "Shop the collection" },
      ctaHref: { type: String, default: "/shop" },
      secondaryCtaText: { type: String, default: "Our story" },
      secondaryCtaHref: { type: String, default: "/p/about" },
      imageUrl: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1618828665347-d870c38c95c7?auto=format&fit=crop&w=1800&q=80",
      },
      overlay: { type: Number, default: 40 },
    },
    featured: {
      heading: { type: String, default: "This week in the studio" },
      subheading: { type: String, default: "New pieces from Lagos, Abeokuta, and Benin City." },
    },
    newsletter: {
      heading: { type: String, default: "Join the list" },
      subheading: { type: String, default: "Early access to drops, stories, and private sales." },
    },
    contact: {
      email: { type: String, default: "hello@lumen.ng" },
      phone: { type: String, default: "+234 809 441 2288" },
      address: { type: String, default: "14 Adeola Odeku Street, Victoria Island, Lagos" },
    },
    social: {
      instagram: { type: String, default: "https://instagram.com" },
      twitter: { type: String, default: "https://x.com" },
    },
    footer: {
      blurb: {
        type: String,
        default: "A Lagos shop for considered Nigerian clothing, objects, and gifts. We deliver nationwide.",
      },
      copyright: { type: String, default: "Lumen Lagos. All rights reserved." },
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
