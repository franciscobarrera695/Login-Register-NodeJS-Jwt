import { getTokenData } from "../config/jwt.config.js";


export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({
        
        message: "no token provided"
      });
    }
    const decoded = getTokenData(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};
