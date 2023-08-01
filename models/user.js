import { Schema, model } from "mongoose";

import { handleSaveError, allowUpdateValidate } from "./hooks/index.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },

    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
    },
  }, { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", allowUpdateValidate);

userSchema.post("findOneAndUpdate", handleSaveError);

userSchema.post("save", handleSaveError);


const User = model("user", userSchema);

export default User;