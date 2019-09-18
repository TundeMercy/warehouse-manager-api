const joi = require('joi');
const debug = require('debug')('app:usersRoutes');
import express from "express";

import users from "../entity-managers/users";
import authRoute from "./authRoute";

const usersRoutes = express.Router();

const validateUser = user => {
  const schema = joi.object().keys({
    email: joi.string(),
    role: joi.string().required(),
    first_name: joi.string(),
    mobile_number: joi.number(),
    image_url: joi.string(),
    sale: joi.number()
  });

  return joi.validate(user, schema);
};

usersRoutes.get("/", authRoute(["admin", "attendant"]), (req, res) => {
  (async () => {
    res.status(200).json(await users.getAll());
  })();
  
});

usersRoutes.get("/:userID", authRoute(["admin", "attendant"]), (req, res) => {
  const { userID } = req.params;
  (async () => {
    const user = await users.getUser(userID);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({
      error: {
        code: 404,
        message: "User not found"
      }
    });
  })();
});

usersRoutes.post("/", authRoute(["admin"]), (req, res) => {
  (async () => {
    const { body: userToAdd } = req;
    const { error } = validateUser(userToAdd);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    userToAdd.id = await users.getLastID() + 1;
    await users.addUser(userToAdd);
    return res.status(200).json(await users.getUser(userToAdd.id));
  })();
});

export default usersRoutes;
