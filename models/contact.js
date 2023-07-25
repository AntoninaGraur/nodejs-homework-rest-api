import { Schema, model } from "mongoose";

import {handleSaveError} from "./hooks/index.js";



const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, "Set name for contact"],
    },
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
}, { versionKey:false, timestamps: true});

contactSchema.pre("findOneAndUpdate", function (next) {
    this.options.runValidators = true;
    next();
})

contactSchema.post("findOneAndUpdate", handleSaveError);

contactSchema.post("save", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
