import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exitingUser = await User.findOne({ email });

    if (!exitingUser)
      return res.status(404).json({ message: "User doesn't exists. " });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      exitingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { email: exitingUser.email, id: exitingUser._id },
      "test",
      { expiresIn: "100h" }
    );

    res.status(200).json({ result: exitingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong." });
  }
};
export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists. " });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "password don't match. " });

    const hashPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: email, id: result._id }, "test", {
      expiresIn: "100h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "SomeThing went wrong", error });
  }
};
