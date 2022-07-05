import User from "../models/User.js";
import {
  sendMail,
  getTemplate,
  getTemplatePassword,
} from "../config/mailer.config.js";
import { getToken, getTokenData } from "../config/jwt.config.js";
export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const usernameDb = await User.findOne({ username: username });
    if (usernameDb) {
      return res.status(404).json({ message: "existing username" });
    }
    const userDb = await User.findOne({ email: email });
    if (userDb) {
      return res.status(404).json({ message: "existing user" });
    }
    const user = await new User({
      name,
      username,
      email,
      password,
    });
    user.password = await user.encryptPassword(user.password);
    const token = getToken(user.email);
    const html = getTemplate(user.name, token);

    await sendMail(user.email, "Mail de Prueba", html);
    await user.save();
    res.status(201).json({ message: "create user success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const comparePassword = await user.validatePassword(password);
    if (!comparePassword) {
      return res.status(404).json({ message: "password not found" });
    }
    if (user.status === false) {
      return res
        .status(404)
        .json({ message: "unauthorized profile, please check your mailbox" });
    }
    const token = getToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.data);
    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "invalid link" });

    const { data } = getTokenData(token);
    if (!data) {
      return res.status(404).json({ message: "Invalid data" });
    }
    const user = await User.findOne({ email: data });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    await user.updateOne({ email: data, status: true });

    return res.redirect("/login");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const token = getToken(user.email);
    const password = getTemplatePassword(user.name, token);
    await sendMail(user.email, "Forget Password", password);
    res.status(201).json({ message: "check your email for change password" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const verifyPassword = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "invalid link" });
    }

    const { data } = getTokenData(token);
    if (!data) {
      return res.status(404).json({ message: "Invalid data" });
    }

    const user = await User.findOne({ email: data });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.status(200).json({ message: "Token valid" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const newPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "invalid link" });
    }

    const { data } = getTokenData(token);
    if (!data) {
      return res.status(404).json({ message: "Invalid data" });
    }

    const user = await User.findOne({ email: data });
    if (!user) return res.status(404).json({ message: "user not found" });
    user.password = await user.encryptPassword(password);
    await user.updateOne({ email: data, password: user.password });
    res.status(200).json({ message: "new password" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
