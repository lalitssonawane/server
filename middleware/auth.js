import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodeData = null;
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, "test");

      req.userId = decodeData?.id;
    } else {
      decodeDate = jwt.decode(token);

      req.userId = decodeData?.sub;
    }

    next();
  } catch (error) {
    console.log("🚀 ~ file: auth.js:21 ~ auth ~ error:", error);
  }
};

export default auth;
