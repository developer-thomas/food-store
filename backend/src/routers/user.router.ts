import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { User, userModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../utils/http-status";
import bcrypt from "bcryptjs";

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
      const pipeline = [
        {
          $match: { _id: user._id },
        },
        {
          $project: {
            id: "$_id",
            email: 1,
            name: 1,
            address: 1,
            isAdmin: 1,
          },
        },
      ];
      const aggregatedUser = await userModel.aggregate(pipeline);
      // aggregate retorna um array, para o token ser inserido nele, preciso definir a posição no array
      const waitForToken = await generateTokenResponse(aggregatedUser[0]);
      res.send(await generateTokenResponse(waitForToken));
    } else {
      res.status(HTTP_BAD_REQUEST).send("Username or password incorrect!");
    }
  })
);

const generateTokenResponse = async (user: any) => {
  const payload = {
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(payload, "secretjwt", { expiresIn: "1h" });

  user.token = token;
  return user;
};

// registro
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const userExists = await userModel.findOne({ email: email });
    if (userExists) {
      res.status(HTTP_BAD_REQUEST).send("This email is already in use, please try again.");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 16);

    const newUser: User = {
      id: "",
      name,
      address,
      email: email.toLowerCase(),
      password: encryptedPassword,
      isAdmin: false,
    };

    const dbUser = await userModel.create(newUser);
    res.send(await generateTokenResponse(dbUser));
  })
);

export default router;
