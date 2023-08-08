import { Schema, model } from "mongoose";

import { handleSaveError, allowUpdateValidate } from "./hooks/index.js";

const contactSchema = new Schema(
  {
   
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.pre("findOneAndUpdate", allowUpdateValidate);

contactSchema.post("findOneAndUpdate", handleSaveError);

contactSchema.post("save", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
