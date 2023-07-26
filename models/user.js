import { Schema, model } from "mongoose";

import { handleSaveError, allowUpdateValidate } from "./hooks/index.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
        type: String,
      match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", allowUpdateValidate);

userSchema.post("findOneAndUpdate", handleSaveError);

userSchema.post("save", handleSaveError);


const User = model("users", userSchema);

export default User;