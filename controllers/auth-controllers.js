import { ctrlWrapper } from "../decorators/index.js";
import{ HttpError, sendEmail} from "../helpers/index.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import gravatar from "gravatar";
import { nanoid } from "nanoid";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

dotenv.config();
const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificatinCode = nanoid();

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificatinCode,
  });
  
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a  href="${BASE_URL}api/auth/verify/${verificatinCode} "target="_blank">Click for verification</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const verify = async (req, res) => {
  const { verificatinCode } = req.params;
  const user = await User.findOne({ verificatinCode });
  if (!user) {
    throw HttpError(400, "Invalid code")
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificatinCode: "" });
  res.json({
    message: "Verify success",
  })
    
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

 if (!user.verify) {
   throw HttpError(401, "Email or password is wrong");
 }


  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "You have been logged out",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

const resendVerifyEmail = async (req, res) => { 
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) { 
    throw HttpError(400, "Invalid email address")
  }
  if (user.verify) {
  throw HttpError(400, "Email is already verified")
  }
   const verifyEmail = {
     to: email,
     subject: "Verify email",
     html: `<a  href="${BASE_URL}api/auth/verify/${user.verificatinCode} "target="_blank">Click for verification</a>`,
   };
  await sendEmail(verifyEmail);
  
  res.json({
    message: "Email resended"
  })
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
