import User from "../models/User.js";
import { getToken } from "../config/jwt.config.js";
export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const usernameDb = await User.findOne({ username: username });
    if(usernameDb){
        return res.status(404).json({message:"existing username"});
    }
    const userDb = await User.findOne({ email: email });
    if(userDb){
        return res.status(404).json({message:"existing user"});
    }
    const user = await new User({
      name,
      username,
      email,
      password,
    });
    user.password = await user.encryptPassword(user.password);
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
      return res.status(404).json({message:"user not found"});
    }
    const comparePassword = await user.validatePassword(password);
    if (!comparePassword) {
      return res.status(404).json({message:"password not found"});
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
      return res.status(404).json({message:"No User Found"});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
