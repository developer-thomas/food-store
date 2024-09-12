import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send("Seed already done!");
      return;
    }
    await FoodModel.create(sample_foods);
    res.send("Seed Done!");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);

    res.send(tags);
  })
);

router.get(
  "/tag/:tags",
  asyncHandler(async (req, res) => {
    const param = req.params.tags;
    const food = await FoodModel.find({ tags: param });
    res.send(food);
  })
);

router.get(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const foodIdParam = req.params.foodId;
    const foodById = await FoodModel.findById(foodIdParam);
    res.send(foodById);
  })
);

export default router;
