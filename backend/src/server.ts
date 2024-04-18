import express from "express";
import cors from "cors";
import { sample_foods, sample_tags } from "./data";

const app = express();
// configuração do middleware cors para conseguirmos usar o front na porta 4200 sem erro de cors
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.get("/api/foods", (req, res) => {
  res.send(sample_foods);
});

app.get("/api/foods/search/:searchTerm", (req, res) => {
  const searchTerm = req.params.searchTerm;
  const foods = sample_foods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()));
  res.send(foods);
  // res.send(searchTerm);
});

app.get("/api/foods/tags", (req, res) => {
  res.send(sample_tags);
});

app.get("/api/foods/tag/:tags", (req, res) => {
  const tagName = req.params.tags;
  const foodByTag = sample_foods.filter((food) => food.tags.toLowerCase().includes(tagName.toLocaleLowerCase()));
  res.send(foodByTag);
});

app.get("/api/foods/:foodId", (req, res) => {
  const id = req.params.foodId;
  const findById = sample_foods.find((food) => food.id == id);
  res.send(findById);
});

const port = 5000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
