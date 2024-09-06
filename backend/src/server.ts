import express from "express";
import cors from "cors";
import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";

const app = express();

app.use("/api/foods", foodRouter);
app.use("api/users", userRouter);

// Habilitar o uso de JSON no express, por padrão não aceita json
app.use(express.json());

// configuração do middleware cors para conseguirmos usar o front na porta 4200 sem erro de cors
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

const port = 5000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
