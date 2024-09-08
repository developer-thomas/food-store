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

router.get("/search/:searchTerm", (req, res) => {
  const searchTerm = req.params.searchTerm;
  const foods = sample_foods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()));
  res.send(foods);
  // res.send(searchTerm);
});

router.get("/tags", (req, res) => {
  res.send(sample_tags);
});

router.get("/tag/:tags", (req, res) => {
  const tagName = req.params.tags;
  const foodByTag = sample_foods.filter((food) => food.tags.toLowerCase().includes(tagName.toLocaleLowerCase()));
  res.send(foodByTag);
});

router.get("/:foodId", (req, res) => {
  const id = req.params.foodId;
  const findById = sample_foods.find((food) => food.id == id);
  res.send(findById);
});

export default router;
