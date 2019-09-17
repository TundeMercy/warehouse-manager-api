const joi = require("joi");
import express from "express";
import sales from "../sales";
import authRoute from "./authRoute";

const salesRoutes = express.Router();

const validateSale = user => {
  const schema = joi.object().keys({
    id: joi.number().required(),
    item_sold: joi.number().required(),
    sold_by: joi.number().required(),
    unit_price: joi.string().required(),
    quantity_sold: joi.number().required()
  });

  return joi.validate(user, schema);
};

salesRoutes.get("/", authRoute(["admin"]), (req, res) => {
  (async () => {
    res.status(200).json(await sales.getAll());
  })();
});

salesRoutes.get("/:saleID", authRoute(["admin"]), (req, res) => {
(async () => {
  const { saleID } = req.params;
  const sale = await sales.getSale(saleID);
  if (sale) {
    return res.status(200).json(sale);
  }
  return res.status(404).json({
    error: {
      code: 404,
      message: "Sale not found"
    }
  });
})();
});

salesRoutes.post("/", authRoute(["attendant"]), (req, res) => {
  (async () => {
    const { body: saleToAdd } = req;
    saleToAdd.id = await sales.getLastID() + 1;
    const { error } = validateSale(saleToAdd);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    await sales.addSale(saleToAdd);
    return res.status(200).json(await sales.getSale(saleToAdd.id));
  })();
});

export default salesRoutes;
