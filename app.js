const debug = require('debug')('app');
import express from "express";
import chalk from "chalk";
import productsRoutes from "./routes/productsRoutes";
import salesRoutes from "./routes/salesRoutes";
import usersRoutes from "./routes/usersRoutes";
import bodyParser from "body-parser";

debug("app");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/products", productsRoutes);
app.use("/sales", salesRoutes);
app.use("/users", usersRoutes);

const PORT = process.env.PORT || 5002;
app.listen(
  PORT,
  debug(chalk.yellow(`listening on port: ${chalk.green.bold(PORT)}`))
);
