import { Router } from "express";
import { sample_foods, sample_tags } from "../data";

const router = Router();

router.get("/", (req, res) => {
  res.send(sample_foods);
});

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
