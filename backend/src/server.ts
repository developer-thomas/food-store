import express from "express";
import cors, { CorsOptions } from "cors";
import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";
import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./configs/database.config";

const app = express();

dbConnect();
// Habilitar o uso de JSON no express, por padrão não aceita json
app.use(express.json());
// configuração do middleware cors para conseguirmos usar o front na porta 4200 sem erro de cors

const corsOptions: CorsOptions = {
  origin: "http://localhost:4200",
  methods: "GET, POST, PATCH, PUT, DELETE",
};

app.use(cors(corsOptions));

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

const port = 5000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
