import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { userModel } from "../models/user.model";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await userModel.countDocuments();
    if (usersCount > 0) {
      res.send("Already Seeded!");
      return;
    }
    await userModel.create(sample_users);
    res.send("Users Seeded!");
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });

    if (user) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(400).send("Username or password incorrect!");
    }
  })
);

const generateTokenResponse = (user: any) => {
  const payload = {
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(payload, "secret_jwt", { expiresIn: "30d" });

  user.token = token;
  return user;
};

export default router;
