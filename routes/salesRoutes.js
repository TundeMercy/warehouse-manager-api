const joi = require("joi");
import express from "express";
import sales from "../sales";
import authRoute from "./authRoute";
import products from "../entity-managers/products";
import users from "../entity-managers/users";

const salesRoutes = express.Router();

const validateSale = user => {
  const schema = joi.object().keys({
    product_id: joi.number().required(),
    seller_id: joi.number().required(),
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
  try {
    const sale = await sales.getSale(saleID);
    return res.status(200).json(sale);
  } catch (error) { 
  return res.status(404).json({
    error: {
      code: 404,
      message: "Sale not found"
    }
  });  
  }
})();
});

salesRoutes.post("/", authRoute(["attendant"]), (req, res) => {
  (async () => {
    const { body: saleToAdd } = req;
    const { error } = validateSale(saleToAdd);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    saleToAdd.id = await sales.getLastID() + 1;
    try {
      const product = await products.getProduct(saleToAdd.product_id);
      await users.getUser(saleToAdd.seller_id);

      if(product.quantity < saleToAdd.quantity_sold){
        return res.status(501).json({error:{
          code: 501,
          message: "quantity_sold cannot be greater than what's is store"
        }});
      }
      await sales.addSale(saleToAdd);
      return res.status(200).json(await sales.getSale(saleToAdd.id));
    } catch (error) {
      return res.status(501).json({error: {
        code: 501,
        message: "Invalid product_id or seller_id"
      }});
    }
  })();
});

export default salesRoutes;
